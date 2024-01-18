import { Box, Container } from '@chakra-ui/react';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../nav';
import Alert from '../../features/alert/Alert';

const Root: React.FunctionComponent = () => {
  return (
    <Box data-testid="app">
      <Alert />
      <Nav />
      <Container data-testid="app-container" maxW={'container.xl'} p={{ base: 4, md: 6 }} mt={{ base: '48px', md: '64px' }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Root;
