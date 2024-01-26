import { Box, Tag, TagLabel, UseCheckboxProps, chakra, useCheckbox } from '@chakra-ui/react';
import * as React from 'react';

interface IFormikCheckboxProps extends UseCheckboxProps {
  children: string;
}

export const FormikLabelCheckbox: React.FunctionComponent<IFormikCheckboxProps> = (props) => {
  const { children } = props;
  const { state, getCheckboxProps, getInputProps, getLabelProps } = useCheckbox(props);

  return (
    <chakra.label>
      <chakra.input {...getInputProps()} />
      <Box {...getCheckboxProps()}>
        <Tag variant={state.isChecked ? 'solid' : 'outline'} w={'100%'} colorScheme={state.isChecked ? 'green' : 'red'}>
          <TagLabel {...getLabelProps()}>{children}</TagLabel>
        </Tag>
      </Box>
    </chakra.label>
  );
};
