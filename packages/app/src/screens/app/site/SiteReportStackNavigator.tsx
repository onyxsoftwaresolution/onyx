import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import { HeaderAddButton } from '../../../components/HeaderAddButton';
import NotInplementedScreen from '../../NotInplementedScreen';
import { Screens } from '../../Screens';
import { useScreenOptions } from '../../useScreenOptions';
import ProjectListScreen from '../projects/ProjectListScreen';
import ReportListScreen from '../reports/ReportListScreen';

const Stack = createNativeStackNavigator();

const SiteReportProjectListScreen = memo((props: any) => <ProjectListScreen {...props} type="site" />);
const SiteReportsScreen = memo((props: any) => <ReportListScreen {...props} type='site' />);

export default memo(function SiteReportStackNavigator() {
  const options = useScreenOptions();

  return (
    <Stack.Navigator initialRouteName={Screens.APP_SITE_REPORT__PROJECT_LIST_SCREEN} screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={Screens.APP_SITE_REPORT__PROJECT_LIST_SCREEN}
        component={SiteReportProjectListScreen}
        options={options('Select a project...')}
      />
      <Stack.Screen
        name={Screens.APP_SITE_REPORT__REPORT_LIST_SCREEN}
        component={SiteReportsScreen}
        options={(screenProps) => ({
          ...options('Site Reports'),
          headerRight: (headerProps) => (
            <HeaderAddButton
              {...screenProps}
              {...headerProps}
              screenName={Screens.APP_SITE_REPORT__UPSERT_SCREEN}
              // @ts-expect-error type
              params={{ projectId: screenProps.route.params?.projectId }}
            />
          ),
        })}
      />
      <Stack.Screen
        name={Screens.APP_SITE_REPORT__UPSERT_SCREEN}
        component={NotInplementedScreen}
        options={options('Add/Edit Site Report')}
      />
    </Stack.Navigator>
  );
});
