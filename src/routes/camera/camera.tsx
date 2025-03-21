import { Card, Flex, Heading, Button, Select } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { CameraIcon } from '@radix-ui/react-icons';
import styles from './camera.module.scss';
import haarcascade_frontalface_default from '@/assets/haarcascades/haarcascade_frontalface_default.xml';
import classNames from 'classnames';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

const CameraComponent: React.FC<Props> = ({ className, style, title }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const previewRef = React.useRef<HTMLImageElement>(null);
  const videoDevices = React.useRef<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = React.useState<string>();

  const mediaConstraints: MediaStreamConstraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  };

  const getMedicaDevices = () => {
    // 获取 视频/音频 权限
    // 查询 当前可枚举设备
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          videoDevices.current = devices
            .filter((device) => device.kind === 'videoinput')
            .reverse();
          setSelectedDevice(videoDevices.current[0].deviceId);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const drawVideoToCanvas = (
    source: HTMLVideoElement,
    target: HTMLCanvasElement,
  ) => {
    target
      .getContext('2d')!
      .drawImage(source, 0, 0, target.width, target.height);
  };

  /** 将 canvas 存储到 图片 */
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !previewRef.current) return;
    // 将当前视频写入canvas画布
    drawVideoToCanvas(videoRef.current, canvasRef.current);
    const data = canvasRef.current!.toDataURL('image/png');
    document.createElement('canvas');
    previewRef.current!.setAttribute('src', data);
    canvasRef.current!.toBlob((image) => {
      const snapshot = new File([image!], 'snapshot.png', {
        type: 'image/png',
      });
      const body = new FormData();
      body.append('image_file', snapshot);
    });
  };

  // load pre-trained classifiers
  const createFileFromUrl = (
    url: string,
    filename: string,
    callback: Function,
  ) => {
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        let data = new Uint8Array(buffer);
        cv.FS_createDataFile('/', filename, data, true, true, true);
        callback();
      });
  };

  const createProcessVideo = (width: number, height: number) => {
    const video = videoRef.current;
    let src = new cv.Mat(height, width, cv.CV_8UC4);
    let dst = new cv.Mat(height, width, cv.CV_8UC4);
    let alphaMask = new cv.Mat(height, width, cv.CV_8UC4);
    let mask = new cv.Mat(height, width, cv.CV_8UC4);
    let gray = new cv.Mat();
    let cap = new cv.VideoCapture(video);
    let faces = new cv.RectVector();
    let classifier = new cv.CascadeClassifier();

    // load pre-trained classifiers
    classifier.load('haarcascade_frontalface_default.xml');

    const processVideo = () => {
      console.log('processVideo');
      try {
        // if (!streaming) {
        //   // clean and stop.
        //   src.delete();
        //   dst.delete();
        //   gray.delete();
        //   faces.delete();
        //   classifier.delete();
        //   return;
        // }
        // let begin = Date.now();
        // start processing.
        cap.read(src);
        src.copyTo(dst);
        alphaMask.copyTo(mask);
        cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
        // detect faces.
        classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
        // draw faces.
        for (let i = 0; i < faces.size(); ++i) {
          let face = faces.get(i);
          let point1 = new cv.Point(face.x, face.y);
          let point2 = new cv.Point(face.x + face.width, face.y + face.height);
          cv.rectangle(mask, point1, point2, [255, 0, 0, 255], 2);
        }
        cv.imshow('canvasOutput', mask);
        // schedule the next one.
        requestAnimationFrame(processVideo);
      } catch (err) {
        console.error(err);
      }
    };

    // schedule the first one.
    setTimeout(processVideo, 0);
  };

  // 切换设备
  useEffect(
    selectedDevice
      ? () => {
          navigator.mediaDevices
            .getUserMedia({ video: { deviceId: selectedDevice } })
            .then((stream) => {
              const track = stream.getVideoTracks()[0];
              const capabilities = track.getCapabilities();
              const { width, height } = capabilities;
              const canvas = canvasRef.current;
              const video = videoRef.current;
              const preview = previewRef.current;
              if (width?.max && height?.max && video && canvas && preview) {
                canvas.width = width.max;
                canvas.height = height.max;
                canvas.style.width = `${width.max / 2}px`;
                canvas.style.height = `${height.max / 2}px`;
                video.width = width.max / 2;
                video.height = height.max / 2;
                video.srcObject = stream;
                video.play();
                preview.width = width.max / 2;
                preview.height = height.max / 2;
                // 将当前视频写入canvas画布
                // drawVideoToCanvas(canvasRef.current, width.max, height.max);
                createFileFromUrl(
                  haarcascade_frontalface_default,
                  'haarcascade_frontalface_default.xml',
                  () =>
                    createProcessVideo(
                      videoRef.current!.width,
                      videoRef.current!.height,
                    ),
                );
              }
            });
        }
      : () => {},
    [selectedDevice],
  );

  useEffect(() => {
    getMedicaDevices();
  }, []);

  return (
    <Card className={className} style={style}>
      <Flex gap="4" align="center">
        <Heading size="4">Camera Devices</Heading>
        <Select.Root value={selectedDevice} onValueChange={setSelectedDevice}>
          <Select.Trigger />
          <Select.Content>
            {videoDevices.current.map((device) => (
              <Select.Item value={device.deviceId} key={device.deviceId}>
                {device.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
      <Flex gap="4" my="4" align="center" className="pos-relative">
        <Heading className={styles.heading} size="4">
          {title}
        </Heading>
        <div className="pos-relative">
          <video ref={videoRef} className={styles.video} />
          <canvas
            id="canvasOutput"
            ref={canvasRef}
            className={classNames(
              styles.canvas,
              'pos-absolute',
              'top-0px',
              'right-0px',
            )}
          />
          <Button
            size="3"
            className="pos-absolute right-4px bottom-4px cursor-pointer"
            onClick={takePhoto}
          >
            <CameraIcon width={24} height={24} />
            Take Snapshot
          </Button>
        </div>
        <Heading className={styles.heading} size="4">
          Snapshot Preview
        </Heading>
        <img
          alt="Snapshot Preview"
          ref={previewRef}
          className={styles.preview}
        />
      </Flex>
    </Card>
  );
};

export { CameraComponent };
