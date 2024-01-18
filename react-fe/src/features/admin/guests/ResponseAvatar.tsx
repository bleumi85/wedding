import * as React from 'react';
import { ResponseStatus } from '../../../common/enums';
import { Avatar, AvatarProps, useColorModeValue } from '@chakra-ui/react';
import { FaCheck, FaQuestion, FaX } from 'react-icons/fa6';

interface IResponseAvatarProps extends AvatarProps {
  responseStatus: ResponseStatus;
  avatarFontSize?: string | number;
}

const ResponseAvatar: React.FunctionComponent<IResponseAvatarProps> = (props) => {
  const { responseStatus, avatarFontSize = '2rem', ...rest } = props;

  const textColor = useColorModeValue('white', 'gray.700');
  const bgConfirmed = useColorModeValue('green.500', 'green.200');
  const bgOpen = useColorModeValue('yellow.500', 'yellow.200');
  const bgCanceled = useColorModeValue('red.500', 'red.200');

  switch (responseStatus) {
    case ResponseStatus.CONFIRMED:
      return <Avatar color={textColor} bg={bgConfirmed} icon={<FaCheck fontSize={avatarFontSize} />} {...rest} />;
    case ResponseStatus.OPEN:
      return <Avatar color={textColor} bg={bgOpen} icon={<FaQuestion fontSize={avatarFontSize} />} {...rest} />;
    case ResponseStatus.CANCELED:
      return <Avatar color={textColor} bg={bgCanceled} icon={<FaX fontSize={avatarFontSize} />} {...rest} />;
    default:
      return <Avatar name="!" bg={'gray.500'} {...rest} />;
  }
};

export default ResponseAvatar;
