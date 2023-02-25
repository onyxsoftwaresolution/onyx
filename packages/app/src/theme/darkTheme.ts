import { MD3DarkTheme } from 'react-native-paper';

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 0,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#1079b2',
  },
  breakpoint: 390 + 200,
};
