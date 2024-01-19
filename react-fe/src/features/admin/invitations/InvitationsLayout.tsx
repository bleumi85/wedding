import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import InvitationsView from './InvitationsView';
import { Invitation } from '../../auth/authTypes';
import InvitationsAddForm from './InvitationsAddForm';

interface IInvitationsLayoutProps {
  invitations: Invitation[];
}

const InvitationsLayout: React.FunctionComponent<IInvitationsLayoutProps> = (props) => {
  return (
    <Routes>
      <Route index element={<InvitationsView {...props} />} />
      <Route path="add" element={<InvitationsAddForm />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

export default InvitationsLayout;
