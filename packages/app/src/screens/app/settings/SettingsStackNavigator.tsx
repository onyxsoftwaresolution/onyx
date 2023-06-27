import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React, { memo, useCallback } from 'react';
import { useTheme } from 'react-native-paper';
import { Screens } from '../../Screens';
import SettingsScreen from './SettingsScreen';
import { Platform } from 'react-native';
import EmployeeListScreen from './employee/EmployeeListScreen';
import EmployeeAddScreen from './employee/EmployeeUpsertScreen';
import ActivityTemplateListScreen from './activity/ActivityTemplateListScreen';
import ActivityTemplateUpsertScreen from './activity/ActivityTemplateUpsertScreen';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import UserListScreen from './user/UserListScreen';
import UserUpsertScreen from './user/UserUpsertScreen';
import SupplierUpsertScreen from './supplier/SupplierUpsertScreen';
import SupplierListScreen from './supplier/SupplierListScreen';
import ClientUpsertScreen from './client/ClientUpsertScreen';
import ClientListScreen from './client/ClientListScreen';

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
        options={options('Setari')}
      />
      <Stack.Screen
        name={Screens.APP_EMPLOYEE_LIST}
        component={EmployeeListScreen}
        options={(screenProps) => ({
          ...options('Angajati'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_EMPLOYEE_UPSERT}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_EMPLOYEE_UPSERT}
        component={EmployeeAddScreen}
        options={(screenProps) => ({
          ...options(''),
          title:
            // @ts-expect-error missing type
            screenProps.route.params?.name != null
              ? 'Modifica angajat'
              : 'Adauga angajat',
        })}
      />
      <Stack.Screen
        name={Screens.APP_ACTIVITY_TEMPLATE_LIST}
        component={ActivityTemplateListScreen}
        options={(screenProps) => ({
          ...options('Sablon activitati'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_ACTIVITY_TEMPLATE_UPSERT}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_ACTIVITY_TEMPLATE_UPSERT}
        component={ActivityTemplateUpsertScreen}
        options={(screenProps) => ({
          ...options(''),
          title:
            // @ts-expect-error missing type
            screenProps.route.params?.description != null
              ? 'Modifica sablon activitate'
              : 'Adauga sablon activitate',
        })}
      />
      <Stack.Screen
        name={Screens.APP_USER_LIST}
        component={UserListScreen}
        options={(screenProps) => ({
          ...options('Utilizatori'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_USER_UPSERT}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_USER_UPSERT}
        component={UserUpsertScreen}
        options={(screenProps) => ({
          ...options(''),
          title:
            // @ts-expect-error missing type
            screenProps.route.params?.username != null
              // @ts-expect-error missing type
              ? `Modifica utilizator ${screenProps.route.params?.username}`
              : 'Adauga utilizator',
        })}
      />
      <Stack.Screen
        name={Screens.APP_CLIENT_LIST}
        component={ClientListScreen}
        options={(screenProps) => ({
          ...options('Clienti'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_CLIENT_UPSERT}
              params={{}}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_CLIENT_UPSERT}
        component={ClientUpsertScreen}
        options={(screenProps) => ({
          ...options(''),
          title:
            // @ts-expect-error missing type
            screenProps.route.params?.username != null
              // @ts-expect-error missing type
              ? `Modifica client ${screenProps.route.params?.username}`
              : 'Adauga client',
        })}
      />
      <Stack.Screen
        name={Screens.APP_SUPPLIER_LIST}
        component={SupplierListScreen}
        options={(screenProps) => ({
          ...options('Furnizori'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_SUPPLIER_UPSERT}
              params={{}}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_SUPPLIER_UPSERT}
        component={SupplierUpsertScreen}
        options={(screenProps) => ({
          ...options(''),
          title:
            // @ts-expect-error missing type
            screenProps.route.params?.username != null
              // @ts-expect-error missing type
              ? `Modifica furnizor ${screenProps.route.params?.username}`
              : 'Adauga furnizor',
        })}
      />
      <Stack.Screen
        name={Screens.APP_CONTRACT_LIST}
        component={UserListScreen}
        options={(screenProps) => ({
          ...options('Contracte'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_CONTRACT_UPSERT}
              params={{}}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_CONTRACT_UPSERT}
        component={UserUpsertScreen}
        options={(screenProps) => ({
          ...options(''),
          title:
            // @ts-expect-error missing type
            screenProps.route.params?.username != null
              // @ts-expect-error missing type
              ? `Modifica contract ${screenProps.route.params?.username}`
              : 'Adauga contract',
        })}
      />
    </Stack.Navigator>
  );
});
