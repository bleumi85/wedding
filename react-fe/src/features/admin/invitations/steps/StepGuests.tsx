import { Box, Grid, GridItem, IconButton, SimpleGrid, Stack, useColorModeValue } from '@chakra-ui/react';
import { FieldArray, useFormikContext } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { AgeType, Gender, ResponseStatus, Role } from '../../../../common/enums';
import { CreateInvitationDto } from '../../../auth/authTypes';
import { FormikInput, FormikRadio } from '../../../../components/controls/formik';
import { InvitationErrorMessage } from '../InvitationsAddForm';

export const StepGuestsSchema = Yup.object().shape({
  guests: Yup.array()
    .of(
      Yup.object().shape({
        firstName: Yup.string().required('Vorname ist Pflichtfeld'),
        lastName: Yup.string().required('Nachname ist Pflichtfeld'),
        displayName: Yup.string().required('Name auf Einladung ist Pflichtfeld'),
      }),
    )
    .required('Kein Gast angelegt')
    .min(1),
});

const StepGuests: React.FunctionComponent = () => {
  const { errors, touched, values } = useFormikContext<CreateInvitationDto>();
  const mobileBorder = useColorModeValue('gray.200', 'gray.700');

  return (
    <Stack spacing={4}>
      <FieldArray name="guests">
        {({ pop, push }) => (
          <Stack direction={['column', null, 'row']} spacing={4}>
            <Stack direction={['row', null, 'column']}>
              <IconButton
                aria-label="Add Guest"
                size={['sm', null, 'md']}
                isRound
                onClick={() =>
                  push({
                    firstName: '',
                    lastName: '',
                    displayName: '',
                    gender: Gender.MALE,
                    ageType: AgeType.ADULT,
                    role: Role.GUEST,
                    responseStatus: ResponseStatus.OPEN,
                    groups: [],
                  })
                }
                icon={<FaPlus />}
              />
              <IconButton
                aria-label="Delete Guest"
                colorScheme="red"
                size={['sm', null, 'md']}
                isRound
                isDisabled={values.guests.length <= 1}
                onClick={pop}
                icon={<FaMinus />}
              />
            </Stack>
            <SimpleGrid display={['none', null, 'grid']} columns={5} w={'100%'} spacing={4}>
              {values.guests.length > 0 &&
                values.guests.map((_, index) => (
                  <React.Fragment key={index}>
                    <FormikInput name={`guests.${index}.firstName`} label={index === 0 ? 'Vorname' : undefined} />
                    <FormikInput name={`guests.${index}.lastName`} label={index === 0 ? 'Nachname' : undefined} />
                    <FormikInput name={`guests.${index}.displayName`} label={index === 0 ? 'Name auf Einladung' : undefined} />
                    <FormikRadio name={`guests.${index}.gender`} label={index === 0 ? 'Geschlecht' : undefined} options={Object.values(Gender)} />
                    <FormikRadio name={`guests.${index}.ageType`} label={index === 0 ? 'Alter' : undefined} options={Object.values(AgeType)} />
                  </React.Fragment>
                ))}
            </SimpleGrid>
            {values.guests.map((_, index) => (
              <Box key={index} display={{ base: 'block', md: 'none' }} p={2} border="1px solid" borderRadius={'md'} borderColor={mobileBorder}>
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  <GridItem colSpan={2}>
                    <FormikInput name={`guests.${index}.firstName`} size={'sm'} placeholder="Vorname" />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormikInput name={`guests.${index}.lastName`} size={'sm'} placeholder="Nachname" />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormikInput name={`guests.${index}.displayName`} size={'sm'} placeholder="Name auf Einladung" />
                  </GridItem>
                  <GridItem>
                    <FormikRadio name={`guests.${index}.gender`} size={'sm'} options={Object.values(Gender)} />
                  </GridItem>
                  <GridItem>
                    <FormikRadio name={`guests.${index}.ageType`} size={'sm'} options={Object.values(AgeType)} />
                  </GridItem>
                </Grid>
              </Box>
            ))}
          </Stack>
        )}
      </FieldArray>
      {errors.guests && touched.guests && <InvitationErrorMessage message="Es wurden nicht alle Pflichtfelder ausgefüllt" />}
    </Stack>
  );
};

export default StepGuests;
