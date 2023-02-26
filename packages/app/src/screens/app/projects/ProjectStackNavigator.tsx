import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React, { memo, useCallback } from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import NotInplementedScreen from '../../NotInplementedScreen';
import { Screens } from '../../Screens';
import ProjectListScreen from './ProjectListScreen';

const Stack = createNativeStackNavigator();

export default memo(function ProjectStackNavigator() {
  const { colors } = useTheme();

  const options = useCallback(
    (title: string): NativeStackNavigationOptions => ({
      title,
      headerStyle: { backgroundColor: colors.surface },
      headerTitleStyle: { color: colors.inverseSurface },
      headerTintColor:
        Platform.OS === 'ios' ? colors.primary : colors.inverseSurface,
    }),
    [colors.inverseSurface, colors.primary, colors.surface],
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_PROJECT_LIST}
        component={ProjectListScreen}
        options={(screenProps) => ({
          ...options('Projects'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_PROJECT_UPSERT}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_PROJECT_UPSERT}
        component={NotInplementedScreen}
        options={(screenProps) => ({
          ...options('Add/Edit Project'),
        })}
      />
    </Stack.Navigator>
  );
});
