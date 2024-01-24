import { Button, Container, Progress, Stack, Text } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetInvitationQuery, useUpdateInvitationMutation } from '../../weddingApi';
import { ErrorBox } from '../../../components/controls';
import { UpdateInvitationTokenDto } from '../../auth/authTypes';
import * as Yup from 'yup';
import { FormikInput } from '../../../components/controls/formik';
import { useAppDispatch } from '../../../app/hooks';
import { alertActions } from '../../alert/alertSlice';

const InvitationsTokenForm: React.FunctionComponent = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: invitation, isLoading, error } = useGetInvitationQuery(id ?? '');
  const [updateInvitation] = useUpdateInvitationMutation();

  const initialValues: UpdateInvitationTokenDto = {
    id: invitation?.id,
    token: invitation?.token ?? '',
  };

  const validationSchema = Yup.object().shape({
    token: Yup.string()
      .matches(/^([a-z0-9]{12}|[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4})$/, { message: 'Token muss vom Typ "abcd-abcd-abcd" sein' })
      .required(),
  });

  const onSubmit = async (values: UpdateInvitationTokenDto, helpers: FormikHelpers<UpdateInvitationTokenDto>) => {
    try {
      await updateInvitation({ ...values, id }).unwrap();
      dispatch(
        alertActions.success({
          title: 'Einladung wurde aktualisiert',
        }),
      );
      navigate('/admin/invitations');
    } catch (err) {
      dispatch(
        alertActions.error({
          title: 'Einladung konnte nicht aktualisiert werden',
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

  if (invitation) {
    return (
      <Container maxW={'md'} variant={'wedding'} p={4}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }: FormikProps<UpdateInvitationTokenDto>) => (
            <Form>
              <Stack spacing={[2, null, 4]}>
                <Text fontSize={['lg', null, '2xl']}>Token bearbeiten</Text>
                <FormikInput name="token" size={['sm', null, 'md']} fontFamily={'Courier New, monospace'} showMessage />
                <Stack direction={'row'} justify={'flex-end'} spacing={[2, null, 4]}>
                  <Link to="..">
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

export default InvitationsTokenForm;
