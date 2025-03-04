import { Card, Heading } from '@radix-ui/themes';
import React, { useEffect } from 'react';

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const BuildInfoComponent: React.FC<Props> = () => {
  const [buildInformation, setBuildInformation] = React.useState('');

  useEffect(() => {
    setBuildInformation(cv.getBuildInformation());
  });

  return (
    <React.Fragment>
      <Card m="8">
        <Heading>OpenCV BuildInformation</Heading>
        <div style={{ whiteSpace: 'pre-line' }}>{buildInformation}</div>
      </Card>
    </React.Fragment>
  );
};

export { BuildInfoComponent };
