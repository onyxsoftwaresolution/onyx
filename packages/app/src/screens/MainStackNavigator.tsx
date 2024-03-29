import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo, useMemo } from 'react';
import { useUser } from '../context/userContext';
import AppTabNavigator from './app/AppTabNavigator';
import LoadingScreen from './LoadingScreen';
import LoginStackNavigator from './login/LoginStackNavigator';
import { Screens } from './Screens';

const Stack = createNativeStackNavigator();

export default memo(function MainStackNavigator() {
  const [user] = useUser();

  const isLoading = useMemo(() => { return user == null || user?.isLoading }, [user?.isLoading]);

  // @ts-expect-error tmp
  const isLoggedIn = useMemo(() => { return user?.ok }, [user]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoading ? (
        <Stack.Screen
          name={Screens.LOADING_SCREEN}
          component={LoadingScreen}
          options={{ title: '' }}
        />
      ) : (
        <>
          {!isLoggedIn ? (
            <Stack.Screen
              name={Screens.LOGIN_NAVIGATOR}
              component={LoginStackNavigator}
              options={{ title: '' }}
            />
          ) : (
            <Stack.Screen
              name={Screens.APP_NAVIGATOR}
              component={AppTabNavigator}
              options={{ title: '' }}
            />
          )}
        </>
      )}
    </Stack.Navigator>
  );
});
