import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import AppTabNavigator from './app/AppTabNavigator';
import LoginStackNavigator from './login/LoginStackNavigator';
import { Screens } from './Screens';

const Stack = createNativeStackNavigator();

export default memo(function MainStackNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={Screens.LOGIN_NAVIGATOR}
        component={LoginStackNavigator}
        options={{ title: '' }}
      />
      <Stack.Screen
        name={Screens.APP_NAVIGATOR}
        component={AppTabNavigator}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
});
