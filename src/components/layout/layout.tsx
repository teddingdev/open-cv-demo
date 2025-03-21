import { Box, Button, Container, Flex } from '@radix-ui/themes';
import React from 'react';
import { Link, Outlet } from 'react-router';

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

const LayoutComponent: React.FC<Props> = () => {
  return (
    <React.Fragment>
      <Box
        p="4"
        style={{
          backgroundColor: 'var(--gray-a2)',
          borderRadius: 'var(--radius-3)',
          height: '100dvh',
        }}
      >
        <Flex gap="4" justify="center" align="center">
          <Link to="/opencv">
            <Button>OpenCV</Button>
          </Link>
          <Link to="/tensorflow">
            <Button>Tensorflow</Button>
          </Link>
        </Flex>
        <Container p="4">
          <Outlet />
        </Container>
      </Box>
    </React.Fragment>
  );
};

export { LayoutComponent };
