import { FormControl, FormLabel, Switch, SwitchProps } from '@chakra-ui/react';
import { Field, FieldProps } from 'formik';
import * as React from 'react';

interface IFormikSwitchProps extends SwitchProps {
  name: string;
  label?: string;
}

const FormikSwitch: React.FunctionComponent<IFormikSwitchProps> = (props) => {
  const { name, label, ...rest } = props;

  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        const value = field.value as boolean;
        return (
          <FormControl id={name} display={'flex'} alignItems={'center'}>
            {label && (
              <FormLabel htmlFor={name} mb={0} fontSize={{ base: 'var(--chakra-fontSizes-sm)', md: 'var(--chakra-fontSizes-md)' }}>
                {label}
              </FormLabel>
            )}
            <Switch
              isChecked={value}
              onChange={() => {
                void (async () => {
                  await form.setFieldValue(name, !value);
                })();
              }}
              {...rest}
            />
          </FormControl>
        );
      }}
    </Field>
  );
};

export default FormikSwitch;
