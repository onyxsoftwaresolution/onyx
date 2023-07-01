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
import { AppTheme } from '../../../theme/type';
import { Role } from "@workspace/api/node_modules/@prisma/client";
import { getFinancialItemData, financialMenuItems } from './FinancialLinks';

export default memo<NativeStackScreenProps<any, string>>(
  function FinancialScreen({ navigation }) {
    const { colors } = useTheme<AppTheme>();
    const [user, setUser] = useUser();
    const isAdmin = useIsAdmin();

    const aboutDialog = useDialog<void>();

    const getItemData = useCallback((item: (typeof financialMenuItems)[0]) => {
      return getFinancialItemData(item, colors, navigation);
    },
      [colors, navigation],
    );

    const aboutDialogOptions: RenderOptionsFunction<unknown> = useCallback(() => ({
      title: 'Despre aplicatie',
      message: <Info />
    }), []);

    const renderItem = useCallback(
      ({
        item,
        index,
      }: Pick<ListRenderItemInfo<(typeof financialMenuItems)[0]>, 'item' | 'index'>) => {
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
          {financialMenuItems.filter(s => s.roles.length === 0 || isAdmin && s.roles?.includes(Role.ADMIN)).map((s, i) => renderItem({ item: s, index: i }))}
        </View>
        {aboutDialog.renderDialog(aboutDialogOptions)}
      </ScreenContainer>
    );
  },
);

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
