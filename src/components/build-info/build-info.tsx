import { Button, Card, Flex, Heading } from '@radix-ui/themes';
import React, { useEffect } from 'react';
import { Link } from 'react-router';

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
      <Card>
        <Flex gap="4">
          <Heading>OpenCV BuildInformation</Heading>
          <Link to="human">
            <Button>Human</Button>
          </Link>
          <Link to="cats">
            <Button>Cats</Button>
          </Link>
        </Flex>
        <div style={{ whiteSpace: 'pre-line' }}>{buildInformation}</div>
      </Card>
    </React.Fragment>
  );
};

export { BuildInfoComponent };
