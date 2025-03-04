import React from 'react';
import { Outlet } from 'react-router';
import { OpenCVProvider } from '@/components/open-cv-provider/open-cv-provider';

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const OpenCVComponent: React.FC<Props> = () => {
  return (
    <OpenCVProvider>
      <Outlet></Outlet>
    </OpenCVProvider>
  );
};

export { OpenCVComponent };
