import { Box, Card, CardBody, CardFooter, CardHeader, SimpleGrid, Stack, Tag, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { useGetGroupsQuery } from '../../../weddingApi';
import { CreateInvitationDto } from '../../../auth/authTypes';
import GenderAvatar from '../../guests/GenderAvatar';
import { FaAddressCard } from 'react-icons/fa6';

const StepSummary: React.FunctionComponent = () => {
  const { values } = useFormikContext<CreateInvitationDto>();
  const { data: groups = [] } = useGetGroupsQuery();
  const avatarFontSize = useBreakpointValue({ base: '1.25rem', md: '2rem' });
  const cardBg = useColorModeValue('blue.100', 'gray.800');
  const tagColorScheme = useColorModeValue('primary', 'gray');

  return (
    <SimpleGrid columns={[1, null, 2]} spacing={4}>
      {values.guests.map((guest, guestIdx) => {
        const guestGroups = groups.filter((group) => guest.groups.some((value) => value === group.id));
        return (
          <Card key={guestIdx} bg={cardBg}>
            <CardHeader pt={4} pb={2}>
              <Stack direction={'row'} spacing={4}>
                <GenderAvatar gender={guest.gender} size={['sm', null, 'md']} fontSize={avatarFontSize} />
                <Text fontSize={['lg', null, '3xl']} flexGrow={1} textAlign={'left'}>
                  {guest.firstName} {guest.lastName}
                </Text>
                <Text as="i" fontSize={{ base: 'lg', md: '3xl' }}>
                  ({guest.displayName})
                </Text>
              </Stack>
            </CardHeader>
            {values.hasAddress && values.address && (
              <CardBody py={2}>
                <Stack direction={'row'} spacing={4} p={4} borderStyle={'solid'} borderWidth={1} borderRadius={'md'}>
                  <FaAddressCard fontSize={'2em'} />
                  <Box>
                    <Text fontSize={['sm', null, 'md']}>{values.address.street}</Text>
                    <Text fontSize={['sm', null, 'md']}>
                      {values.address.zipCode} {values.address.city}
                    </Text>
                    <Text fontSize={['sm', null, 'md']} mt={1}>
                      {values.address.country ?? 'Deutschland'}
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            )}
            <CardFooter pt={2} pb={4}>
              <Stack direction={'row'}>
                {guestGroups.map((guestGroup) => (
                  <Tag variant={'solid'} colorScheme={tagColorScheme} key={guestGroup.id}>
                    {guestGroup.groupName}
                  </Tag>
                ))}
              </Stack>
            </CardFooter>
          </Card>
        );
      })}
    </SimpleGrid>
  );
};

export default StepSummary;
