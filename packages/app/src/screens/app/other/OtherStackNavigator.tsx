import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import { Screens } from '../../Screens';
import OtherScreen from './OtherScreen';

const Stack = createNativeStackNavigator();

export default memo(function OtherStackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_OTHER_SCREEN}
        component={OtherScreen}
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { color: colors.inverseSurface },
        }}
      />
    </Stack.Navigator>
  );
});
