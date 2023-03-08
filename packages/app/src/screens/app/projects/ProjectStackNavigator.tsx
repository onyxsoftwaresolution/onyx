import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React, { memo, useCallback } from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import { Screens } from '../../Screens';
import { useScreenOptions } from '../../useScreenOptions';
import ProjectListScreen from './ProjectListScreen';
import ProjectUpsertScreen from './ProjectUpsertScreen';

const Stack = createNativeStackNavigator();

const component = memo((props: any) => <ProjectListScreen {...props} type="project" />)

export default memo(function ProjectStackNavigator() {
  const options = useScreenOptions();

  return (
    <Stack.Navigator initialRouteName={Screens.APP_PROJECT_LIST} screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_PROJECT_LIST}
        component={component}
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
        component={ProjectUpsertScreen}
        options={options('Add/Edit Project')}
      />
    </Stack.Navigator>
  );
});
