import React, { useCallback, useEffect, useMemo } from 'react';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  TabRouter,
  TabNavigationState,
  ParamListBase,
  DefaultNavigatorOptions,
  TabRouterOptions,
  TabActionHelpers,
  StackActionHelpers,
} from '@react-navigation/native';
import { BottomTabNavigationEventMap, BottomTabNavigationOptions, BottomTabView } from '@react-navigation/bottom-tabs';
import { StyleProp, View, ViewStyle, FlatList, ListRenderItemInfo } from 'react-native';
import { useTheme, Text, TouchableRipple, Divider } from 'react-native-paper';
import { AppTheme } from '../theme/type';

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
      TabActionHelpers<ParamListBase> & StackActionHelpers<ParamListBase>,
      TabNavigationOptions,
      TabNavigationEventMap
    >(TabRouter, {
      initialRouteName,
      backBehavior,
      children,
      screenOptions,
    });

  const { colors, menuWidth } = useTheme<AppTheme>();

  const data = useMemo(() => state.routes.map(route => descriptors[route.key]), [descriptors, state.routes]);

  const renderItem = useCallback((item: ListRenderItemInfo<typeof descriptors[0]>) => {
    const isCurrentLink = state.history.at(-1)?.key === item.item.route.key;

    const onPressed = () => {
      if (isCurrentLink) {
        navigation.popToTop();
        return;
      }
      navigation.navigate(item.item.route.name, item.item.route.params)
    }

    return (
      <TouchableRipple
        style={[{ paddingLeft: 10, paddingVertical: 10 }]}
        onPress={onPressed}
      >
        <View style={[{ flexDirection: 'row' }]}>
          {item.item.options.tabBarIcon?.({
            color: isCurrentLink ? colors.primary : '',
            focused: isCurrentLink,
            size: 18,
          })}
          <Text style={[{ fontSize: 18, color: isCurrentLink ? colors.primary : undefined, paddingLeft: 10 }]}>{item.item.options.title}</Text>
        </View>
      </TouchableRipple>
    )
  }, [colors.primary, navigation, state.history])

  return (
    <NavigationContent>
      <View
        style={[
          {
            flexDirection: 'row',
            height: '100%',
            flex: 1,
            position: 'relative',
          },
          containerStyle,
        ]}
      >
        <View
          style={[
            {
              width: menuWidth,
              borderRightWidth: 1,
              borderRightColor: colors.elevation.level5,
              shadowColor: colors.elevation.level5,
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 1,
              shadowRadius: 4,
              zIndex: 1,
              paddingTop: 20,
            },
            menuBarStyle,
          ]}
        >
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(descriptor) => descriptor.route.key}
            ItemSeparatorComponent={Divider}
          />
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