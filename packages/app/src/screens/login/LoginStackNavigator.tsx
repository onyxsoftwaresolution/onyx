import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import LoginScreen from '../login/LoginScreen';
import { Screens } from '../Screens';

const Stack = createNativeStackNavigator();

export default memo(function LoginStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={Screens.LOGIN_SCREEN}
        component={LoginScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
});
