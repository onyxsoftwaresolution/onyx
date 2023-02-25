import { NavigationContainer } from '@react-navigation/native';
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import * as React from 'react';
import { memo } from 'react';
import MainStackNavigator from './src/screens/MainStackNavigator';

const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  roundness: 0,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1079b2',
  },
};

export default memo(function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
});
