import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import NotInplementedScreen from '../../NotInplementedScreen';
import { Screens } from '../../Screens';
import { useScreenOptions } from '../../useScreenOptions';
import ProjectListScreen from '../projects/ProjectListScreen';
import MonthlyReportsScreen from './MonthlyReportsScreen';
import MonthlyReportUpsertScreen from './MonthlyReportUpsertScreen';

const Stack = createNativeStackNavigator();

const component = memo((props: any) => <ProjectListScreen {...props} type="monthly" />)

export default memo(function MonthlyReportStackNavigator() {
  const { colors } = useTheme();
  const options = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_MONTHLY_REPORT_PROJECTS_SCREEN}
        component={component}
        options={options('Projects')}
      />
      <Stack.Screen
        name={Screens.APP_MONTHLY_REPORTS_SCREEN}
        component={MonthlyReportsScreen}
        options={(screenProps) => ({
          ...options('Monthly Reports'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_MONTHLY_REPORT_UPSERT}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_MONTHLY_REPORT_UPSERT}
        component={MonthlyReportUpsertScreen}
        options={options('Add/Edit Project')}
      />
    </Stack.Navigator>
  );
});
