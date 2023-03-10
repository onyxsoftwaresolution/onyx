import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import { Screens } from '../../Screens';
import { useScreenOptions } from '../../useScreenOptions';
import ProjectListScreen from '../projects/ProjectListScreen';
import ReportListScreen from '../reports/ReportListScreen';
import DailyReportUpsertScreen from './DailyReportUpsertScreen';

const Stack = createNativeStackNavigator();

const DailyReportProjectListScreen = memo((props: any) => <ProjectListScreen {...props} type="daily" />);
const DailyReportsScreen = memo((props: any) => <ReportListScreen {...props} type='daily' />);

export default memo(function DailyReportStackNavigator() {
  const options = useScreenOptions();

  return (
    <Stack.Navigator initialRouteName={Screens.APP_DAILY_REPORT__PROJECT_LIST_SCREEN} screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_DAILY_REPORT__PROJECT_LIST_SCREEN}
        component={DailyReportProjectListScreen}
        options={options('Select a project...')}
      />
      <Stack.Screen
        name={Screens.APP_DAILY_REPORT__REPORT_LIST_SCREEN}
        component={DailyReportsScreen}
        options={(screenProps) => ({
          ...options('Daily Reports'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_DAILY_REPORT__UPSERT_SCREEN}
              // @ts-expect-error type
              params={{ projectId: screenProps.route.params?.projectId }}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_DAILY_REPORT__UPSERT_SCREEN}
        component={DailyReportUpsertScreen}
        options={options('Add/Edit Daily Report')}
      />
    </Stack.Navigator>
  );
});
