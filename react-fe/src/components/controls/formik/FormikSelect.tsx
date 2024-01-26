import { FormControl, FormErrorMessage, FormLabel, Select, SelectProps, chakra, useToken } from '@chakra-ui/react';
import { Field, FieldProps } from 'formik';
import * as React from 'react';

interface IFormikSelectProps extends SelectProps {
  name: string;
  options: string[];
  label?: string;
  showMessage?: boolean;
}

const FormikSelect: React.FunctionComponent<IFormikSelectProps> = (props) => {
  const { name, options, label, showMessage = false, ...rest } = props;
  const [fontSm, fontMd] = useToken('fontSize', ['sm', 'md']);

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <FormControl isInvalid={!!meta.error && meta.touched}>
          {label && (
            <FormLabel htmlFor={name} mb={0} fontSize={[fontSm, null, fontMd]}>
              {label}
            </FormLabel>
          )}
          <Select {...field} {...rest}>
            {options.map((option, index) => (
              <chakra.option key={index} value={option}>
                {option}
              </chakra.option>
            ))}
          </Select>
          {showMessage && <FormErrorMessage>{meta.error}</FormErrorMessage>}
        </FormControl>
      )}
    </Field>
  );
};

export default FormikSelect;
