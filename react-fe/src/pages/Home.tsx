import { Button, ButtonGroup, Card, CardBody, CardHeader, Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { MealRequest, ResponseStatus } from '../common/enums';
import { FaFaceSmile, FaFaceFlushed, FaFaceSadCry, FaFishFins, FaCarrot, FaFloppyDisk } from 'react-icons/fa6';
import { TbMeat } from 'react-icons/tb';
import { LuVegan } from 'react-icons/lu';
import { useUpdateGuestsMutation } from '../features/weddingApi';
import { alertActions } from '../features/alert/alertSlice';

type ValueType = {
  id: string;
  name: string;
  responseStatus: ResponseStatus;
  mealRequest: MealRequest;
};

function arraysAreEqual<T extends ValueType>(valueTypes1: T[], valueTypes2: T[]): boolean {
  // check array length
  if (valueTypes1.length !== valueTypes2.length) {
    return false;
  }

  // compare objects in the arrays
  for (let i = 0; i < valueTypes1.length; i++) {
    const valueType1 = valueTypes1[i];
    const valueType2 = valueTypes2[i];

    // compare every key-value-pair in the objects
    for (const key in valueType1) {
      if (Object.prototype.hasOwnProperty.call(valueType1, key) && Object.prototype.hasOwnProperty.call(valueType2, key)) {
        if (valueType1[key] !== valueType2[key]) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  // all checks successful
  return true;
}

const Home: React.FunctionComponent = () => {
  const invitation = useAppSelector((state) => state.auth.invitation);

  const dispatch = useAppDispatch();
  const [updateGuests] = useUpdateGuestsMutation();

  const [isLoading, setIsLoading] = React.useState(false);
  const [guestStates, setGuestStates] = React.useState<ValueType[]>([]);
  const [valuesAreEqual, setValuesAreEqual] = React.useState(true);

  React.useEffect(() => {
    if (invitation) {
      const values: ValueType[] = invitation.guests.map((guest) => {
        const { id, firstName, lastName, responseStatus, mealRequest } = guest;
        return { id, name: `${firstName} ${lastName}`, responseStatus, mealRequest };
      });
      setGuestStates(values);
    }
  }, [invitation]);

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

  const everyNotOpen = guests.every((guest) => guest.responseStatus !== ResponseStatus.OPEN);
  const everyHasAccepted = guests.every((guest) => guest.responseStatus === ResponseStatus.CONFIRMED);
  const someHasCanceled = guests.some((guest) => guest.responseStatus === ResponseStatus.CANCELED);

  const values: ValueType[] = guests.map((guest) => {
    const { id, firstName, lastName, responseStatus, mealRequest } = guest;
    return { id, name: `${firstName} ${lastName}`, responseStatus, mealRequest };
  });

  const onStatusChange = (id: string, status: ResponseStatus | MealRequest) => {
    console.log();
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
    const arraysEqual = arraysAreEqual(values, [...updatedGuests]);
    setValuesAreEqual(arraysEqual);
  };

  const onSubmit = () => {
    setIsLoading(true);
    updateGuests(guestStates)
      .unwrap()
      .then(() => {
        dispatch(
          alertActions.success({
            title: `Vielen Dank ${names}`,
          }),
        );
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
    <Stack fontFamily={'Dancing Script, cursive'}>
      <Text fontSize={{ base: '3xl', md: '6xl' }} flexGrow={1}>
        Hallo {names},
      </Text>
      <Text fontSize={['lg', null, '3xl']} flexGrow={1}>
        wir freuen uns sehr, dass {isOne ? 'Du Dich' : 'Ihr Euch'} auf unserer kleinen Homepage {isOne ? 'zurückmeldest' : 'zurückmeldet'}.
      </Text>
      {everyNotOpen && <Text>Kein Status mehr: Offen</Text>}
      {everyHasAccepted && <Text>Alle zugesagt</Text>}
      {someHasCanceled && <Text>Jemand abgesagt</Text>}
      <Flex w={'100%'} justify={'right'} fontFamily="var(--chakra-fonts-body)" pb={4}>
        <Button leftIcon={<FaFloppyDisk />} isDisabled={valuesAreEqual} isLoading={isLoading} onClick={onSubmit}>
          Speichern
        </Button>
      </Flex>
      <SimpleGrid columns={[1, null, 2]} gap={4}>
        {guestStates.map((gs, gsIdx) => {
          const { responseStatus: rs, mealRequest: mr } = guestStates[gsIdx];
          return (
            <Card key={gs.id}>
              <CardHeader pt={4} pb={2}>
                <Text fontSize={{ base: '2xl', md: '4xl' }} flexGrow={1}>
                  {gs.name}
                </Text>
              </CardHeader>
              <CardBody pt={2} pb={4}>
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
                    w={'34%'}
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
                    onClick={() => onStatusChange(gs.id, ResponseStatus.CANCELED)}
                  >
                    Nein
                  </Button>
                </ButtonGroup>
                <Text fontSize={'xl'}>Hast du Essenswünsche?</Text>
                <ButtonGroup size={['xs', null, 'md']} isAttached fontFamily="var(--chakra-fonts-body)" w={'100%'} isDisabled={rs !== ResponseStatus.CONFIRMED}>
                  <Button
                    w={'25%'}
                    leftIcon={<TbMeat />}
                    variant={mr === MealRequest.NONE ? 'solid' : 'outline'}
                    onClick={() => onStatusChange(gs.id, MealRequest.NONE)}
                  >
                    Egal
                  </Button>
                  <Button
                    w={'25%'}
                    leftIcon={<FaFishFins />}
                    variant={mr === MealRequest.PESCETARIAN ? 'solid' : 'outline'}
                    onClick={() => onStatusChange(gs.id, MealRequest.PESCETARIAN)}
                  >
                    Fisch
                  </Button>
                  <Button
                    w={'25%'}
                    leftIcon={<FaCarrot />}
                    variant={mr === MealRequest.VEGETARIAN ? 'solid' : 'outline'}
                    onClick={() => onStatusChange(gs.id, MealRequest.VEGETARIAN)}
                  >
                    Veggie
                  </Button>
                  <Button
                    w={'25%'}
                    leftIcon={<LuVegan />}
                    variant={mr === MealRequest.VEGAN ? 'solid' : 'outline'}
                    onClick={() => onStatusChange(gs.id, MealRequest.VEGAN)}
                  >
                    Vegan
                  </Button>
                </ButtonGroup>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};

export default Home;
