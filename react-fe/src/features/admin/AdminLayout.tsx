import { Select, SimpleGrid, Stack, chakra } from '@chakra-ui/react';
import * as React from 'react';
import { useGetGroupsQuery, useGetGuestsQuery, useGetInvitationsQuery } from '../weddingApi';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { NavLinkButton } from '../../components/nav/NavLinkButton';
import { BsPostcardHeartFill } from 'react-icons/bs';
import { FaPeopleGroup, FaRegFaceGrinStars } from 'react-icons/fa6';
import InvitationsLayout from './invitations/InvitationsLayout';
import GuestsLayout from './guests/GuestsLayout';
import GroupsLayout from './groups/GroupsLayout';

const AdminLayout: React.FunctionComponent = () => {
  const { data: invitations = [], isLoading: isLoadingInvitations, error: errorInvitations } = useGetInvitationsQuery();
  const { data: groups = [], isLoading: isLoadingGroups, error: errorGroups } = useGetGroupsQuery();
  const { data: guests = [], isLoading: isLoadingGuests, error: errorGuests } = useGetGuestsQuery();

  const navigate = useNavigate();

  const [selectValue, setSelectValue] = React.useState('');

  const handleSelectChange = (value: string) => {
    if (value.trim().length !== 0) {
      setSelectValue(value);
      navigate(`/admin/${value}`);
    } else {
      setSelectValue('');
      navigate('/admin');
    }
  };

  console.log('foo');

  return (
    <Stack data-testid="page_AdminLayout" spacing={{ base: 4, md: 8 }}>
      <SimpleGrid minChildWidth={150} spacing={4} display={{ base: 'none', md: 'grid' }}>
        <NavLinkButton
          to="/admin/invitations"
          leftIcon={<BsPostcardHeartFill />}
          isLoading={isLoadingInvitations}
          isDisabled={!!errorInvitations}
          colorScheme={errorInvitations ? 'red' : 'primary'}
          onClick={() => handleSelectChange('invitations')}
        >
          Einladungen
        </NavLinkButton>
        <NavLinkButton
          to="/admin/guests"
          leftIcon={<FaRegFaceGrinStars />}
          isLoading={isLoadingGuests}
          isDisabled={!!errorGuests}
          colorScheme={errorGuests ? 'red' : 'primary'}
          onClick={() => handleSelectChange('guests')}
        >
          Gäste
        </NavLinkButton>
        <NavLinkButton
          to="groups"
          leftIcon={<FaPeopleGroup />}
          isLoading={isLoadingGroups}
          isDisabled={!!errorGroups}
          colorScheme={errorGroups ? 'red' : 'primary'}
          onClick={() => handleSelectChange('groups')}
        >
          Gruppen
        </NavLinkButton>
      </SimpleGrid>
      <Select
        size={'sm'}
        placeholder="Bereich auswählen"
        value={selectValue}
        onChange={(e) => handleSelectChange(e.target.value)}
        display={{ base: 'block', md: 'block' }}
      >
        <chakra.option value="invitations" disabled={!!errorInvitations}>
          Einladungen
        </chakra.option>
        <chakra.option value="guests" disabled={!!errorGuests}>
          Gäste
        </chakra.option>
        <chakra.option value="groups" disabled={!!errorGroups}>
          Gruppen
        </chakra.option>
      </Select>
      <Routes>
        <Route index element={<div>Bitte wähle einen Bereich</div>} />
        <Route path="invitations/*" element={<InvitationsLayout invitations={invitations} />} />
        <Route path="guests/*" element={<GuestsLayout guests={guests} />} />
        <Route path="groups/*" element={<GroupsLayout groups={groups} />} />
      </Routes>
    </Stack>
  );
};

export default AdminLayout;
