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
import ActivityTemplateListScreen, {
  ActivityTemplateAddButton,
} from './ActivityTemplateListScreen';
import NotInplementedScreen from '../../NotInplementedScreen';
import ActivityTemplateUpsertScreen from './ActivityTemplateUpsertScreen';

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
        options={(screenProps) => ({
          ...options('Add Employee'),
          title:
            screenProps.route.params?.name != null
              ? 'Edit Employee'
              : 'Add Employee',
        })}
      />
      <Stack.Screen
        name={Screens.APP_ACTIVITY_TEMPLATE_LIST}
        component={ActivityTemplateListScreen}
        options={(screenProps) => ({
          ...options('Activity Templates'),
          headerRight: (props) => (
            <ActivityTemplateAddButton {...screenProps} {...props} />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_ACTIVITY_TEMPLATE_UPSERT}
        component={ActivityTemplateUpsertScreen}
        options={(screenProps) => ({
          ...options('Add Activity Template'),
          title:
            screenProps.route.params?.description != null
              ? 'Edit Activity Template'
              : 'Add Activity Template',
        })}
      />
    </Stack.Navigator>
  );
});
