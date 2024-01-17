import { Flex } from '@chakra-ui/react';
import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './Login';

const AuthLayout: React.FunctionComponent = () => {
  return (
    <Flex
      data-testid="page_AuthLayout"
      flexDir={'column'}
      w={'100%'}
      h={{ base: 'calc(100vh - 162px)', md: 'calc(100vh - 112px)' }}
      justify={'center'}
      align={'center'}
      bg={'red.300'}
    >
      <Flex justify={'center'} align={'center'} minW={{ base: '80%', md: 400 }} maxW={{ base: '80%', md: 400 }}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<div>Login (ADMIN)</div>} />
          <Route path="*" element={<Navigate to="login" />} />
        </Routes>
      </Flex>
    </Flex>
  );
};

export default AuthLayout;
