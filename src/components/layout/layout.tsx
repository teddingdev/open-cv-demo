import React from 'react';
import { Outlet } from 'react-router';

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const LayoutComponent: React.FC<Props> = () => {
  return <Outlet />;
};

export { LayoutComponent };
