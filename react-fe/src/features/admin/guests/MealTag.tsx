import * as React from 'react';
import { MealRequest } from '../../../common/enums';
import { Tag, TagLabel, TagRightIcon } from '@chakra-ui/react';
import { FaCow, FaFish, FaPlantWilt, FaSun } from 'react-icons/fa6';
import { IconType } from 'react-icons';

interface IMealTagProps {
  mealRequest: MealRequest;
}

const MealTag: React.FunctionComponent<IMealTagProps> = ({ mealRequest }) => {
  const icon: IconType =
    mealRequest === MealRequest.NONE ? FaCow : mealRequest === MealRequest.PESCETARIAN ? FaFish : mealRequest === MealRequest.VEGAN ? FaPlantWilt : FaSun;
  return (
    <Tag colorScheme="primary" variant={'outline'}>
      <TagLabel>{mealRequest}</TagLabel>
      <TagRightIcon as={icon} />
    </Tag>
  );
};

export default MealTag;
