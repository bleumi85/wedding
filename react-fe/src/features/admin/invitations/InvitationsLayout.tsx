import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import InvitationsView from './InvitationsView';
import { Invitation } from '../../auth/authTypes';

interface IInvitationsLayoutProps {
  invitations: Invitation[];
}

const InvitationsLayout: React.FunctionComponent<IInvitationsLayoutProps> = (props) => {
  return (
    <Routes>
      <Route index element={<InvitationsView {...props} />} />
    </Routes>
  );
};

export default InvitationsLayout;
