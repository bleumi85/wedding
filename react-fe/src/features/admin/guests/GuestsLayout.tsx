import * as React from 'react';
import { Guest } from '../../auth/authTypes';

interface IGuestsLayoutProps {
  guests: Guest[];
}

const GuestsLayout: React.FunctionComponent<IGuestsLayoutProps> = (props) => {
  return <pre>{JSON.stringify(props.guests, null, 2)}</pre>;
};

export default GuestsLayout;
