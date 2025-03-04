import React, { PropsWithChildren, useEffect } from 'react';

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const OpenCVProvider: React.FC<PropsWithChildren<Props>> = (props) => {
  const [openCVReady, setOpenCVReady] = React.useState(false);

  const onRuntimeInitialized = () => {
    setOpenCVReady(true);
  };

  useEffect(() => {
    window.Module = {
      // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
      onRuntimeInitialized,
    };
    const openCV = document.createElement('script');
    openCV.setAttribute('src', '/src/assets/opencv_4_10_0.js');
    openCV.setAttribute('async', 'true');
    document.head.appendChild(openCV);
  }, []);

  return openCVReady && props.children;
};

export { OpenCVProvider };
