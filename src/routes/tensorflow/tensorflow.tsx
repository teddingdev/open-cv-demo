import React from 'react';

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const TensorFlowComponent: React.FC<Props> = ({ className, style }) => {
  return (
    <div className={className} style={style}>
      <h1>TensorFlowComponent</h1>
    </div>
  );
};

export { TensorFlowComponent };
