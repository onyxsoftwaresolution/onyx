import { memo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { createMenuNavigator } from '../../components/navigator/MenuNavigator';
import { AppTheme } from '../../theme/type';
import { Screens } from '../Screens';
import AppTabNavigator from './AppTabNavigator';

const Menu = createMenuNavigator();

export default memo(function AppMenuNavigator() {
  const dimensions = useWindowDimensions();
  const theme = useTheme<AppTheme>();

  return (
    <Menu.Navigator
      menuBarStyle={[
        { display: dimensions.width >= theme.breakpoint ? 'flex' : 'none' },
      ]}
      containerStyle={[{ backgroundColor: theme.colors.surface }]}
    >
      <Menu.Screen
        name={Screens.APP_NAVIGATOR}
        component={AppTabNavigator}
        options={{ title: '' }}
      />
    </Menu.Navigator>
  );
});
