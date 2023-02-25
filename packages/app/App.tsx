import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as React from 'react';
import { memo } from 'react';
import MainStackNavigator from './src/screens/MainStackNavigator';
import { darkTheme } from './src/theme/darkTheme';

export default memo(function App() {
  return (
    <PaperProvider theme={darkTheme}>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
});
