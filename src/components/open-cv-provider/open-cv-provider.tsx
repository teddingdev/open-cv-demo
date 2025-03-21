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
    console.log('OpenCVProvider mounted');
  }, []);

  useEffect(() => {
    window.Module = {
      // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
      onRuntimeInitialized,
    };
    const script = document.createElement('script');
    const opencvSrc = new URL("/js/opencv_4_10_0.js", import.meta.url).href;
    script.setAttribute('src', opencvSrc);
    document.body.appendChild(script);
  }, []);

  return openCVReady && props.children;
};

export { OpenCVProvider };
