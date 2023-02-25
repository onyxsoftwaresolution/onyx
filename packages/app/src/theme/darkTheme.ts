import { MD3DarkTheme } from 'react-native-paper';

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 0,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#007AFF',
  },
  breakpoint: 390 + 200,
};
