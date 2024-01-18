import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Group } from '../../auth/authTypes';
import GroupsView from './GroupsView';
import GroupsForm from './GroupsForm';

interface IGroupsProps {
  groups: Group[];
}

const Groups: React.FunctionComponent<IGroupsProps> = (props) => {
  return (
    <Routes>
      <Route index element={<GroupsView {...props} />} />
      <Route path="add" element={<GroupsForm />} />
      <Route path="edit/:id" element={<GroupsForm />} />
      <Route path="*" element={<Navigate to="/admin/groups" />} />
    </Routes>
  );
};

export default Groups;
