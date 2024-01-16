import { Stack, StackProps, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';

interface ICustomStackProps extends StackProps {
  children: React.ReactElement | React.ReactElement[];
}

const CustomStack: React.FunctionComponent<ICustomStackProps> = ({ children, ...rest }) => (
  <Stack spacing={4} p={4} align={'center'} boxShadow={'md'} borderRadius={'md'} w={'100%'} bg={useColorModeValue('white', 'gray.700')} {...rest}>
    {children}
  </Stack>
);

export default CustomStack;
