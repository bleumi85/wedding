import { Stack, Tag, useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { Group } from '../../auth/authTypes';

interface IGroupsTagProps {
  groups: Group[];
}

const GroupsTag: React.FunctionComponent<IGroupsTagProps> = ({ groups }) => {
  const { colorMode } = useColorMode();

  return (
    <Stack direction={'row'}>
      {groups.map((group) => (
        <Tag
          key={group.id}
          variant={'solid'}
          color={colorMode === 'light' ? 'white' : 'gray.700'}
          sx={{
            '--tag-bg': colorMode === 'light' ? group.colorLight ?? 'gray.500' : group.colorDark ?? 'gray.200',
          }}
        >
          {group.groupName}
        </Tag>
      ))}
    </Stack>
  );
};

export default GroupsTag;
