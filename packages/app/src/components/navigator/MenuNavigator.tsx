import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  ParamListBase,
  CommonActions,
  StackActionHelpers,
  StackNavigationState,
  StackRouter,
  DefaultRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';

// Props accepted by the view
type MenuNavigationConfig = {
  menuBarStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

// Supported screen options
type MenuNavigationOptions = {
  title?: string;
};

// Map of event name and the type of data (in event.data)
//
// canPreventDefault: true adds the defaultPrevented property to the
// emitted events.
type MenuNavigationEventMap = {
  tabPress: {
    data: { isAlreadyFocused: boolean };
    canPreventDefault: true;
  };
};

// The props accepted by the component is a combination of 3 things
type Props = DefaultNavigatorOptions<
  ParamListBase,
  StackNavigationState<ParamListBase>,
  MenuNavigationOptions,
  MenuNavigationEventMap
> &
  DefaultRouterOptions &
  MenuNavigationConfig;

function MenuNavigator({
  initialRouteName,
  children,
  screenOptions,
  menuBarStyle,
  contentStyle,
  containerStyle,
}: Props) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      DefaultRouterOptions,
      StackActionHelpers<ParamListBase>,
      MenuNavigationOptions,
      MenuNavigationEventMap
    >(StackRouter, {
      children,
      screenOptions,
      initialRouteName,
    });

  return (
    <NavigationContent>
      <View
        style={[
          { flexDirection: 'row', height: '100%', flex: 1 },
          containerStyle,
        ]}
      >
        <View style={[{ width: 200 }, menuBarStyle]}>
          <Text>menu</Text>
        </View>
        <View style={[{ flex: 1 }, contentStyle]}>
          {state.routes?.[0] && descriptors[state.routes[0].key].render()}
        </View>
      </View>
    </NavigationContent>
  );
}

export const createMenuNavigator = createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  MenuNavigationOptions,
  MenuNavigationEventMap,
  typeof MenuNavigator
>(MenuNavigator);
