import React from 'react';
import { CameraComponent } from '../camera/camera';

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const CatsComponent: React.FC<Props> = ({ className, style }) => {
  return <CameraComponent className={className} style={style} title='Cat Face Detection' />;
};

export { CatsComponent };
