import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import NotInplementedScreen from '../../NotInplementedScreen';
import { Screens } from '../../Screens';

const Stack = createNativeStackNavigator();

export default memo(function ProjectStackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_PROJECT_SCREEN}
        component={NotInplementedScreen}
        options={{
          title: 'Projects',
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { color: colors.inverseSurface },
        }}
      />
    </Stack.Navigator>
  );
});
