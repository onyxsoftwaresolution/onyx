import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import { Screens } from '../../Screens';
import { useScreenOptions } from '../../useScreenOptions';
import ProjectListScreen from '../projects/ProjectListScreen';
import DailyReportsScreen from './DailyReportsScreen';
import DailyReportUpsertScreen from './DailyReportUpsertScreen';

const Stack = createNativeStackNavigator();

const component = memo((props: any) => <ProjectListScreen {...props} type="daily" />)

export default memo(function DailyReportStackNavigator() {
  const options = useScreenOptions();

  return (
    <Stack.Navigator initialRouteName={Screens.APP_DAILY_REPORTS_SCREEN} screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_DAILY_REPORT_PROJECTS_SCREEN}
        component={component}
        options={options('Projects')}
      />
      <Stack.Screen
        name={Screens.APP_DAILY_REPORTS_SCREEN}
        component={DailyReportsScreen}
        options={(screenProps) => ({
          ...options('Daily Reports'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_DAILY_REPORT_UPSERT}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_DAILY_REPORT_UPSERT}
        component={DailyReportUpsertScreen}
        options={options('Add/Edit Daily Report')}
      />
    </Stack.Navigator>
  );
});
