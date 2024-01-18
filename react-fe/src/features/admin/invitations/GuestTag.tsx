import { Tag, TagProps } from '@chakra-ui/react';
import * as React from 'react';
import { Guest } from '../../auth/authTypes';
import { ResponseStatus } from '../../../common/enums';

interface IGuestTagProps extends TagProps {
  guest: Guest;
}

const GuestTag: React.FunctionComponent<IGuestTagProps> = ({ guest, ...rest }) => {
  const rs = guest.responseStatus;
  const isOpen = rs === ResponseStatus.OPEN;
  const isConfirmed = rs === ResponseStatus.CONFIRMED;
  const isCanceled = rs === ResponseStatus.CANCELED;

  return (
    <Tag {...rest} colorScheme={isOpen ? 'yellow' : isConfirmed ? 'green' : isCanceled ? 'red' : 'gray'}>
      {guest.firstName} {guest.lastName}
    </Tag>
  );
};

export default GuestTag;
