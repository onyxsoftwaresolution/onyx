import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import { Screens } from '../../Screens';
import { useScreenOptions } from '../../useScreenOptions';
import ProjectListScreen from '../projects/ProjectListScreen';
import ReportListScreen from '../reports/ReportListScreen';
import { Report } from '../reports/Report';
import ReportUpsertScreen from '../reports/ReportUpsertScreen';

const Stack = createNativeStackNavigator();

const DailyReportProjectListScreen = memo((props: any) => <ProjectListScreen {...props} type={Report.DAILY} />);
const DailyReportsScreen = memo((props: any) => <ReportListScreen {...props} type={Report.DAILY} />);
const DailyReportUpsertScreen = memo((props: any) => <ReportUpsertScreen {...props} type={Report.DAILY} />);

export default memo(function DailyReportStackNavigator() {
  const options = useScreenOptions();

  return (
    <Stack.Navigator initialRouteName={Screens.APP_DAILY_REPORT__PROJECT_LIST_SCREEN} screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_DAILY_REPORT__PROJECT_LIST_SCREEN}
        component={DailyReportProjectListScreen}
        options={options('Alege un proiect...')}
      />
      <Stack.Screen
        name={Screens.APP_DAILY_REPORT__REPORT_LIST_SCREEN}
        component={DailyReportsScreen}
        options={(screenProps) => ({
          ...options('Rapoarte zilnice'),
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
        options={screenProps => {
          return ({
            ...options(''),
            title:
              // @ts-expect-error missing type
              screenProps.route.params?.projectReportId != null
                ? 'Modifica report zilnic'
                : 'Adauga report zilnic',
          })
        }}
      />
    </Stack.Navigator>
  );
});
