import { Center, Stack, IconButton, Card, CardBody, CardFooter, CardHeader, Box, Flex, Heading, Text, useDisclosure, Collapse, Button } from '@chakra-ui/react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { FaStar, FaPenToSquare, FaTrash } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { Role, ResponseStatus, MealRequest } from '../../../common/enums';
import { DeleteConfirmationModal } from '../../../components/controls';
import { useTable } from '../../../functions/table/useTable';
import { alertActions } from '../../alert/alertSlice';
import { Guest, Group } from '../../auth/authTypes';
import { useDeleteGuestMutation } from '../../weddingApi';
import GroupsTag from './GroupsTag';
import MealTag from './MealTag';
import ResponseTag from './ResponseTag';
import ResponseAvatar from './ResponseAvatar';
import GenderAvatar from './GenderAvatar';

interface IGuestsViewProps {
  guests: Guest[];
}

const GuestsView: React.FunctionComponent<IGuestsViewProps> = ({ guests }) => {
  const dispatch = useAppDispatch();
  const [deleteGuest, { isLoading: isDeleting }] = useDeleteGuestMutation();

  const [id, setId] = React.useState('');
  const [displayConfirmationModal, setDisplayConfirmationModal] = React.useState(false);
  const [deleteMessage, setDeleteMessage] = React.useState<string>('');

  const showDeleteModal = React.useCallback((id: string, message: string) => {
    setId(id);
    setDeleteMessage(message);
    setDisplayConfirmationModal(true);
  }, []);

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const submitDelete = (id: string) => {
    deleteGuest(id)
      .unwrap()
      .then((data) => {
        dispatch(alertActions.success({ title: data.message, duration: 2000 }));
      })
      .catch((err) => {
        dispatch(
          alertActions.error({
            title: 'Gast löschen nicht möglich',
            description: JSON.stringify(err, null, 2),
            type: 'json',
          }),
        );
        console.error(err);
      })
      .finally(() => {
        hideConfirmationModal();
      });
  };

  return (
    <>
      <GuestsTable guests={guests} isDeleting={isDeleting} showDeleteModal={showDeleteModal} />
      <GuestsList guests={guests} isDeleting={isDeleting} showDeleteModal={showDeleteModal} />
      <DeleteConfirmationModal
        id={id}
        showModal={displayConfirmationModal}
        confirmModal={submitDelete}
        hideModal={hideConfirmationModal}
        message={deleteMessage}
      />
    </>
  );
};

interface IGuestsTableProps extends IGuestsViewProps {
  isDeleting: boolean;
  showDeleteModal: (id: string, message: string) => void;
}

const GuestsTable: React.FunctionComponent<IGuestsTableProps> = ({ guests, isDeleting, showDeleteModal }) => {
  const columnHelper = createColumnHelper<Guest>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = React.useMemo<ColumnDef<Guest, any>[]>(
    () => [
      columnHelper.accessor('role', {
        header: '',
        cell: (info) => <Center>{info.getValue() === Role.ADMIN ? <FaStar /> : null}</Center>,
        enableColumnFilter: false,
      }),
      columnHelper.accessor('lastName', { header: 'Nachname' }),
      columnHelper.accessor('firstName', { header: 'Vorname' }),
      columnHelper.accessor('displayName', { header: 'Anzeigename', enableColumnFilter: false }),
      columnHelper.accessor('responseStatus', {
        header: 'Antwort',
        cell: (info) => <ResponseTag responseStatus={info.getValue<ResponseStatus>()} />,
      }),
      columnHelper.accessor('mealRequest', {
        header: 'Essen',
        cell: (info) => <MealTag mealRequest={info.getValue<MealRequest>()} />,
      }),
      columnHelper.accessor('groups', {
        header: 'Gruppe(n)',
        cell: (info) => <GroupsTag groups={info.getValue<Group[]>()} />,
        filterFn: (row, columnId, value) => {
          const groups = row.getValue<Group[]>(columnId);
          return groups.some((group) => group.title === value);
        },
      }),
      columnHelper.accessor((row) => row, {
        header: '',
        id: 'actions',
        cell: (info) => {
          const { id, invitation, firstName, lastName, role } = info.getValue<Guest>();
          const message = `Möchtest du ${firstName} ${lastName} wirklich löschen? Möglicherweise wird dann auch die zugehörige Einladung gelöscht.`;
          return (
            <Stack direction={'row'} justify={'center'}>
              <Link to={`edit/${invitation}/${id}`}>
                <IconButton aria-label="Edit" size={'xs'}>
                  <FaPenToSquare />
                </IconButton>
              </Link>
              <IconButton
                aria-label="Delete"
                size={'xs'}
                colorScheme="red"
                isDisabled={isDeleting || role === Role.ADMIN}
                onClick={() => showDeleteModal(id, message)}
              >
                <FaTrash />
              </IconButton>
            </Stack>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      }),
    ],
    [columnHelper, isDeleting, showDeleteModal],
  );

  const { TblBody, TblContainer, TblFilter, TblHead, TblPagination } = useTable(guests, columns);

  return (
    <Stack spacing={4} display={{ base: 'none', md: 'flex' }}>
      <TblFilter showAdd buttonSize="sm" />
      <TblContainer variant={'simple'}>
        <colgroup>
          <col width="4%" />
        </colgroup>
        <TblHead />
        <TblBody />
      </TblContainer>
      <TblPagination />
    </Stack>
  );
};

interface IGuestsListProps extends IGuestsViewProps {
  isDeleting: boolean;
  showDeleteModal: (id: string, message: string) => void;
}

const GuestsList: React.FunctionComponent<IGuestsListProps> = ({ guests, isDeleting, showDeleteModal }) => {
  return (
    <Stack spacing={4} display={{ base: 'flex', md: 'none' }}>
      <Link to="add">
        <Button size={'sm'} w={'100%'}>
          Neuer Gast
        </Button>
      </Link>
      {guests.map((guest) => (
        <GuestCard key={guest.id} guest={guest} isDeleting={isDeleting} showDeleteModal={showDeleteModal} />
      ))}
    </Stack>
  );
};

interface IGuestCardProps {
  guest: Guest;
  isDeleting: boolean;
  showDeleteModal: (id: string, message: string) => void;
}

const GuestCard: React.FunctionComponent<IGuestCardProps> = ({ guest, isDeleting, showDeleteModal }) => {
  const groupNames = guest.groups.map((group) => group.groupName).join(', ');
  const message = `Möchtest du ${guest.firstName} ${guest.lastName} wirklich löschen? Möglicherweise wird dann auch die zugehörige Einladung gelöscht.`;

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Card onClick={onToggle}>
      <CardHeader py={4}>
        <Flex>
          <Flex flexGrow={1} gap={2} alignItems={'center'} flexWrap={'wrap'}>
            <GenderAvatar gender={guest.gender} avatarFontSize={'1.25rem'} size={'sm'} />
            <Box>
              <Heading size="xs">
                {guest.firstName} {guest.lastName}
              </Heading>
              <Text as="i" fontSize={'sm'}>
                {guest.displayName}
              </Text>
            </Box>
          </Flex>
          <ResponseAvatar responseStatus={guest.responseStatus} avatarFontSize={'1.25rem'} size={'sm'} />
        </Flex>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <CardBody pt={0} pb={2}>
          <Stack spacing={4}>
            <Box>
              <Heading size="xs">Gruppen:</Heading>
              <Text fontSize={'sm'}>{groupNames}</Text>
            </Box>
            {guest.responseStatus === ResponseStatus.CONFIRMED && guest.mealRequest !== MealRequest.NONE && (
              <Box>
                <Heading size="xs">Essenswünsche:</Heading>
                <Text fontSize={'sm'}>{guest.mealRequest}</Text>
              </Box>
            )}
          </Stack>
        </CardBody>
        <CardFooter pt={2}>
          <Stack direction={'row'} justify={'right'} spacing={2} w={'100%'}>
            <Link to={`edit/${guest.invitation}/${guest.id}`}>
              <IconButton aria-label="Edit" size={'sm'}>
                <FaPenToSquare />
              </IconButton>
            </Link>
            <IconButton
              aria-label="Delete"
              size={'sm'}
              colorScheme="red"
              isDisabled={isDeleting || guest.role === Role.ADMIN}
              onClick={() => showDeleteModal(guest.id, message)}
            >
              <FaTrash />
            </IconButton>
          </Stack>
        </CardFooter>
      </Collapse>
    </Card>
  );
};

export default GuestsView;
