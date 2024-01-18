import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import * as React from 'react';

interface IErrorBoxProps extends BoxProps {
  error: FetchBaseQueryError | SerializedError | string;
}

const ErrorBox: React.FunctionComponent<IErrorBoxProps> = (props) => {
  const { error, ...rest } = props;
  return (
    <Box
      p={4}
      bg={useColorModeValue('red.500', 'red.200')}
      color={useColorModeValue('white', 'gray.700')}
      borderRadius={'md'}
      border="1px solid"
      borderColor={useColorModeValue('white', 'gray.700')}
      boxShadow={'md'}
      fontSize={{ base: '0.6em', md: '1em' }}
      {...rest}
    >
      {typeof error === 'string' ? error : <pre>{JSON.stringify(error, null, 2)}</pre>}
    </Box>
  );
};

export default ErrorBox;
