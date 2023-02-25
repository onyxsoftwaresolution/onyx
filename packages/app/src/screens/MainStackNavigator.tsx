import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import AppMenuNavigator from './app/AppMenuNavigator';
import LoginStackNavigator from './login/LoginStackNavigator';
import { Screens } from './Screens';

const Stack = createNativeStackNavigator();

export default memo(function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={Screens.LOGIN_NAVIGATOR}
        component={LoginStackNavigator}
        options={{ title: '' }}
      />
      <Stack.Screen
        name={Screens.APP_MENU_NAVIGATOR}
        component={AppMenuNavigator}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
});
