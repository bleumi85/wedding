import { Tag, TagLabel, TagRightIcon } from '@chakra-ui/react';
import * as React from 'react';
import { FaCircleCheck, FaCircleQuestion, FaCircleXmark, FaCircleExclamation } from 'react-icons/fa6';
import { ResponseStatus } from '../../../common/enums';

interface IResponseTagProps {
  responseStatus: ResponseStatus;
}

const ResponseTag: React.FunctionComponent<IResponseTagProps> = ({ responseStatus }) => {
  switch (responseStatus) {
    case ResponseStatus.CONFIRMED:
      return (
        <Tag variant={'solid'} colorScheme="green" size="md">
          <TagLabel>Zugesagt</TagLabel>
          <TagRightIcon as={FaCircleCheck} />
        </Tag>
      );
    case ResponseStatus.OPEN:
      return (
        <Tag variant={'solid'} colorScheme="yellow">
          <TagLabel>Offen</TagLabel>
          <TagRightIcon as={FaCircleQuestion} />
        </Tag>
      );
    case ResponseStatus.CANCELED:
      return (
        <Tag variant={'solid'} colorScheme="red">
          <TagLabel>Abgesagt</TagLabel>
          <TagRightIcon as={FaCircleXmark} />
        </Tag>
      );
    default:
      return (
        <Tag variant={'solid'} colorScheme="purple">
          <TagLabel>FEHLER</TagLabel>
          <TagRightIcon as={FaCircleExclamation} />
        </Tag>
      );
  }
};

export default ResponseTag;
