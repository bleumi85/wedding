import * as React from 'react';
import { Group } from '../../auth/authTypes';
import { useAppDispatch } from '../../../app/hooks';
import { useDeleteGroupMutation } from '../../weddingApi';
import { alertActions } from '../../alert/alertSlice';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useTable } from '../../../functions/table/useTable';
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapse,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { DeleteConfirmationModal } from '../../../components/controls';
import { Link } from 'react-router-dom';
import { FaMoon, FaPenToSquare, FaSun, FaTrash } from 'react-icons/fa6';

interface IGroupsViewProps {
  groups: Group[];
}

const GroupsView: React.FunctionComponent<IGroupsViewProps> = ({ groups }) => {
  const dispatch = useAppDispatch();
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();

  const [id, setId] = React.useState('');
  const [displayConfirmationModal, setDisplayConfirmationModal] = React.useState(false);
  const [deleteMessage, setDeleteMessage] = React.useState<string | JSX.Element>('');

  const showDeleteModal = React.useCallback((id: string, title: string | JSX.Element) => {
    setId(id);
    setDeleteMessage(title);
    setDisplayConfirmationModal(true);
  }, []);

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const submitDelete = (id: string) => {
    deleteGroup(id)
      .unwrap()
      .then((data) => {
        dispatch(
          alertActions.success({
            description: data.message,
            duration: 2000,
          }),
        );
      })
      .catch((err) => {
        dispatch(
          alertActions.error({
            title: 'Gruppe löschen nicht möglich',
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
      <GroupsTable groups={groups} isDeleting={isDeleting} showDeleteModal={showDeleteModal} />
      <GroupsList groups={groups} isDeleting={isDeleting} showDeleteModal={showDeleteModal} />
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

interface IGroupsTableProps extends IGroupsViewProps {
  isDeleting: boolean;
  showDeleteModal: (id: string, title: string | JSX.Element) => void;
}

const GroupsTable: React.FunctionComponent<IGroupsTableProps> = (props) => {
  const { groups, isDeleting, showDeleteModal } = props;

  const columnHelper = createColumnHelper<Group>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = React.useMemo<ColumnDef<Group, any>[]>(
    () => [
      columnHelper.accessor('groupName', { header: 'Gruppenname' }),
      columnHelper.accessor((row) => row, {
        header: 'Gäste',
        cell: (info) => {
          const { guests } = info.getValue<Group>();
          return (
            <AvatarGroup size="sm" max={5}>
              {guests.map((guest) => (
                <Avatar key={guest.id} name={`${guest.firstName} ${guest.lastName}`} />
              ))}
            </AvatarGroup>
          );
        },
        enableColumnFilter: false,
        enableSorting: false,
      }),
      columnHelper.accessor((row) => row, {
        header: () => <Text textAlign={'center'}>Farben</Text>,
        id: 'colors',
        cell: (info) => {
          const { colorLight, colorDark } = info.getValue<Group>();
          return (
            <Stack direction={'row'} justify={'center'}>
              <Flex w={8} h={8} bg={colorLight ?? 'gray.700'} borderRadius={'50%'} justify={'center'} align={'center'}>
                <FaSun color={'white'} />
              </Flex>
              <Flex w={8} h={8} bg={colorDark ?? 'gray.200'} borderRadius={'50%'} justify={'center'} align={'center'}>
                <FaMoon color={'gray.700'} />
              </Flex>
            </Stack>
          );
        },
        enableColumnFilter: false,
        enableSorting: false,
        meta: { headerCentered: true },
      }),
      columnHelper.accessor((row) => row, {
        header: '',
        id: 'actions',
        cell: (info) => {
          const { id, guests, groupName } = info.getValue<Group>();
          const message = (
            <Text>
              Möchtest du die Gruppe <b>{groupName}</b> wirklich löschen?
            </Text>
          );
          return (
            <Stack direction={'row'} justify={'center'}>
              <Link to={`edit/${id}`}>
                <IconButton size={'sm'} aria-label="Edit">
                  <FaPenToSquare />
                </IconButton>
              </Link>
              <IconButton
                size={'sm'}
                aria-label="Delete"
                colorScheme="red"
                isDisabled={guests.length > 0 || isDeleting}
                onClick={() => showDeleteModal(id, message)}
              >
                <FaTrash />
              </IconButton>
            </Stack>
          );
        },
        enableColumnFilter: false,
        enableSorting: false,
      }),
    ],
    [columnHelper, isDeleting, showDeleteModal],
  );

  const { TblBody, TblContainer, TblFilter, TblHead, TblPagination } = useTable(groups, columns);

  return (
    <Stack spacing={4} display={['none', null, 'flex']}>
      <TblFilter showAdd buttonSize="sm" />
      <TblContainer variant={'simple'}>
        <colgroup>
          <col width="35%" />
          <col width="35%" />
          <col width="15%" />
          <col width="15%" />
        </colgroup>
        <TblHead />
        <TblBody />
      </TblContainer>
      <TblPagination />
    </Stack>
  );
};

interface IGroupsListProps extends IGroupsViewProps {
  isDeleting: boolean;
  showDeleteModal: (id: string, title: string | JSX.Element) => void;
}

const GroupsList: React.FunctionComponent<IGroupsListProps> = (props) => {
  const { groups, isDeleting, showDeleteModal } = props;

  return (
    <Stack spacing={4} display={['flex', null, 'none']}>
      <Link to="add">
        <Button size={'sm'} w={'100%'}>
          Neue Gruppe
        </Button>
      </Link>
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} isDeleting={isDeleting} showDeleteModal={showDeleteModal} />
      ))}
    </Stack>
  );
};

interface IGroupCardProps {
  group: Group;
  isDeleting: boolean;
  showDeleteModal: (id: string, message: string | JSX.Element) => void;
}

const GroupCard: React.FunctionComponent<IGroupCardProps> = (props) => {
  const { group, isDeleting, showDeleteModal } = props;

  const { isOpen, onToggle } = useDisclosure();

  const names = group.guests.map((guest) => `${guest.firstName} ${guest.lastName}`).join(', ');
  const message: JSX.Element = (
    <Text>
      Möchtest du die Gruppe <b>{group.groupName}</b> wirklich löschen?
    </Text>
  );

  return (
    <Card onClick={onToggle}>
      <Collapse in={!isOpen}>
        <CardHeader py={4}>
          <Stack direction={'row'} spacing={2} align={'center'}>
            <Heading size={'sm'}>{group.groupName}</Heading>
            <Flex justify={'left'} align={'center'} flexGrow={1}>
              <i>({group.guests.length + 20} Pers.)</i>
            </Flex>
            <Flex w={6} h={6} bg={group.colorLight ?? 'gray.700'} borderRadius={'50%'} justify={'center'} align={'center'}>
              <FaSun color={'white'} />
            </Flex>
            <Flex w={6} h={6} bg={group.colorDark ?? 'gray.200'} borderRadius={'50%'} justify={'center'} align={'center'}>
              <FaMoon color={'gray.700'} />
            </Flex>
          </Stack>
        </CardHeader>
      </Collapse>
      <Collapse in={isOpen}>
        <CardBody pt={4} pb={0}>
          <Text as="b" fontSize={'sm'}>
            Zur Gruppe {group.groupName} gehören:
          </Text>
          <Text fontSize={'sm'}>{names}</Text>
        </CardBody>
        <CardFooter py={4}>
          <Stack direction={'row'} justify={'right'} spacing={2} w={'100%'}>
            <Link to={`edit/${group.id}`}>
              <IconButton aria-label="Edit" size={'sm'}>
                <FaPenToSquare />
              </IconButton>
            </Link>
            <IconButton
              aria-label="Delete"
              size={'sm'}
              colorScheme="red"
              isDisabled={isDeleting || group.guests.length > 0}
              onClick={() => showDeleteModal(group.id, message)}
            >
              <FaTrash />
            </IconButton>
          </Stack>
        </CardFooter>
      </Collapse>
    </Card>
  );
};

export default GroupsView;
