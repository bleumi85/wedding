import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useSteps,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as React from 'react';
import { CreateInvitationDto } from '../../auth/authTypes';
import { AgeType, Gender, ResponseStatus, Role } from '../../../common/enums';
import { StepAddress, StepAddressSchema, StepGuestGroups, StepGuestGroupsSchema, StepGuests, StepGuestsSchema, StepSummary } from './steps';
import { useAppDispatch } from '../../../app/hooks';
import { alertActions } from '../../alert/alertSlice';
import { useAddInvitationMutation } from '../../weddingApi';

type Orientation = 'horizontal' | 'vertical';

type StepType = {
  label: string;
  description?: string;
  content?: React.ReactElement;
};

const steps: StepType[] = [
  { label: 'Adresse', description: 'Neue Adresse anlegen', content: <StepAddress /> },
  { label: 'Gäste', content: <StepGuests /> },
  { label: 'Gruppe(n)', content: <StepGuestGroups /> },
  { label: 'Einladung', description: 'Zusammenfassung', content: <StepSummary /> },
];

const SCHEMA_ARR = [StepAddressSchema, StepGuestsSchema, StepGuestGroupsSchema, null];

const INITIAL_VALUES: CreateInvitationDto = {
  hasAddress: true,
  address: {
    street: 'Roggenkamp 13',
    zipCode: '49846',
    city: 'Hoogstede',
    country: 'Deutschland',
  },
  guests: [
    {
      firstName: 'Heinrich',
      lastName: 'Bleumer',
      displayName: 'Papa',
      gender: Gender.MALE,
      ageType: AgeType.ADULT,
      role: Role.GUEST,
      responseStatus: ResponseStatus.OPEN,
      groups: ['2cb7ece4-0d4c-4821-964f-ff0d9bab48b8'],
    },
    {
      firstName: 'Anita',
      lastName: 'Bleumer',
      displayName: 'Mama',
      gender: Gender.FEMALE,
      ageType: AgeType.ADULT,
      role: Role.GUEST,
      responseStatus: ResponseStatus.OPEN,
      groups: ['2cb7ece4-0d4c-4821-964f-ff0d9bab48b8'],
    },
  ],
};

const InvitationsAddForm: React.FunctionComponent = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const dispatch = useAppDispatch();
  const [addInvitation] = useAddInvitationMutation();

  const isMobile = useBreakpointValue({ base: true, md: false })!;
  const orientation = useBreakpointValue({ base: 'vertical', md: 'horizontal' }) as Orientation;
  const bg = useColorModeValue('white', 'gray.700');

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  const hasCompletedAllSteps = activeStep === steps.length;

  const handleSubmit = async (createInvitationDto: CreateInvitationDto, helpers: FormikHelpers<CreateInvitationDto>) => {
    goToNext();
    if (isLastStep) {
      try {
        const values = createInvitationDto;
        if (!createInvitationDto.hasAddress) {
          values.address = null;
        }
        const data = await addInvitation(values).unwrap();
        dispatch(alertActions.success({ title: 'Einladung wurde angelegt', description: JSON.stringify(data, null, 2), type: 'json', duration: 4000 }));
      } catch (err) {
        dispatch(
          alertActions.error({
            title: 'Einladung konnte nicht angelegt werden',
            description: JSON.stringify(err, null, 2),
            type: 'json',
            duration: 2000,
          }),
        );
        console.error(err);
      } finally {
        helpers.setSubmitting(false);
      }
    }
  };

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={SCHEMA_ARR[activeStep]}>
      {({ handleSubmit, resetForm }: FormikProps<CreateInvitationDto>) => (
        <Stack spacing={4}>
          <Form>
            <Stepper index={activeStep} mb={4} size={['sm', null, 'md']} orientation={orientation}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                  </StepIndicator>

                  <Box flexShrink={0}>
                    <StepTitle>{step.label}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>

                  {!isMobile && <StepSeparator />}
                </Step>
              ))}
            </Stepper>
            {!hasCompletedAllSteps && (
              <Stack p={4} bg={bg} spacing={4} boxShadow={'md'}>
                {isMobile ? steps[activeStep].content : null}
                <Stack direction={'row'} spacing={4} justify={['right', null, 'left']}>
                  <Button onClick={goToPrevious} isDisabled={isFirstStep} size={['sm', null, 'md']} colorScheme="red">
                    Zurück
                  </Button>
                  <Button onClick={() => handleSubmit()} size={['sm', null, 'md']}>
                    {isLastStep ? 'Erstellen' : 'Weiter'}
                  </Button>
                </Stack>
                {!isMobile ? steps[activeStep].content : null}
              </Stack>
            )}
          </Form>
          {hasCompletedAllSteps && (
            <Stack p={4} bg={bg} spacing={4} boxShadow={'md'}>
              <Text>Hier steht am Ende eine Zusammenfassung</Text>
              <Stack direction={'row'}>
                <Button
                  onClick={() => {
                    resetForm();
                    setActiveStep(0);
                  }}
                  size={{ base: 'xs', md: 'sm' }}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </Formik>
  );
};

export const InvitationErrorMessage: React.FunctionComponent<{ message: string }> = ({ message }) => (
  <Alert status="error">
    <AlertIcon />
    <Text fontSize={{ base: 'sm', md: 'md' }}>{message}</Text>
  </Alert>
);

export default InvitationsAddForm;
