import React, { memo } from 'react';
import { Screens } from '../Screens';
import DailyReportStackNavigator from './daily/DailyReportStackNavigator';
import MonthlyReportStackNavigator from './monthly/MonthlyReportStackNavigator';
import ProjectStackNavigator from './projects/ProjectStackNavigator';
import SettingsStackNavigator from './settings/SettingsStackNavigator';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../../theme/type';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createCustomBottomTabNavigator } from '../../components/CustomBottomTabNavigator';
import { useIsMobile } from '../../components/hooks/useIsMobile';
import { useIsAdmin } from '../../components/hooks/useIsAdmin';

const Tab = createCustomBottomTabNavigator();

export default memo(function AppTabNavigator() {
  const theme = useTheme<AppTheme>();
  const isMobile = useIsMobile();
  const isAdmin = useIsAdmin();

  return (
    <Tab.Navigator
      initialRouteName={Screens.APP_DAILY_REPORT_NAVIGATOR}
      menuBarStyle={[
        { display: !isMobile ? 'flex' : 'none' },
      ]}
      containerStyle={[{ backgroundColor: theme.colors.surface }]}
      screenOptions={{
        headerShown: false,
        // tabBarActiveBackgroundColor: theme.colors.surface,
        // tabBarInactiveBackgroundColor: theme.colors.surface,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          display: !isMobile ? 'none' : 'flex',
        },
        tabBarHideOnKeyboard: true,
      }}
    // tabBar={(): null => null}
    >
      <Tab.Screen
        name={Screens.APP_DAILY_REPORT_NAVIGATOR}
        component={DailyReportStackNavigator}
        options={{
          title: 'Zilnice',
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
      {isAdmin ? <Tab.Screen
        name={Screens.APP_MONTHLY_REPORT_NAVIGATOR}
        component={MonthlyReportStackNavigator}
        options={{
          title: 'Lunare',
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
      /> : null}
      {isAdmin
        ? <Tab.Screen
          name={Screens.APP_PROJECT_NAVIGATOR}
          component={ProjectStackNavigator}
          options={{
            title: 'Proiecte',
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
        /> : null}
      <Tab.Screen
        name={Screens.APP_FINANCIAL_NAVIGATOR}
        component={SettingsStackNavigator}
        options={{
          title: 'Financiar',
          tabBarIcon: (props) => (
            <>
              <Icon
                name="euro-sign"
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
          title: 'Setari',
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
