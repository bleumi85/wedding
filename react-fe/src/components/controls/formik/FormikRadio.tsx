import { FormControl, FormLabel, Radio, RadioGroup, RadioProps, Stack } from '@chakra-ui/react';
import { Field, FieldProps } from 'formik';
import * as React from 'react';

interface IFormikRadioProps extends RadioProps {
  name: string;
  label?: string;
  options?: string[];
}

const FormikRadio: React.FunctionComponent<IFormikRadioProps> = (props) => {
  const { name, label, options = [], ...rest } = props;
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <FormControl id={name} isInvalid={!!meta.error && meta.touched}>
          {label && (
            <FormLabel htmlFor={name} mb={0} fontSize={{ base: 'var(--chakra-fontSizes-sm)', md: 'var(--chakra-fontSizes-md)' }}>
              {label}
            </FormLabel>
          )}
          <RadioGroup {...field}>
            <Stack spacing={{ base: 2, md: 4 }} direction={{ base: 'column', md: 'row' }} py={{ base: 0, md: 2 }}>
              {options.map((value, index) => (
                <Radio key={index} {...field} value={value} {...rest}>
                  {value}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>
      )}
    </Field>
  );
};

export default FormikRadio;
