import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { BsQrCode } from 'react-icons/bs';
import { FaCheck, FaPenToSquare, FaTrash, FaFilePdf, FaQuestion, FaXmark, FaBomb } from 'react-icons/fa6';
import { TbMapPin, TbMapPinOff } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { ResponseStatus } from '../../../common/enums';
import { DeleteConfirmationModal } from '../../../components/controls';
import { useTable } from '../../../functions/table/useTable';
import { alertActions } from '../../alert/alertSlice';
import { Invitation, CreatePdfDto, Address, Guest } from '../../auth/authTypes';
import { useAddFilesMutation, useDeleteInvitationMutation, useDeleteAddressMutation } from '../../weddingApi';
import AddressTooltip from './AddressTooltip';
import GuestTag from './GuestTag';
import { someIsAdmin } from '../../../functions/helpers';

interface IInvitationsViewProps {
  invitations: Invitation[];
}

const InvitationsView: React.FunctionComponent<IInvitationsViewProps> = ({ invitations }) => {
  const dispatch = useAppDispatch();

  const [deleteInvitation, { isLoading: isDeleting }] = useDeleteInvitationMutation();
  const [deleteAddress, { isLoading: isDeletingAddress }] = useDeleteAddressMutation();
  const [addPdf] = useAddFilesMutation();

  const [id, setId] = React.useState('');
  const [displayConfirmationModal, setDisplayConfirmationModal] = React.useState(false);
  const [deleteMessage, setDeleteMessage] = React.useState('');

  const [addressId, setAddressId] = React.useState('');
  const [displayAddressConfirmationModal, setDisplayAddressConfirmationModal] = React.useState(false);
  const [deleteAddressMessage, setDeleteAddressMessage] = React.useState('');

  const childRef = React.useRef<IInvitationsTableFunctions>(null);

  const toggleAllRowsSelected = (selected: boolean) => {
    if (childRef.current) {
      childRef.current.toggleSelected(selected);
    }
  };

  const showDeleteModal = React.useCallback((id: string, message: string) => {
    setId(id);
    setDeleteMessage(message);
    setDisplayConfirmationModal(true);
  }, []);

  const showAddressDeleteModal = React.useCallback((id: string, message: string) => {
    setAddressId(id);
    setDeleteAddressMessage(message);
    setDisplayAddressConfirmationModal(true);
  }, []);

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const hideAddressConfirmationModal = () => {
    setDisplayAddressConfirmationModal(false);
  };

  const submitDelete = (id: string) => {
    deleteInvitation(id)
      .unwrap()
      .then((data) => {
        dispatch(alertActions.success({ title: data.message, duration: 2000 }));
      })
      .catch((err) => {
        dispatch(
          alertActions.error({
            title: 'Einladung löschen nicht möglich',
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

  const submitAddressDelete = (id: string) => {
    deleteAddress(id)
      .unwrap()
      .then((data) => {
        dispatch(alertActions.success({ title: data.message, duration: 2000 }));
      })
      .catch((err) => {
        dispatch(
          alertActions.error({
            title: 'Adresse löschen nicht möglich',
            description: JSON.stringify(err, null, 2),
            type: 'json',
          }),
        );
        console.error(err);
      })
      .finally(() => {
        hideAddressConfirmationModal();
      });
  };

  const submitCreatePdf = (values: CreatePdfDto[]) => {
    addPdf(values)
      .unwrap()
      .then((data) => {
        dispatch(
          alertActions.success({
            title: 'Pdf erfolgreich erstellt',
            description: data.message,
            duration: 2000,
          }),
        );
      })
      .catch((err) => {
        dispatch(
          alertActions.error({
            title: 'Pdf erstellen nicht möglich',
            description: JSON.stringify(err, null, 2),
            type: 'json',
          }),
        );
        console.error(err);
      })
      .finally(() => {
        toggleAllRowsSelected(false);
      });
  };

  return (
    <>
      <InvitationsTable
        invitations={invitations}
        isDeleting={isDeleting}
        isDeletingAddress={isDeletingAddress}
        showDeleteModal={showDeleteModal}
        showAddressDeleteModal={showAddressDeleteModal}
        submitCreatePdf={submitCreatePdf}
        ref={childRef}
      />
      <InvitationsList invitations={invitations} isDeleting={isDeleting} showDeleteModal={showDeleteModal} />
      <DeleteConfirmationModal
        id={id}
        showModal={displayConfirmationModal}
        confirmModal={submitDelete}
        hideModal={hideConfirmationModal}
        message={deleteMessage}
      />
      <DeleteConfirmationModal
        id={addressId}
        showModal={displayAddressConfirmationModal}
        confirmModal={submitAddressDelete}
        hideModal={hideAddressConfirmationModal}
        message={deleteAddressMessage}
      />
    </>
  );
};

interface IInvitationsTableProps extends IInvitationsViewProps {
  isDeleting: boolean;
  isDeletingAddress: boolean;
  showDeleteModal: (id: string, message: string) => void;
  showAddressDeleteModal: (id: string, message: string) => void;
  submitCreatePdf: (values: CreatePdfDto[]) => void;
}

interface IInvitationsTableFunctions {
  toggleSelected: (selected: boolean) => void;
}

const InvitationsTable = React.forwardRef<IInvitationsTableFunctions, IInvitationsTableProps>((props, ref): JSX.Element => {
  const { invitations, isDeleting, isDeletingAddress, showDeleteModal, showAddressDeleteModal, submitCreatePdf } = props;
  const columnHelper = createColumnHelper<Invitation>();

  const toggleSelected = (selected: boolean) => {
    toggleAllRowsSelected(selected);
  };

  React.useImperativeHandle(ref, () => ({
    toggleSelected,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = React.useMemo<ColumnDef<Invitation, any>[]>(
    () => [
      columnHelper.accessor('isPrinted', {
        header: () => <Center>Druck?</Center>,
        cell: (info) => <Center>{info.getValue() ? <FaCheck /> : null}</Center>,
        enableColumnFilter: false,
        meta: { headerCentered: true },
      }),
      columnHelper.accessor('token', { header: 'Token', enableSorting: false, enableColumnFilter: false }),
      columnHelper.accessor('address', {
        header: () => <Center>Adresse</Center>,
        cell: (info) => {
          const address = info.getValue<Address | null>();
          return address && <AddressTooltip address={address} />;
        },
        enableSorting: false,
        enableColumnFilter: false,
        meta: { headerCentered: true },
      }),
      columnHelper.accessor('guests', {
        header: 'Gäste',
        cell: (info) => {
          const guests = info.getValue<Guest[]>();
          return (
            <Stack direction={'row'} spacing={2}>
              {guests.map((guest) => (
                <GuestTag key={guest.id} guest={guest} size={'sm'} variant={'subtle'} />
              ))}
            </Stack>
          );
        },
        enableColumnFilter: false,
        enableSorting: false,
      }),
      columnHelper.accessor((row) => row, {
        header: '',
        id: 'actions',
        cell: (info) => {
          const { address, guests, id } = info.getValue<Invitation>();
          const hasAdmin = someIsAdmin(guests);
          const message = 'Möchtest du diese Einladung wirklich löschen? Damit löscht du auch die zugehörigen Gäste und die Adresse.';
          const addressMessage = 'Möchtest du die Adresse zu dieser Einladung wirklich löschen?';
          return (
            <Stack direction={'row'} justify={'center'}>
              <Menu>
                <MenuButton size={'xs'} as={IconButton} aria-label="Edit" isDisabled={hasAdmin} icon={<FaPenToSquare />} />
                <MenuList>
                  <MenuItem icon={<BsQrCode />} as={Link} to={`edit/token/${id}`}>
                    Token ändern
                  </MenuItem>
                  <MenuItem icon={<TbMapPin />} as={Link} to={`edit/address/${id}/${address?.id ?? '1'}`}>
                    Adresse anlegen/ändern
                  </MenuItem>
                  <MenuItem
                    icon={<TbMapPinOff />}
                    isDisabled={!address || isDeletingAddress}
                    onClick={() => showAddressDeleteModal(address!.id!, addressMessage)}
                  >
                    Adresse löschen
                  </MenuItem>
                </MenuList>
              </Menu>
              <IconButton aria-label="Delete" size={'xs'} colorScheme="red" isDisabled={isDeleting || hasAdmin} onClick={() => showDeleteModal(id, message)}>
                <FaTrash />
              </IconButton>
            </Stack>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor((row) => row, {
        header: '',
        id: 'hasFileBool',
        cell: (info) => {
          const { id, hasFile } = info.getValue<Invitation>();
          return (
            <Center>
              <Link to={`/admin/pdfs/${id}`}>
                <IconButton aria-label="PDF" size={'xs'} colorScheme="teal" isDisabled={!hasFile}>
                  <FaFilePdf />
                </IconButton>
              </Link>
            </Center>
          );
        },
        filterFn: (row, columnId, value) => {
          const rowValue: string = (!!row.getValue<Invitation>(columnId).hasFile).toString().toUpperCase();
          return rowValue === value;
        },
      }),
    ],
    [columnHelper, isDeleting, isDeletingAddress, showDeleteModal, showAddressDeleteModal],
  );

  const { TblBody, TblContainer, TblFilter, TblHead, TblPagination, getSelectedRows, toggleAllRowsSelected } = useTable(invitations, columns, {
    isSelectable: true,
    getCanSelect: (row) => row.original.hasFile,
  });

  const selectedRows: Invitation[] = getSelectedRows.map((row) => row.original);
  const hasFiles = selectedRows.some((invitation) => invitation.hasFile);

  return (
    <Stack spacing={4} display={['none', null, 'flex']}>
      <TblFilter showAdd buttonSize="sm">
        <IconButton
          aria-label="Create PDFs"
          icon={<FaFilePdf />}
          colorScheme="teal"
          size="sm"
          isDisabled={selectedRows.length === 0 || hasFiles}
          onClick={() => submitCreatePdf(selectedRows)}
        />
      </TblFilter>
      <TblContainer variant={'simple'}>
        <TblHead />
        <TblBody />
      </TblContainer>
      <TblPagination />
    </Stack>
  );
});

const message = 'Möchtest diese Einladung wirklich löschen? Damit löscht du auch die zugehörigen Gäste und die Adresse.';

const ResponseIcon = (rs: ResponseStatus) => {
  const colorCheck = useColorModeValue('green.500', 'green.200');
  const colorOpen = useColorModeValue('yellow.500', 'yellow.200');
  const colorCanceled = useColorModeValue('red.500', 'red.200');
  const colorFail = useColorModeValue('gray.500', 'gray.200');

  if (rs === ResponseStatus.CONFIRMED) return { icon: FaCheck, color: colorCheck };
  if (rs === ResponseStatus.OPEN) return { icon: FaQuestion, color: colorOpen };
  if (rs === ResponseStatus.CANCELED) return { icon: FaXmark, color: colorCanceled };
  return { icon: FaBomb, color: colorFail };
};

interface IInvitationsListProps extends IInvitationsViewProps {
  isDeleting: boolean;
  showDeleteModal: (id: string, message: string) => void;
}

const InvitationsList: React.FunctionComponent<IInvitationsListProps> = (props): JSX.Element => {
  const { invitations, isDeleting, showDeleteModal } = props;

  return (
    <Stack spacing={4} display={['flex', null, 'none']}>
      <Link to="add">
        <Button size={'sm'} w={'100%'}>
          Neue Einladung
        </Button>
      </Link>
      {invitations.map((invitation) => (
        <InvitationCard key={invitation.id} invitation={invitation} isDeleting={isDeleting} showDeleteModal={showDeleteModal} />
      ))}
    </Stack>
  );
};

interface IInvitationCardProps {
  invitation: Invitation;
  isDeleting: boolean;
  showDeleteModal: (id: string, message: string) => void;
}

const InvitationCard: React.FunctionComponent<IInvitationCardProps> = ({ invitation, isDeleting, showDeleteModal }): JSX.Element => {
  const hasAdmin = someIsAdmin(invitation.guests);
  const colorText = useColorModeValue('gray.400', 'gray.500');

  return (
    <Card>
      <CardBody pt={4} pb={0}>
        <List>
          {invitation.guests.map((guest) => {
            const { icon, color } = ResponseIcon(guest.responseStatus);
            return (
              <ListItem key={guest.id}>
                <ListIcon as={icon} color={color} />
                {guest.firstName} {guest.lastName}
              </ListItem>
            );
          })}
        </List>
      </CardBody>
      <CardFooter py={4}>
        <Stack direction={'row'} spacing={2} w={'100%'} align={'center'}>
          <Text as="samp" flexGrow={1} color={colorText}>
            {invitation.token}
          </Text>
          {invitation.hasFile && (
            <Link to={`/admin/pdfs/${invitation.id}`}>
              <IconButton aria-label="View PDF" size={'sm'} colorScheme="teal">
                <FaFilePdf />
              </IconButton>
            </Link>
          )}
          <Menu>
            <MenuButton size={'sm'} as={IconButton} aria-label="Edit" isDisabled={hasAdmin} icon={<FaPenToSquare />} />
            <MenuList>
              <MenuItem icon={<BsQrCode />} as={Link} to={`/edit/token/${invitation.id}`}>
                Token ändern
              </MenuItem>
              <MenuItem icon={<TbMapPin />} as={Link} to={`edit/address?invitationId=${invitation.id}&addressId=${invitation.address?.id ?? '0'}`}>
                Adresse anlegen/ändern
              </MenuItem>
              <MenuItem icon={<TbMapPinOff />} isDisabled={!invitation.address} onClick={() => alert('Foo')}>
                Adresse löschen
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            aria-label="Delete"
            size={'sm'}
            colorScheme="red"
            isDisabled={isDeleting || hasAdmin}
            onClick={() => showDeleteModal(invitation.id, message)}
          >
            <FaTrash />
          </IconButton>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default InvitationsView;
