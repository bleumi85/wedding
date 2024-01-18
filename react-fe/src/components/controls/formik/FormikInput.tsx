import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { Field, FieldProps } from 'formik';
import * as React from 'react';

interface IFormikInputProps extends InputProps {
  name: string;
  label?: string;
  showMessage?: boolean;
}

const FormikInput: React.FunctionComponent<IFormikInputProps> = (props) => {
  const { name, label, showMessage = false, ...rest } = props;
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <FormControl isInvalid={!!meta.error && meta.touched}>
          {label && (
            <FormLabel htmlFor={name} mb={0} fontSize={{ base: 'var(--chakra-fontSizes-sm)', md: 'var(--chakra-fontSizes-md)' }}>
              {label}
            </FormLabel>
          )}
          <Input {...field} {...rest} />
          {showMessage && <FormErrorMessage>{meta.error}</FormErrorMessage>}
        </FormControl>
      )}
    </Field>
  );
};

export default FormikInput;
