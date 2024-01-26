import * as React from 'react';
import { Guest } from '../../auth/authTypes';
import { Route, Routes } from 'react-router-dom';
import GuestsView from './GuestsView';
import GuestAppPage from './GuestAddPage';
import GuestForm from './GuestForm';

interface IGuestsLayoutProps {
  guests: Guest[];
}

const GuestsLayout: React.FunctionComponent<IGuestsLayoutProps> = (props) => {
  return (
    <Routes>
      <Route index element={<GuestsView {...props} />} />
      <Route path="add" element={<GuestAppPage />} />
      <Route path="add/:invitationId" element={<div>Add with invitation</div>} />
      <Route path="edit/:invitationId/:guestId" element={<GuestForm />} />
    </Routes>
  );
};

export default GuestsLayout;
