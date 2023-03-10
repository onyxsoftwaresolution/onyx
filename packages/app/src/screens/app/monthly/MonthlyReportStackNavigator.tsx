import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import { Screens } from '../../Screens';
import { useScreenOptions } from '../../useScreenOptions';
import ProjectListScreen from '../projects/ProjectListScreen';
import ReportListScreen from '../reports/ReportListScreen';
import MonthlyReportUpsertScreen from './MonthlyReportUpsertScreen';

const Stack = createNativeStackNavigator();

const MonthlyReportProjectListScreen = memo((props: any) => <ProjectListScreen {...props} type="monthly" />);
const MonthlyReportsScreen = memo((props: any) => <ReportListScreen {...props} type='monthly' />);

export default memo(function MonthlyReportStackNavigator() {
  const { colors } = useTheme();
  const options = useScreenOptions();

  return (
    <Stack.Navigator initialRouteName={Screens.APP_MONTHLY_REPORT__PROJECT_LIST_SCREEN} screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_MONTHLY_REPORT__PROJECT_LIST_SCREEN}
        component={MonthlyReportProjectListScreen}
        options={options('Select a project...')}
      />
      <Stack.Screen
        name={Screens.APP_MONTHLY_REPORT__REPORT_LIST_SCREEN}
        component={MonthlyReportsScreen}
        options={(screenProps) => ({
          ...options('Monthly Reports'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_MONTHLY_REPORT__UPSERT_SCREEN}
              // @ts-expect-error type
              params={{ projectId: screenProps.route.params?.projectId }}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_MONTHLY_REPORT__UPSERT_SCREEN}
        component={MonthlyReportUpsertScreen}
        options={options('Add/Edit Project')}
      />
    </Stack.Navigator>
  );
});
