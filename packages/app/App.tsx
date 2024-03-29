import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as React from 'react';
import { memo } from 'react';
import MainStackNavigator from './src/screens/MainStackNavigator';
import { darkTheme } from './src/theme/darkTheme';
import { Provider as UserProvider } from './src/context/userContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import dayjs from 'dayjs';
import 'dayjs/locale/ro';
dayjs.locale('ro')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: false,
      cacheTime: 0,
    },
  },
});

export default memo(function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <PaperProvider theme={darkTheme}>
          <NavigationContainer>
            <MainStackNavigator />
          </NavigationContainer>
        </PaperProvider>
      </UserProvider>
    </QueryClientProvider>
  );
});
