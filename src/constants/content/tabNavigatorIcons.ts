export type TabRouteName = 'Home' | 'Cycle' | 'Track' | 'More';

import images from '../images/tabs';
import type { ImageSourcePropType } from 'react-native';

export const tabNavigatorIcons: Record<
  TabRouteName,
  { focused: ImageSourcePropType; unfocused: ImageSourcePropType }
> = {
  Home: { focused: images.btHomeActive, unfocused: images.btHome },
  Cycle: { focused: images.btCycleActive, unfocused: images.btCycle },
  Track: { focused: images.btTrackActive, unfocused: images.btTrack },
  More: { focused: images.btMoreActive, unfocused: images.btMore },
};

export const getTabIcon = (routeName: TabRouteName, focused: boolean) => {
  const iconSet = tabNavigatorIcons[routeName];
  return focused ? iconSet.focused : iconSet.unfocused;
};
