import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../nav';

const Root: React.FunctionComponent = () => {
  return (
    <Box data-testid="app">
      <Nav />
      <Container
        data-testid="app-container"
        maxW={'container.xl'}
        p={{ base: 4, md: 6 }}
        mt={{ base: '48px', md: '64px' }}
        bg={useColorModeValue('blue.100', 'blue.800')}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default Root;
