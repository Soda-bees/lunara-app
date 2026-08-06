import { ImageSourcePropType } from 'react-native';
import images from '../constants/images/cycle';

/**
 * Maps backend iconType to frontend image assets
 * @param iconType - The icon type from backend (energy, mental, metabolism, mood, fertility, nutrition, movement)
 * @returns The corresponding image source
 */
export const getIconForType = (iconType: string): ImageSourcePropType => {
  const iconMap: Record<string, ImageSourcePropType> = {
    energy: images.energyIcon,
    mental: images.mentalImage,
    metabolism: images.logWaterDrop,
    mood: images.feelingsIcon,
    fertility: images.periodCalender,
    nutrition: images.nutritionIcon,
    movement: images.phasesImage,
  };

  // Return the mapped icon or fallback to phasesImage
  return iconMap[iconType] || images.phasesImage;
};
