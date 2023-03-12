import {
  MD3LightTheme as DefaultTheme,
  // MD3DarkTheme as DefaultTheme,
} from 'react-native-paper';

export const darkTheme = {
  ...DefaultTheme,
  roundness: 0,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    danger: '#ff0800',
  },
  menuWidth: 200,
  iphoneWidth: 390,
  breakpoint: 390 + 200,
};
