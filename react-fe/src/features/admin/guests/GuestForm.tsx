import { Button, Container, FormLabel, Grid, GridItem, Progress, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useGetGroupsQuery, useGetGuestQuery, useUpdateGuestAdminMutation } from '../../weddingApi';
import { useAppDispatch } from '../../../app/hooks';
import { ErrorBox } from '../../../components/controls';
import { UpdateGuestAdminDto } from '../../auth/authTypes';
import { MealRequest, ResponseStatus } from '../../../common/enums';
import { FormikInput, FormikLabelCheckbox, FormikSelect } from '../../../components/controls/formik';
import { alertActions } from '../../alert/alertSlice';

const GuestForm: React.FunctionComponent = () => {
  const { invitationId, guestId } = useParams();
  const isAddMode = !guestId || guestId === '1';

  const formErrorColor = useColorModeValue('red.500', 'red.300');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: guest, isLoading, error } = useGetGuestQuery(guestId ?? '', { skip: isAddMode });
  const { data: groups = [] } = useGetGroupsQuery();
  const [updateGuest] = useUpdateGuestAdminMutation();

  const initialValues: UpdateGuestAdminDto = {
    id: guest?.id,
    invitation: invitationId,
    firstName: guest?.firstName ?? '',
    lastName: guest?.lastName ?? '',
    displayName: guest?.displayName ?? '',
    responseStatus: guest?.responseStatus ?? ResponseStatus.OPEN,
    mealRequest: guest?.mealRequest ?? MealRequest.NONE,
    groups: guest?.groups?.map((g) => g.id) ?? [],
  };

  const validationSchema = Yup.object().shape({
    invitation: Yup.string().uuid().required(),
    firstName: Yup.string().required('Vorname ist Pflichtfeld'),
    lastName: Yup.string().required('Nachname ist Pflichtfeld'),
    displayName: Yup.string().required('Name auf Einladung ist Pflichtfeld'),
    groups: Yup.array().of(Yup.string().uuid()).min(1, 'Keine Gruppe zugewiesen').required(),
  });

  const onSubmit = async (values: UpdateGuestAdminDto, helpers: FormikHelpers<UpdateGuestAdminDto>) => {
    try {
      isAddMode ? console.log(values) : await updateGuest({ ...values, id: guestId }).unwrap();
      dispatch(
        alertActions.success({
          title: `Gast erfolgreich ${isAddMode ? 'zur Einladung hinzugefügt' : 'aktualisiert'}`,
        }),
      );
      navigate('/admin/guests');
    } catch (err) {
      dispatch(
        alertActions.error({
          title: `Gast konnte nicht ${isAddMode ? 'zur Einladung hingefügt' : 'aktualisiert'} werden`,
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

  if (guest || isAddMode) {
    return (
      <Container maxW={'container.md'} variant={'wedding'} p={4} bg="gray.500">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ errors, isSubmitting, setFieldValue, values }: FormikProps<UpdateGuestAdminDto>) => (
            <Form>
              <Stack spacing={[2, null, 4]}>
                <Text fontSize={['lg', null, '2xl']}>Gast {isAddMode ? 'anlegen' : 'bearbeiten'}</Text>
                <Grid templateColumns="repeat(6, 1fr)" gap={[2, null, 4]} mb={2}>
                  <GridItem colSpan={[6, null, 2]}>
                    <FormikInput name="firstName" label="Vorname" showMessage />
                  </GridItem>
                  <GridItem colSpan={[6, null, 2]}>
                    <FormikInput name="lastName" label="Nachname" showMessage />
                  </GridItem>
                  <GridItem colSpan={[6, null, 2]}>
                    <FormikInput name="displayName" label="Name auf Einladung" showMessage />
                  </GridItem>
                  <GridItem colSpan={[6, null, 3]}>
                    <FormikSelect name="responseStatus" label="Rückmeldung" options={Object.values(ResponseStatus)} />
                  </GridItem>
                  <GridItem colSpan={[6, null, 3]}>
                    <FormikSelect name="mealRequest" label="Essenswunsch" options={Object.values(MealRequest)} />
                  </GridItem>
                  <GridItem colSpan={6}>
                    <FormLabel>Gruppe(n)</FormLabel>
                    <SimpleGrid columns={[2, null, 4]} gap={2}>
                      {groups.map((group, groupIdx) => (
                        <FormikLabelCheckbox
                          key={groupIdx}
                          value={group.id}
                          isChecked={values.groups.includes(group.id)}
                          onChange={(e) => {
                            const { value, checked } = e.target;

                            let updatedGroups = [...values.groups];

                            if (checked) {
                              updatedGroups = [...updatedGroups, value];
                            } else {
                              updatedGroups = updatedGroups.filter((groupId) => groupId !== value);
                            }
                            setFieldValue('groups', updatedGroups).catch((err) => console.error(err));
                          }}
                        >
                          {group.groupName}
                        </FormikLabelCheckbox>
                      ))}
                    </SimpleGrid>
                    {!!errors.groups && (
                      <Text mt={2} fontSize={'sm'} color={formErrorColor}>
                        {errors.groups}
                      </Text>
                    )}
                  </GridItem>
                </Grid>
                <Stack direction={'row'} justify={'flex-end'} spacing={[2, null, 4]}>
                  <Link to="/admin/guests">
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

  return <div>Guest Form</div>;
};

export default GuestForm;
