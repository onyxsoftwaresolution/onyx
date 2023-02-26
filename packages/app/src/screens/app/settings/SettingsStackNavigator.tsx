import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React, { memo, useCallback } from 'react';
import { useTheme } from 'react-native-paper';
import { Screens } from '../../Screens';
import SettingsScreen from './SettingsScreen';
import { Platform } from 'react-native';
import EmployeeListScreen, { EmployeeAddButton } from './EmployeeListScreen';
import EmployeeAddScreen from './EmployeeUpsertScreen';

const Stack = createNativeStackNavigator();

export default memo(function SettingsStackNavigator() {
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
    <Stack.Navigator
      initialRouteName={Screens.APP_SETTINGS_SCREEN}
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name={Screens.APP_SETTINGS_SCREEN}
        component={SettingsScreen}
        options={options('Settings')}
      />
      <Stack.Screen
        name={Screens.APP_EMPLOYEE_LIST}
        component={EmployeeListScreen}
        options={(screenProps) => ({
          ...options('Employees'),
          headerRight: (props) => (
            <EmployeeAddButton {...screenProps} {...props} />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_EMPLOYEE_UPSERT}
        component={EmployeeAddScreen}
        options={options('Add Employee')}
      />
    </Stack.Navigator>
  );
});
