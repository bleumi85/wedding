import {
  Box,
  Button,
  CheckboxGroup,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  Text,
  UseCheckboxProps,
  chakra,
  useCheckbox,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { CreateGroupDto, CreateInvitationDto } from '../../../auth/authTypes';
import { useAppDispatch } from '../../../../app/hooks';
import { useAddGroupMutation, useGetGroupsQuery } from '../../../weddingApi';
import { alertActions } from '../../../alert/alertSlice';
import { FaPlus } from 'react-icons/fa6';
import { FormikInput } from '../../../../components/controls/formik';
import { InvitationErrorMessage } from '../InvitationsAddForm';

export const StepGuestGroupsSchema = Yup.object().shape({
  guests: Yup.array()
    .of(
      Yup.object().shape({
        groups: Yup.array().of(Yup.string().uuid()).min(1).required(),
      }),
    )
    .required('Keine Gruppe zugewiesen')
    .min(1),
});

const GuestGroups: React.FunctionComponent = () => {
  const { errors, touched, values, setFieldValue } = useFormikContext<CreateInvitationDto>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useAppDispatch();

  const { data: groups = [] } = useGetGroupsQuery();
  const [addGroup] = useAddGroupMutation();

  const bgError = useColorModeValue('red.100', 'rgba(254, 178, 178, 0.16)');
  const textError = useColorModeValue('red.500', 'red.200');

  const initialValuesGroupForm: CreateGroupDto = {
    groupName: '',
  };

  const validationSchemaGroupForm = Yup.object().shape({
    groupName: Yup.string().required('Gib einen Namen für die Gruppe an'),
  });

  const handleSubmitGroupForm = async (values: CreateGroupDto, helpers: FormikHelpers<CreateGroupDto>) => {
    try {
      await addGroup(values).unwrap();
      onClose();
    } catch (err) {
      console.error(err);
      dispatch(
        alertActions.error({
          title: 'Fehler',
          description: JSON.stringify(err, null, 2),
          type: 'json',
        }),
      );
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <>
      <Stack spacing={4}>
        <Stack spacing={4} textAlign={'left'}>
          <Box>
            <IconButton aria-label="Add Group" size={['sm', null, 'md']} isRound onClick={onOpen} icon={<FaPlus />} />
          </Box>
          {values.guests.map((guest, guestIdx) => {
            const hasError = !!(errors.guests && errors.guests.length > 0 && errors.guests[guestIdx]);
            return (
              <Stack p={[2, null, 4]} key={guestIdx} borderStyle={'solid'} borderWidth={1} borderRadius={'md'} bg={hasError ? bgError : 'inherit'}>
                <Text as="em" color={hasError ? textError : 'inherit'}>
                  {guest.firstName} {guest.lastName}
                </Text>
                <CheckboxGroup
                  colorScheme="green"
                  value={values.guests[guestIdx].groups}
                  onChange={(value) => {
                    void (async () => {
                      await setFieldValue(`guests.${guestIdx}.groups`, value);
                    })();
                  }}
                >
                  <SimpleGrid columns={[1, null, 5]} spacing={[2, null, 4]}>
                    {groups.map((group, groupIdx) => (
                      <CustomCheckbox
                        key={groupIdx}
                        value={group.id}
                        isChecked={values.guests[guestIdx].groups.includes(group.id)}
                        onChange={(e) => {
                          const { value, checked } = e.target;

                          let updatedGroups = [...values.guests[guestIdx].groups];

                          if (checked) {
                            updatedGroups = [...updatedGroups, value];
                          } else {
                            updatedGroups = updatedGroups.filter((groupId) => groupId !== value);
                          }
                          setFieldValue(`guests.${guestIdx}.groups`, updatedGroups).catch((err) => console.error(err));
                        }}
                      >
                        {group.groupName}
                      </CustomCheckbox>
                    ))}
                  </SimpleGrid>
                </CheckboxGroup>
              </Stack>
            );
          })}
        </Stack>
        {errors.guests && touched.guests && <InvitationErrorMessage message="Jedem Gast muss mindestens eine Gruppe zugewiesen werden" />}
      </Stack>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Neue Gruppe anlegen</ModalHeader>
          <ModalCloseButton />
          <Formik initialValues={initialValuesGroupForm} onSubmit={handleSubmitGroupForm} validationSchema={validationSchemaGroupForm}>
            {({ isSubmitting }) => (
              <Form>
                <ModalBody>
                  <FormikInput label="Name" name="groupName" showMessage />
                </ModalBody>
                <ModalFooter>
                  <Button mr={4} isLoading={isSubmitting} type="submit">
                    Speichern
                  </Button>
                  <Button colorScheme="gray" onClick={onClose} isDisabled={isSubmitting}>
                    Abbrechen
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

interface ICustomCheckboxProps extends UseCheckboxProps {
  children: string;
}

const CustomCheckbox: React.FunctionComponent<ICustomCheckboxProps> = (props) => {
  const { state, getCheckboxProps, getInputProps, getLabelProps } = useCheckbox(props);

  return (
    <chakra.label>
      <input {...getInputProps()} />
      <Box {...getCheckboxProps()}>
        <Tag variant={state.isChecked ? 'solid' : 'outline'} colorScheme={state.isChecked ? 'green' : 'red'} w={'100%'}>
          <TagLabel {...getLabelProps()}>{props.children}</TagLabel>
        </Tag>
      </Box>
    </chakra.label>
  );
};

export default GuestGroups;
