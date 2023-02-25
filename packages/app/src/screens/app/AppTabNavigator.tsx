import React, { memo } from 'react';
import { Screens } from '../Screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DailyReportStackNavigator from './DailyReportStackNavigator';
import MonthlyReportStackNavigator from './MonthlyReportStackNavigator';
import ProjectStackNavigator from './ProjectStackNavigator';
import SiteReportStackNavigator from './SiteReportStackNavigator';
import OtherStackNavigator from './OtherStackNavigator';

const Tab = createBottomTabNavigator();

export default memo(function AppTabNavigator(props) {
  return (
    <Tab.Navigator
      initialRouteName={Screens.APP_PROJECT_NAVIGATOR}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name={Screens.APP_DAILY_REPORT_NAVIGATOR}
        component={DailyReportStackNavigator}
        options={{ title: '' }}
      />
      <Tab.Screen
        name={Screens.APP_MONTHLY_REPORT_NAVIGATOR}
        component={MonthlyReportStackNavigator}
        options={{ title: '' }}
      />
      <Tab.Screen
        name={Screens.APP_PROJECT_NAVIGATOR}
        component={ProjectStackNavigator}
        options={{ title: '' }}
      />
      <Tab.Screen
        name={Screens.APP_SITE_REPORT_NAVIGATOR}
        component={SiteReportStackNavigator}
        options={{ title: '' }}
      />
      <Tab.Screen
        name={Screens.APP_OTHER_NAVIGATOR}
        component={OtherStackNavigator}
        options={{ title: '' }}
      />
    </Tab.Navigator>
  );
});
