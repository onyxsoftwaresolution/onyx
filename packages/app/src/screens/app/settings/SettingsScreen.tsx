import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { memo, useCallback } from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ScreenContainer from '../../../components/ScreenContainer';
import { useUser } from '../../../context/userContext';
import { Store } from '../../../storage/Store';
import { AppTheme } from '../../../theme/type';
import { Screens } from '../../Screens';

export default memo<NativeStackScreenProps<any, string>>(
  function SettingsScreen({ navigation }) {
    const { colors } = useTheme<AppTheme>();
    const [user, setUser] = useUser();

    const logout = useCallback(async () => {
      await Store.delete('access_token');
      setUser?.(undefined);
    }, [setUser]);

    const getItemData = useCallback(
      (item: (typeof settings)[0]) => {
        switch (item.value) {
          case Links.LOGOUT:
            return {
              color: colors.danger,
              onPress: logout,
              icon: 'sign-out-alt',
              chevron: '',
            };

          case Links.EMPLOYEES:
            return {
              color: colors.inverseSurface,
              onPress: () => {
                navigation.navigate(Screens.APP_EMPLOYEE_LIST);
              },
              icon: 'user-alt',
              chevron: 'chevron-right',
            };

          case Links.ACTIVITIES:
            return {
              color: colors.inverseSurface,
              onPress: () => {
                navigation.navigate(Screens.APP_ACTIVITY_TEMPLATE_LIST);
              },
              icon: 'tools',
              chevron: 'chevron-right',
            };

          default:
            return {
              color: colors.inverseSurface,
              onPress: () => {},
              icon: '',
              chevron: '',
            };
        }
      },
      [colors.danger, colors.inverseSurface, logout, navigation],
    );

    const renderItem = useCallback(
      ({
        item,
        index,
      }: Pick<ListRenderItemInfo<(typeof settings)[0]>, 'item' | 'index'>) => {
        const data = getItemData(item);
        return (
          <TouchableRipple key={index} onPress={data.onPress}>
            <View>
              <View style={[styles.item]}>
                <View style={[styles.iconContainer]}>
                  <Icon
                    style={[{ color: data.color, fontSize: 18 }]}
                    name={data.icon}
                  />
                </View>
                <Text style={[styles.itemText, { color: data.color }]}>
                  {item.label}
                </Text>
                <View style={[{ flex: 1 }]} />
                <View style={[styles.iconContainer]}>
                  <Icon style={[{ color: data.color }]} name={data.chevron} />
                </View>
              </View>
              <Divider />
            </View>
          </TouchableRipple>
        );
      },
      [getItemData],
    );

    return (
      <ScreenContainer scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.list]}>
          <View>
            <Text
              style={[styles.itemText, { paddingLeft: 0, marginBottom: 18 }]}
            >
              Hello {user?.data?.username}!
            </Text>
          </View>
          {settings.map((s, i) => renderItem({ item: s, index: i }))}
        </View>
      </ScreenContainer>
    );
  },
);

enum Links {
  EMPLOYEES,
  ACTIVITIES,
  LOGOUT,
}

const settings = [
  { label: 'Employees', value: Links.EMPLOYEES },
  { label: 'Activities', value: Links.ACTIVITIES },
  { label: 'Logout', value: Links.LOGOUT },
];

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
  },
  list: {
    maxWidth: 300,
    width: '80%',
    marginTop: 21,
  },
  item: {
    flexDirection: 'row',
  },
  itemText: {
    padding: 10,
    fontSize: 18,
    height: 44,
    maxHeight: 44,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
