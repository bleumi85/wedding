import { Button, ButtonGroup, Card, CardBody, CardHeader, Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { MealRequest, ResponseStatus } from '../common/enums';
import { FaFaceFlushed, FaFaceSadCry, FaFaceSmile, FaFloppyDisk } from 'react-icons/fa6';
import { useUpdateGuestsMutation } from '../features/weddingApi';
import { alertActions } from '../features/alert/alertSlice';
import { authActions } from '../features/auth/authSlice';
import { arraysAreEqual } from '../functions/helpers';
import { mealRequestArray } from './arrays';
import { CancelConfirmationModal } from '../components/controls';

export type ValueType = {
  id: string;
  firstName: string;
  lastName: string;
  responseStatus: ResponseStatus;
  mealRequest: MealRequest;
};

const Home: React.FunctionComponent = () => {
  const invitation = useAppSelector((state) => state.auth.invitation);

  const dispatch = useAppDispatch();
  const [updateGuests] = useUpdateGuestsMutation();

  const [id, setId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [guestStatesCurrent, setGuestStatesCurrent] = React.useState<ValueType[]>([]);
  const [guestStates, setGuestStates] = React.useState<ValueType[]>([]);
  const [valuesAreEqual, setValuesAreEqual] = React.useState(true);
  const [displayCancelModal, setDisplayCancelModal] = React.useState(false);
  const [cancelMessage, setCancelMessage] = React.useState('');

  React.useEffect(() => {
    if (invitation) {
      const values: ValueType[] = invitation.guests.map((guest) => {
        const { id, firstName, lastName, responseStatus, mealRequest } = guest;
        return { id, firstName, lastName, responseStatus, mealRequest };
      });
      setGuestStates(values);
      if (guestStatesCurrent.length === 0) {
        setGuestStatesCurrent(values);
      }
    }
  }, [invitation, guestStatesCurrent.length]);

  if (!invitation) return null;

  const { guests } = invitation;

  const nGuests = guests.length;
  const isOne = nGuests === 1;
  const names = isOne
    ? guests[0].displayName
    : guests
        .slice(0, nGuests - 1)
        .map((guest) => guest.displayName)
        .join(', ') +
      ' und ' +
      guests[nGuests - 1].displayName;

  const everyIsOpen = guests.every((guest) => guest.responseStatus === ResponseStatus.OPEN);
  const someIsOpen = guests.some((guest) => guest.responseStatus === ResponseStatus.OPEN);
  const everyHasAccepted = guests.every((guest) => guest.responseStatus === ResponseStatus.CONFIRMED);
  const everyHasCanceled = guests.every((guest) => guest.responseStatus === ResponseStatus.CANCELED);
  const someHasCanceled = guests.some((guest) => guest.responseStatus === ResponseStatus.CANCELED);

  const canceledGuests = guests.filter((guest) => guest.responseStatus === ResponseStatus.CANCELED);
  const nCanceledGuests = canceledGuests.length;
  const isOneCanceled = nCanceledGuests === 1;
  const namesCanceled =
    nCanceledGuests === 0
      ? ''
      : isOneCanceled
        ? canceledGuests[0].displayName
        : canceledGuests
            .slice(0, nCanceledGuests - 1)
            .map((guest) => guest.displayName)
            .join(', ') +
          ' und ' +
          canceledGuests[nCanceledGuests - 1].displayName;

  const onStatusChange = (id: string, status: ResponseStatus | MealRequest) => {
    const updatedGuests = guestStates.map((gs) => {
      if (gs.id === id) {
        if (status === ResponseStatus.CANCELED || status === ResponseStatus.CONFIRMED || status === ResponseStatus.OPEN) {
          return { ...gs, responseStatus: status };
        } else {
          return { ...gs, mealRequest: status };
        }
      } else {
        return gs;
      }
    });
    setGuestStates([...updatedGuests]);
    const arraysEqual = arraysAreEqual(guestStatesCurrent, [...updatedGuests]);
    setValuesAreEqual(arraysEqual);
  };

  const showCancelModal = (id: string, message: string) => {
    setId(id);
    setCancelMessage(message);
    setDisplayCancelModal(true);
  };

  const hideCancelModal = () => {
    setDisplayCancelModal(false);
  };

  const submitCancel = (id: string) => {
    onStatusChange(id, ResponseStatus.CANCELED);
    hideCancelModal();
  };

  const onSubmit = () => {
    setIsLoading(true);
    updateGuests(guestStates)
      .unwrap()
      .then(() => {
        dispatch(authActions.updateInvitation(guestStates));
        dispatch(
          alertActions.success({
            title: `Vielen Dank ${names}`,
          }),
        );
        setGuestStatesCurrent(guestStates);
        setValuesAreEqual(true);
      })
      .catch((error) => {
        dispatch(
          alertActions.error({
            title: 'Irgendwas ist bei der Rückmeldung schiefgelaufen',
            description: JSON.stringify(error, null, 2),
            type: 'json',
          }),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Stack fontFamily={'Dancing Script, cursive'} fontSize={['lg', null, '3xl']}>
        <Text fontSize={{ base: '3xl', md: '6xl' }}>Hallo {names},</Text>
        {everyIsOpen && (
          <Text>
            wir freuen uns sehr, dass {isOne ? 'Du' : 'Ihr'} den Weg auf unsere kleinen Homepage gefunden {isOne ? 'hast' : 'habt'}.
          </Text>
        )}
        {!everyIsOpen && (
          <Text>
            schön, dass {isOne ? 'Du' : 'Ihr'} wieder auf unserer kleinen Homepage {isOne ? 'vorbeischaust' : 'vorbeischaut'}.
          </Text>
        )}
        {someIsOpen && (
          <Text>
            {isOne ? 'Sag' : 'Sagt'} uns gerne, ob {isOne ? 'Du' : 'Ihr'} diesen besonderen Tag mit uns verbringen {isOne ? 'kannst' : 'könnt'} und ob es
            Essenswünsche gibt die wir berücksichtigen können.
          </Text>
        )}
        {everyHasAccepted && (
          <Text>
            Bisher {isOne ? 'hast Du' : 'habt Ihr'} zugesagt. Das {isOne ? 'willst Du' : 'wollt Ihr'} doch wohl nicht noch einmal ändern?!
          </Text>
        )}
        {someHasCanceled && (
          <Text>
            {isOne ? 'Willst Du' : everyHasCanceled ? 'Wollt Ihr' : isOneCanceled ? `Will ${namesCanceled}` : `Wollen ${names}`} doch nicht absagen? Das würde
            uns sehr freuen.
          </Text>
        )}
        <Flex w={'100%'} justify={'right'} fontFamily="var(--chakra-fonts-body)" pb={[2, null, 4]}>
          <Button size={['xs', null, 'md']} leftIcon={<FaFloppyDisk />} isDisabled={valuesAreEqual} isLoading={isLoading} onClick={onSubmit}>
            Speichern
          </Button>
        </Flex>
        <SimpleGrid columns={[1, null, 2]} gap={4}>
          {guestStates.map((gs, gsIdx) => {
            const { responseStatus: rs, mealRequest: mr } = guestStates[gsIdx];
            const message = `Du hast dir das gut überlegt und willst wirklich absagen ${gs.firstName}?`;
            return (
              <Card key={gs.id}>
                <CardHeader pt={4} pb={2}>
                  <Text fontSize={{ base: '2xl', md: '4xl' }} flexGrow={1}>
                    {gs.firstName} {gs.lastName}
                  </Text>
                </CardHeader>
                <CardBody pt={0} pb={4}>
                  <Text fontSize={'xl'}>Bist du am Start?</Text>
                  <ButtonGroup
                    size={['xs', null, 'md']}
                    isAttached
                    fontFamily="var(--chakra-fonts-body)"
                    mb={4}
                    w={'100%'}
                    colorScheme={gs.responseStatus === ResponseStatus.CONFIRMED ? 'green' : gs.responseStatus === ResponseStatus.OPEN ? 'yellow' : 'red'}
                  >
                    <Button
                      w={'33%'}
                      leftIcon={<FaFaceSmile />}
                      variant={rs === ResponseStatus.CONFIRMED ? 'solid' : 'outline'}
                      onClick={() => onStatusChange(gs.id, ResponseStatus.CONFIRMED)}
                    >
                      Ja klar!
                    </Button>
                    <Button
                      w={'33%'}
                      leftIcon={<FaFaceFlushed />}
                      variant={rs === ResponseStatus.OPEN ? 'solid' : 'outline'}
                      onClick={() => onStatusChange(gs.id, ResponseStatus.OPEN)}
                    >
                      Hm?!
                    </Button>
                    <Button
                      w={'33%'}
                      leftIcon={<FaFaceSadCry />}
                      variant={rs === ResponseStatus.CANCELED ? 'solid' : 'outline'}
                      onClick={() => showCancelModal(gs.id, message)}
                    >
                      Nein
                    </Button>
                  </ButtonGroup>
                  <Text fontSize={'xl'}>Hast du Essenswünsche?</Text>
                  <ButtonGroup
                    size={['xs', null, 'md']}
                    isAttached
                    fontFamily="var(--chakra-fonts-body)"
                    w={'100%'}
                    isDisabled={rs !== ResponseStatus.CONFIRMED}
                  >
                    {mealRequestArray.map((value, idx) => (
                      <Button
                        key={idx}
                        w={`${100 / mealRequestArray.length}%`}
                        leftIcon={value.icon}
                        variant={mr === value.mealRequest ? 'solid' : 'outline'}
                        onClick={() => onStatusChange(gs.id, value.mealRequest)}
                      >
                        {value.text}
                      </Button>
                    ))}
                  </ButtonGroup>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      </Stack>

      <CancelConfirmationModal id={id} showModal={displayCancelModal} confirmModal={submitCancel} hideModal={hideCancelModal} message={cancelMessage} />
    </>
  );
};

export default Home;
