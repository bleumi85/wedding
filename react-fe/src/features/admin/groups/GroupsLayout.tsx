import * as React from 'react';
import { Group } from '../../auth/authTypes';

interface IGroupsProps {
  groups: Group[];
}

const Groups: React.FunctionComponent<IGroupsProps> = (props) => {
  return <pre>{JSON.stringify(props.groups, null, 2)}</pre>;
};

export default Groups;
