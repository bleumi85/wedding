import { Button, Container, Progress, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useAppDispatch } from '../../../app/hooks';
import { useAddAddressMutation, useGetAddressQuery, useUpdateAddressMutation } from '../../weddingApi';
import { Address } from '../../auth/authTypes';
import { FormikInput } from '../../../components/controls/formik';
import { ErrorBox } from '../../../components/controls';
import { alertActions } from '../../alert/alertSlice';

const InvitationsAddressForm: React.FunctionComponent = () => {
  const { invitationId, addressId } = useParams();
  const isAddMode = !addressId || addressId === '1';

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: address, isLoading, error } = useGetAddressQuery(addressId ?? '', { skip: isAddMode });
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const initialValues: Address = {
    id: address?.id,
    street: address?.street ?? '',
    zipCode: address?.zipCode ?? '',
    city: address?.city ?? '',
    country: address?.country ?? '',
    invitation: invitationId,
  };

  const validationSchema = Yup.object().shape({
    street: Yup.string().required('Straße ist Pflichtfeld'),
    zipCode: Yup.string().required('PLZ ist Pflichtfeld'),
    city: Yup.string().required('Ort ist Pflichtfeld'),
    country: Yup.string().required('Land ist Pflichtfeld'),
    invitation: Yup.string().uuid().required(),
  });

  const onSubmit = async (values: Address, helpers: FormikHelpers<Address>) => {
    try {
      isAddMode ? await addAddress(values).unwrap() : await updateAddress({ ...values, id: addressId }).unwrap();
      dispatch(
        alertActions.success({
          title: `Adresse erfolgreich ${isAddMode ? 'zur Einladung hinzugefügt' : 'aktualisiert'}`,
        }),
      );
      navigate('/admin/invitations');
    } catch (err) {
      dispatch(
        alertActions.error({
          title: `Adresse konnte nicht ${isAddMode ? 'zur Einladung hingefügt' : 'aktualisiert'} werden`,
          description: JSON.stringify(err, null, 2),
          type: 'json',
        }),
      );
      console.error(err);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  if (error) return <ErrorBox error={error} />;

  if (isLoading) return <Progress isIndeterminate />;

  if (address || isAddMode) {
    return (
      <Container maxW={'container.md'} variant={'wedding'} p={4}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }: FormikProps<Address>) => (
            <Form>
              <Stack spacing={[2, null, 4]}>
                <Text fontSize={['lg', null, '2xl']}>Adresse {isAddMode ? 'anlegen' : 'bearbeiten'}</Text>
                <SimpleGrid columns={[1, null, 2]} spacing={[2, null, 4]} mb={[2, null, 4]}>
                  <FormikInput name="street" label="Straße" showMessage />
                  <FormikInput name="zipCode" label="PLZ" showMessage />
                  <FormikInput name="city" label="Ort" showMessage />
                  <FormikInput name="country" label="Land" showMessage />
                </SimpleGrid>
                <Stack direction={'row'} justify={'flex-end'} spacing={[2, null, 4]}>
                  <Link to="/admin/invitations">
                    <Button colorScheme="danger" variant={'outline'} size={'sm'}>
                      Abbrechen
                    </Button>
                  </Link>
                  <Button type="submit" isDisabled={isSubmitting} size={'sm'}>
                    OK
                  </Button>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </Container>
    );
  }

  return <ErrorBox error="Unbekannter Fehler" />;
};

export default InvitationsAddressForm;
