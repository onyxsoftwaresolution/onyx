import React, { memo } from 'react';
import { Screens } from '../Screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DailyReportStackNavigator from './daily/DailyReportStackNavigator';
import MonthlyReportStackNavigator from './monthly/MonthlyReportStackNavigator';
import ProjectStackNavigator from './projects/ProjectStackNavigator';
import SiteReportStackNavigator from './site/SiteReportStackNavigator';
import SettingsStackNavigator from './settings/SettingsStackNavigator';
import { useTheme } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';
import { AppTheme } from '../../theme/type';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
        options={{
          title: 'Daily',
          tabBarIcon: (props) => (
            <>
              <Icon
                name="calendar-day"
                size={props.size}
                style={[{ color: props.color }]}
              />
            </>
          ),
        }}
      />
      <Tab.Screen
        name={Screens.APP_MONTHLY_REPORT_NAVIGATOR}
        component={MonthlyReportStackNavigator}
        options={{
          title: 'Monthly',
          tabBarIcon: (props) => (
            <>
              <Icon
                name="calendar-alt"
                size={props.size}
                style={[{ color: props.color }]}
              />
            </>
          ),
        }}
      />
      <Tab.Screen
        name={Screens.APP_PROJECT_NAVIGATOR}
        component={ProjectStackNavigator}
        options={{
          title: 'Projects',
          tabBarIcon: (props) => (
            <>
              <Icon
                name="tasks"
                size={props.size}
                style={[{ color: props.color }]}
              />
            </>
          ),
        }}
      />
      <Tab.Screen
        name={Screens.APP_SITE_REPORT_NAVIGATOR}
        component={SiteReportStackNavigator}
        options={{
          title: 'Site',
          tabBarIcon: (props) => (
            <>
              <Icon
                name="map-marker"
                size={props.size}
                style={[{ color: props.color }]}
              />
            </>
          ),
        }}
      />
      <Tab.Screen
        name={Screens.APP_SETTINGS_NAVIGATOR}
        component={SettingsStackNavigator}
        options={{
          title: 'Settings',
          tabBarIcon: (props) => (
            <>
              <Icon
                name="cog"
                size={props.size}
                style={[{ color: props.color }]}
              />
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
});
