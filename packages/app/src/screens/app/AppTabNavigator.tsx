import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { memo, useCallback } from 'react';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createCustomBottomTabNavigator } from '../../components/CustomBottomTabNavigator';
import { useIsAdmin } from '../../components/hooks/useIsAdmin';
import { useIsMobile } from '../../components/hooks/useIsMobile';
import { useUser } from '../../context/userContext';
import { Store } from '../../storage/Store';
import { AppTheme } from '../../theme/type';
import { Screens } from '../Screens';
import DailyReportStackNavigator from './daily/DailyReportStackNavigator';
import MonthlyReportStackNavigator from './monthly/MonthlyReportStackNavigator';
import ProjectStackNavigator from './projects/ProjectStackNavigator';
import { getSettingItemData, settingMenuItems } from './settings/SettingsLinks';
import SettingsStackNavigator from './settings/SettingsStackNavigator';
import { financialMenuItems, getFinancialItemData } from './financial/FinancialLinks';
import FinancialStackNavigator from './financial/FinancialStackNavigator';

const Tab = createCustomBottomTabNavigator();

export default memo<NativeStackScreenProps<any, string>>(function AppTabNavigator({ navigation }) {
  const theme = useTheme<AppTheme>();
  const isMobile = useIsMobile();
  const isAdmin = useIsAdmin();
  const { colors } = useTheme<AppTheme>();

  const [user, setUser] = useUser();

  const logout = useCallback(async () => {
    await Store.delete('access_token');
    setUser?.(undefined);
  }, [setUser]);

  const showAboutDialog = useCallback(() => { }, []);

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
          fullTitle: 'Rapoarte Zilnice',
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
          fullTitle: 'Rapoarte Lunare',
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
        component={FinancialStackNavigator}
        options={{
          title: 'Financiar',
          name: Screens.APP_FINANCIAL_NAVIGATOR,
          initialScreen: Screens.APP_FINANCIAL_SCREEN,
          items: financialMenuItems,
          getItemData: item => getFinancialItemData(item, colors, navigation),
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
          name: Screens.APP_SETTINGS_NAVIGATOR,
          initialScreen: Screens.APP_SETTINGS_SCREEN,
          items: settingMenuItems,
          getItemData: item => getSettingItemData(item, colors, navigation, logout, showAboutDialog),
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
