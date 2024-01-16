import * as React from 'react';
import { Invitation } from '../../auth/authTypes';

interface IInvitationsLayoutProps {
  invitations: Invitation[];
}

const InvitationsLayout: React.FunctionComponent<IInvitationsLayoutProps> = (props) => {
  return <pre>{JSON.stringify(props.invitations, null, 2)}</pre>;
};

export default InvitationsLayout;
