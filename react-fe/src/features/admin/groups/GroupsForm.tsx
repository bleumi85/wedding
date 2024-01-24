import { Button, Container, Flex, Progress, SimpleGrid, Stack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorBox } from '../../../components/controls';
import { useAppDispatch } from '../../../app/hooks';
import { CreateGroupDto } from '../../auth/authTypes';
import { useAddGroupMutation, useUpdateGroupMutation, useGetGroupQuery } from '../../weddingApi';
import { alertActions } from '../../alert/alertSlice';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { FormikInput } from '../../../components/controls/formik';
import { FaCheck } from 'react-icons/fa6';

const COLORS = [
  { light: '#718096', dark: '#e2e8f0' },
  { light: '#e53e3e', dark: '#feb2b2' },
  { light: '#dd6b20', dark: '#fbd38d' },
  { light: '#d69e2e', dark: '#faf089' },
  { light: '#38a169', dark: '#9ae6b4' },
  { light: '#319795', dark: '#81e6d9' },
  { light: '#3182ce', dark: '#90cdf4' },
  { light: '#00b5d8', dark: '#9decf9' },
  { light: '#805ad5', dark: '#d6bcfa' },
  { light: '#d53f8c', dark: '#fbb6ce' },
];

const GroupsForm: React.FunctionComponent = () => {
  const { id } = useParams();
  const isAddMode = !id;

  const { colorMode } = useColorMode();
  const checkColor = useColorModeValue('white', 'gray.700');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: group, isLoading: isLoadingGroup, error: errorGroup } = useGetGroupQuery(id ?? '', { skip: isAddMode });
  const [addGroup] = useAddGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();

  const initialValues: CreateGroupDto = {
    id: group?.id,
    groupName: group?.groupName ?? '',
    colorLight: group?.colorLight ?? '#718096',
    colorDark: group?.colorDark ?? '#e2e8f0',
  };

  const validationSchema = Yup.object().shape({
    groupName: Yup.string().required('Gruppenname muss angegeben werden'),
  });

  const onSubmit = async (values: CreateGroupDto, helpers: FormikHelpers<CreateGroupDto>) => {
    try {
      const data = isAddMode ? await addGroup(values).unwrap() : await updateGroup({ ...values, id }).unwrap();
      dispatch(alertActions.success({ title: `${data.groupName} konnte erfolgreich ${isAddMode ? 'angelegt' : 'aktualisiert'} werden` }));
      navigate('/admin/groups');
    } catch (err) {
      dispatch(
        alertActions.error({
          title: `Gruppe konnte nicht ${isAddMode ? 'angelegt' : 'aktualisiert'} werden`,
          description: JSON.stringify(err, null, 2),
          type: 'json',
        }),
      );
      console.error(err);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  if (errorGroup) return <ErrorBox error={errorGroup} />;

  if (isLoadingGroup) return <Progress isIndeterminate />;

  if (group || isAddMode) {
    return (
      <Container maxW={'md'} variant={'wedding'} p={4}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, setFieldValue, values }: FormikProps<CreateGroupDto>) => (
            <Form>
              <Stack spacing={[2, null, 4]}>
                <Text fontSize={['lg', null, '2xl']}>Gruppe {isAddMode ? 'anlegen' : 'bearbeiten'}</Text>
                <FormikInput name="groupName" size={['sm', null, 'md']} showMessage />
                <SimpleGrid spacing={2} minChildWidth={[6, null, 8]} mb={[2, null, 4]}>
                  {COLORS.map((color, index) => {
                    const isSelected = values.colorLight === color.light;
                    return (
                      <Flex
                        key={index}
                        w={{ base: 6, md: 8 }}
                        h={{ base: 6, md: 8 }}
                        borderRadius={'md'}
                        bg={colorMode === 'light' ? color.light : color.dark}
                        cursor={'pointer'}
                        justify={'center'}
                        alignItems={'center'}
                        onClick={() => {
                          setFieldValue('colorLight', color.light).catch((err) => console.error(err));
                          setFieldValue('colorDark', color.dark).catch((err) => console.error(err));
                        }}
                      >
                        {isSelected ? <FaCheck color={checkColor} /> : null}
                      </Flex>
                    );
                  })}
                </SimpleGrid>
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

export default GroupsForm;
