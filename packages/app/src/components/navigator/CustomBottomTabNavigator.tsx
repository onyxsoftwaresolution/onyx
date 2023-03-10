import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  TabRouter,
  TabNavigationState,
  ParamListBase,
  DefaultNavigatorOptions,
  TabRouterOptions,
  TabActionHelpers,
} from '@react-navigation/native';
import { BottomTabNavigationEventMap, BottomTabNavigationOptions, BottomTabView } from '@react-navigation/bottom-tabs';
import { StyleProp, View, Text, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

// Props accepted by the view
type TabNavigationConfig = {
  menuBarStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

// Supported screen options
type TabNavigationOptions = BottomTabNavigationOptions & {
  title?: string;
};

// Map of event name and the type of data (in event.data)
//
// canPreventDefault: true adds the defaultPrevented property to the
// emitted events.
type TabNavigationEventMap = BottomTabNavigationEventMap & {
  tabPress: {
    data: { isAlreadyFocused: boolean };
    canPreventDefault: true;
  };
};

// The props accepted by the component is a combination of 3 things
type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  TabNavigationOptions,
  TabNavigationEventMap
> &
  TabRouterOptions &
  TabNavigationConfig;

function CustomBottomTabNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenOptions,
  menuBarStyle,
  contentStyle,
  containerStyle,
  ...rest
}: Props) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      TabNavigationOptions,
      TabNavigationEventMap
    >(TabRouter, {
      initialRouteName,
      backBehavior,
      children,
      screenOptions,
    });

  const { colors } = useTheme();

  return (
    <NavigationContent>
      <View
        style={[
          {
            flexDirection: 'row',
            height: '100%',
            flex: 1,
          },
          containerStyle,
        ]}
      >
        <View
          style={[
            {
              width: 200,
              borderRightWidth: 1,
              borderRightColor: colors.inverseSurface,
            },
            menuBarStyle,
          ]}
        >
          <Text>menu</Text>
        </View>
        <View style={[{ flex: 1 }, contentStyle]}>
          <BottomTabView
            {...rest}
            state={state}
            navigation={navigation}
            descriptors={descriptors}
          />
        </View>
      </View>
    </NavigationContent>
  );
}

export const createCustomBottomTabNavigator = createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  TabNavigationOptions,
  TabNavigationEventMap,
  typeof CustomBottomTabNavigator
>(CustomBottomTabNavigator);
