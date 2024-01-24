import { Card, CardBody, CardHeader, List, ListIcon, ListItem, Progress, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { FaFaceFlushed, FaFaceSadCry, FaFaceSmile } from 'react-icons/fa6';
import { useGetGuestsFromCommonGroupsQuery } from '../features/weddingApi';
import { ErrorBox } from '../components/controls';
import { ResponseStatus } from '../common/enums';
import { useAppSelector } from '../app/hooks';

const Applications: React.FunctionComponent = () => {
  const { data: guests = [], isLoading, error } = useGetGuestsFromCommonGroupsQuery();

  const invitation = useAppSelector((state) => state.auth.invitation);
  const nGuests = invitation!.guests.length;
  const isOne = nGuests === 1;

  const colorConfirmed = useColorModeValue('green.500', 'green.200');
  const colorOpen = useColorModeValue('yellow.500', 'yellow.200');
  const colorCanceled = useColorModeValue('red.500', 'red.200');

  if (error) return <ErrorBox error={error} />;

  if (isLoading) return <Progress isIndeterminate />;

  const guestsConfirmed = guests.filter((guest) => guest.responseStatus === ResponseStatus.CONFIRMED);

  const guestsOpen = guests.filter((guest) => guest.responseStatus === ResponseStatus.OPEN);
  const nGuestsOpen = guestsOpen.length;
  const guestsOpenIsZero = nGuestsOpen === 0;
  const guestsOpenIsOne = nGuestsOpen === 1;

  const guestsCanceled = guests.filter((guest) => guest.responseStatus === ResponseStatus.CANCELED);
  const nGuestsCanceled = guestsCanceled.length;
  const guestsCanceledIsZero = nGuestsCanceled === 0;
  const guestsCanceledIsOne = nGuestsCanceled === 1;

  const columns = 1 + (guestsOpenIsZero ? 0 : 1) + (guestsCanceledIsZero ? 0 : 1);

  return (
    <Stack fontFamily={'Dancing Script, cursive'} fontSize={['lg', null, columns === 3 ? 'xl' : '2xl']} spacing={[4, null, 6]}>
      <Text fontSize={['2xl', null, '5xl']}>Diese Gäste {isOne ? 'könntest Du' : 'könntet Ihr'} auch kennen</Text>
      <SimpleGrid columns={[1, null, columns]} spacing={4}>
        <Card>
          <CardHeader pt={4} pb={0}>
            Mit dabei sind:
          </CardHeader>
          <CardBody pt={2} pb={4}>
            <List>
              {guestsConfirmed.map((guest) => (
                <ListItem key={guest.id}>
                  <ListIcon as={FaFaceSmile} mr={4} color={colorConfirmed} />
                  {guest.firstName} {guest.lastName}
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>
        <Card display={guestsOpenIsZero ? 'none' : 'flex'}>
          <CardHeader pt={4} pb={0}>
            Bisher noch nicht zurückgemeldet {guestsOpenIsOne ? 'hat' : 'haben'} sich:
          </CardHeader>
          <CardBody pt={2} pb={4}>
            <List>
              {guestsOpen.map((guest) => (
                <ListItem key={guest.id}>
                  <ListIcon as={FaFaceFlushed} mr={4} color={colorOpen} />
                  {guest.firstName} {guest.lastName}
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>
        <Card display={guestsCanceledIsZero ? 'none' : 'flex'}>
          <CardHeader pt={4} pb={0}>
            Leider abgesagt {guestsCanceledIsOne ? 'hat' : 'haben'}:
          </CardHeader>
          <CardBody pt={2} pb={4}>
            <List>
              {guestsCanceled.map((guest) => (
                <ListItem key={guest.id}>
                  <ListIcon as={FaFaceSadCry} mr={4} color={colorCanceled} />
                  {guest.firstName} {guest.lastName}
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};

export default Applications;
