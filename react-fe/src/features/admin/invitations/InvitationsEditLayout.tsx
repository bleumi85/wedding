import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import InvitationsTokenForm from './InvitationsTokenForm';

const InvitationsEditLayout: React.FunctionComponent = () => {
  return (
    <Routes>
      <Route path="token/:id" element={<InvitationsTokenForm />} />
    </Routes>
  );
};

export default InvitationsEditLayout;
