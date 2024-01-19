import { Grid, GridItem, Stack, useBreakpointValue } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { CreateInvitationDto } from '../../../auth/authTypes';
import { InvitationErrorMessage } from '../InvitationsAddForm';
import { FormikInput, FormikSwitch } from '../../../../components/controls/formik';

export const StepAddressSchema = Yup.object({
  hasAddress: Yup.boolean(),
  address: Yup.object().when('hasAddress', {
    is: true,
    then: (schema) =>
      schema.shape({
        street: Yup.string().required('Bitte gib eine Straße an'),
        zipCode: Yup.string().required('Bitte gib eine Postleitzahl an'),
        city: Yup.string().required('Bitte gib einen Ort an'),
        country: Yup.string().required('Bitte gib ein Land an'),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const StepAddress: React.FunctionComponent = () => {
  const { errors, touched, values } = useFormikContext<CreateInvitationDto>();
  const labelSwitch = useBreakpointValue({ base: 'Adresse angeben?', md: 'Möchtest du eine Adresse angeben?' });

  return (
    <Stack spacing={4}>
      <Grid templateColumns="repeat(2, 1fr)" gap={[2, null, 4]}>
        <GridItem colSpan={2}>
          <FormikSwitch name="hasAddress" label={labelSwitch} size={{ base: 'sm', md: 'md' }} />
        </GridItem>
        {values.hasAddress && (
          <>
            <GridItem colSpan={{ base: 2, md: 1 }}>
              <FormikInput name="address.street" size={{ base: 'sm', md: 'md' }} label="Straße und Hausnummer" showMessage />
            </GridItem>
            <GridItem colSpan={{ base: 2, md: 1 }}>
              <FormikInput name="address.zipCode" size={{ base: 'sm', md: 'md' }} label="Postleitzahl" showMessage />
            </GridItem>
            <GridItem colSpan={{ base: 2, md: 1 }}>
              <FormikInput name="address.city" size={{ base: 'sm', md: 'md' }} label="Ort" showMessage />
            </GridItem>
            <GridItem colSpan={{ base: 2, md: 1 }}>
              <FormikInput name="address.country" size={{ base: 'sm', md: 'md' }} label="Land" showMessage />
            </GridItem>
          </>
        )}
      </Grid>
      {errors.address && touched.address && <InvitationErrorMessage message="Es wurden nicht alle Pflichtfelder ausgefüllt" />}
    </Stack>
  );
};

export default StepAddress;
