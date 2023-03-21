import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { memo, useCallback } from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Info from '../../../components/Info';
import ScreenContainer from '../../../components/ScreenContainer';
import { RenderOptionsFunction, useDialog } from '../../../components/hooks/useDialog';
import { useIsAdmin } from '../../../components/hooks/useIsAdmin';
import { useUser } from '../../../context/userContext';
import { Store } from '../../../storage/Store';
import { AppTheme } from '../../../theme/type';
import { Screens } from '../../Screens';
import { Role } from "@workspace/api/node_modules/@prisma/client";

export default memo<NativeStackScreenProps<any, string>>(
  function SettingsScreen({ navigation }) {
    const { colors } = useTheme<AppTheme>();
    const [user, setUser] = useUser();
    const isAdmin = useIsAdmin();

    const dialog = useDialog<void>();

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

          case Links.ABOUT:
            return {
              color: colors.inverseSurface,
              onPress: () => { dialog.show(); },
              icon: 'mobile-alt',
              chevron: '',
            }

          default:
            return {
              color: colors.inverseSurface,
              onPress: () => { },
              icon: '',
              chevron: '',
            };
        }
      },
      [colors.danger, colors.inverseSurface, dialog, logout, navigation],
    );

    const aboutDialogOptions: RenderOptionsFunction<unknown> = useCallback(() => ({
      title: 'Despre aplicatie',
      message: <Info />
    }), []);

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
                  <Icon style={[{ color: data.color, width: 20 }]} name={data.chevron} />
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
              Buna {user?.data?.username}!
            </Text>
          </View>
          {settings.filter(s => s.roles.length === 0 || isAdmin && s.roles?.includes(Role.ADMIN)).map((s, i) => renderItem({ item: s, index: i }))}
        </View>
        {dialog.renderDialog(aboutDialogOptions)}
      </ScreenContainer>
    );
  },
);

enum Links {
  EMPLOYEES,
  ACTIVITIES,
  LOGOUT,
  ABOUT,
}

const settings = [
  { label: 'Angajati', value: Links.EMPLOYEES, roles: [Role.ADMIN] },
  { label: 'Activitati', value: Links.ACTIVITIES, roles: [Role.ADMIN] },
  { label: 'Despre aplicatie', value: Links.ABOUT, roles: [] },
  { label: 'Logout', value: Links.LOGOUT, roles: [] },
];

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    minHeight: '100%',
  },
  list: {
    maxWidth: 500,
    width: '95%',
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
    width: 20,
  },
});
