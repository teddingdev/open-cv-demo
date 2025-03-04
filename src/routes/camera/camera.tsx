import { Card, Flex, Heading, Button, Select } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { CameraIcon } from '@radix-ui/react-icons';
import styles from './camera.module.scss';
// import haarcascade_frontalface_default from '@/assets/haarcascades/haarcascade_frontalface_default.xml';
import haarcascade_frontalface_default from '@/assets/haarcascades/haarcascade_frontalcatface.xml';

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

  const getMedicaDevices = () => {
    // 获取 视频/音频 权限
    // 查询 当前可枚举设备
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
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

  const drawVideoToCanvas = (width: number, height: number) => {
    canvasRef
      .current!.getContext('2d')!
      .drawImage(videoRef.current!, 0, 0, width, height);
    requestAnimationFrame(() => drawVideoToCanvas(width, height));
  };

  /** 将 canvas 存储到 图片 */
  const takePhoto = () => {
    const data = canvasRef.current!.toDataURL('image/png');
    previewRef.current!.setAttribute('src', data);
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

  const createProcessVideo = () => {
    const video = videoRef.current!;
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat();
    let cap = new cv.VideoCapture(video);
    let faces = new cv.RectVector();
    let classifier = new cv.CascadeClassifier();
    const processVideo = () => {
      classifier.load('haarcascade_frontalface_default.xml');
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
        cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
        // detect faces.
        classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
        // draw faces.
        for (let i = 0; i < faces.size(); ++i) {
          let face = faces.get(i);
          let point1 = new cv.Point(face.x, face.y);
          let point2 = new cv.Point(face.x + face.width, face.y + face.height);
          cv.rectangle(dst, point1, point2, [255, 0, 0, 255], 2);
        }
        cv.imshow('canvasOutput', dst);
        // schedule the next one.
        requestAnimationFrame(processVideo);
      } catch (err) {
        console.error(err);
      }
    };
    return processVideo;
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
              if (
                width?.max &&
                height?.max &&
                canvasRef.current &&
                videoRef.current
              ) {
                canvasRef.current.width = width.max;
                canvasRef.current.height = height.max;
                canvasRef.current.style.width = `${width.max / 2}px`;
                canvasRef.current.style.height = `${height.max / 2}px`;
                videoRef.current.width = width.max / 2;
                videoRef.current.height = height.max / 2;
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                // 将当前视频写入canvas画布
                // drawVideoToCanvas(width.max, height.max);
                createFileFromUrl(
                  haarcascade_frontalface_default,
                  'haarcascade_frontalface_default.xml',
                  createProcessVideo(),
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
        <Heading size="4">Camera Preview</Heading>
        <video ref={videoRef} />
        <Heading size="4">{title}</Heading>
        <canvas id="canvasOutput" ref={canvasRef} className={styles.canvas} />
        <Button
          size="3"
          className="pos-absolute right-4px bottom-4px cursor-pointer"
          onClick={takePhoto}
        >
          <CameraIcon width={24} height={24} />
          Take Snapshot
        </Button>
      </Flex>
      <Flex align="center" justify="center"></Flex>
      <Flex gap="4" my="4" align="center">
        <Heading size="4">Snapshot Preview</Heading>
        <img ref={previewRef} className={styles.preview} />
      </Flex>
    </Card>
  );
};

export { CameraComponent };
