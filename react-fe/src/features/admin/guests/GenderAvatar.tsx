import * as React from 'react';
import { Gender } from '../../../common/enums';
import { Avatar, AvatarProps, useColorModeValue } from '@chakra-ui/react';
import { FaFemale, FaMale } from 'react-icons/fa';

interface IGenderAvatarProps extends AvatarProps {
  gender: Gender;
  avatarFontSize?: string | number;
}

const GenderAvatar: React.FunctionComponent<IGenderAvatarProps> = (props) => {
  const { gender, avatarFontSize, ...rest } = props;

  const bgMale = useColorModeValue('blue.500', 'blue.200');
  const bgFemale = useColorModeValue('pink.500', 'pink.200');
  const textColor = useColorModeValue('white', 'gray.700');

  switch (gender) {
    case Gender.MALE:
      return <Avatar bg={bgMale} color={textColor} icon={<FaMale fontSize={avatarFontSize} />} {...rest} />;
    case Gender.FEMALE:
      return <Avatar bg={bgFemale} color={textColor} icon={<FaFemale fontSize={avatarFontSize} />} {...rest} />;
    default:
      return <Avatar name="!" bg={'red.500'} {...rest} />;
  }
};

export default GenderAvatar;
