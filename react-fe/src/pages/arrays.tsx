import { FaCarrot /*FaFishFins*/ } from 'react-icons/fa6';
import { LuVegan } from 'react-icons/lu';
import { TbMeat } from 'react-icons/tb';
import { MealRequest } from '../common/enums';

type MRType = {
  text: string;
  mealRequest: MealRequest;
  icon: React.ReactElement;
};

export const mealRequestArray: MRType[] = [
  { text: 'Egal', mealRequest: MealRequest.NONE, icon: <TbMeat /> },
  // { text: 'Fisch', mealRequest: MealRequest.PESCETARIAN, icon: <FaFishFins /> },
  { text: 'Veggie', mealRequest: MealRequest.VEGETARIAN, icon: <FaCarrot /> },
  { text: 'Vegan', mealRequest: MealRequest.VEGAN, icon: <LuVegan /> },
];
