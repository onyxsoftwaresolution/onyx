import React, { memo } from 'react';
import { Screens } from '../Screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DailyReportStackNavigator from './DailyReportStackNavigator';
import MonthlyReportStackNavigator from './MonthlyReportStackNavigator';
import ProjectStackNavigator from './ProjectStackNavigator';
import SiteReportStackNavigator from './SiteReportStackNavigator';
import OtherStackNavigator from './OtherStackNavigator';
import { useTheme } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';
import { AppTheme } from '../../theme/type';

const Tab = createBottomTabNavigator();

export default memo(function AppTabNavigator() {
  const theme = useTheme<AppTheme>();
  const dimensions = useWindowDimensions();

  return (
    <Tab.Navigator
      initialRouteName={Screens.APP_PROJECT_NAVIGATOR}
      screenOptions={{
        headerShown: false,
        // tabBarActiveBackgroundColor: theme.colors.surface,
        // tabBarInactiveBackgroundColor: theme.colors.surface,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          display: dimensions.width >= theme.breakpoint ? 'none' : 'flex',
        },
        tabBarHideOnKeyboard: true,
      }}
      // tabBar={(): null => null}
    >
      <Tab.Screen
        name={Screens.APP_DAILY_REPORT_NAVIGATOR}
        component={DailyReportStackNavigator}
        options={{ title: 'daily' }}
      />
      <Tab.Screen
        name={Screens.APP_MONTHLY_REPORT_NAVIGATOR}
        component={MonthlyReportStackNavigator}
        options={{ title: 'monthly' }}
      />
      <Tab.Screen
        name={Screens.APP_PROJECT_NAVIGATOR}
        component={ProjectStackNavigator}
        options={{ title: 'projects' }}
      />
      <Tab.Screen
        name={Screens.APP_SITE_REPORT_NAVIGATOR}
        component={SiteReportStackNavigator}
        options={{ title: 'site' }}
      />
      <Tab.Screen
        name={Screens.APP_OTHER_NAVIGATOR}
        component={OtherStackNavigator}
        options={{ title: 'other' }}
      />
    </Tab.Navigator>
  );
});
