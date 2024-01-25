import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import InvitationsTokenForm from './InvitationsTokenForm';
import InvitationsAddressForm from './InvitationsAddressForm';

const InvitationsEditLayout: React.FunctionComponent = () => {
  return (
    <Routes>
      <Route path="token/:id" element={<InvitationsTokenForm />} />
      <Route path="address/:invitationId/:addressId" element={<InvitationsAddressForm />} />
    </Routes>
  );
};

export default InvitationsEditLayout;
