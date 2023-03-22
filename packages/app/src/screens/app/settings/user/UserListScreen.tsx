import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenContainer from '../../../../components/ScreenContainer';
import { Queries } from '../../../../requests/queries';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Screens } from '../../../Screens';
import { useIsFocused } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { UserOutDTO } from '@workspace/api/src/modules/user/dtos/user-out.dto';
import { useSnackbar } from '../../../../components/hooks/useSnackbar';
import { Mutations } from '../../../../requests/mutations';
import { RenderOptionsFunction, useDialog } from '../../../../components/hooks/useDialog';
import { AppTheme } from '../../../../theme/type';

export default memo<NativeStackScreenProps<any, string>>(
  function UserListScreen(props) {
    const snackbar = useSnackbar()

    const enabled = useIsFocused();
    const users = useQuery(
      Queries.getUsers({
        enabled,
        onError() { snackbar.show('A aparut o eroare la listarea utilizatorilor!') }
      })
    );
    const deleteUser = useMutation(Mutations.deleteUser({
      onSuccess() { users.refetch(); },
      onError() { snackbar.show('A aparut o eroare la stergerea utilizatorului!') },
    }),);

    const { colors } = useTheme<AppTheme>();
    const dialog = useDialog<UserOutDTO>();

    const onPress = useCallback(
      (user: UserOutDTO) => {
        props.navigation.navigate(Screens.APP_USER_UPSERT, user);
      },
      [props.navigation],
    );

    const renderUser = useCallback(
      (user: UserOutDTO, index: number) => (
        <TouchableRipple
          style={[styles.touchStyle]}
          key={user.id}
          onPress={() => { }}
        >
          <View style={[styles.item]}>
            <View style={[styles.itemRow]}>
              <View style={[{ flex: 1 }]}>
                <Text style={[styles.itemText]}>{user.username}</Text>
                <Text style={[styles.itemSubText, { color: colors.error }]}>
                  {user.role}
                </Text>
                <View style={[{ marginBottom: 10 }]} />
              </View>
              <TouchableWithoutFeedback
                onPress={() => dialog.show(user)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'trash-alt'}
                  style={[{ color: colors.danger, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => onPress(user)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'pen'}
                  style={[{ color: colors.inverseSurface, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback>
            </View>
            <Divider />
          </View>
        </TouchableRipple>
      ),
      [colors.danger, colors.error, colors.inverseSurface, dialog, onPress],
    );

    const dialogRenderOptions: RenderOptionsFunction<UserOutDTO> = useCallback((user) => ({
      title: `Sterge sablon activitate`,
      message: <View>
        <Text>'{user?.username}' va fi sters!</Text>
        <Text>Esti sigur?</Text>
      </View>,
      buttons: [
        {
          label: 'Sterge',
          textColor: colors.danger,
          onPress: () => deleteUser.mutate(user.username),
        },
        () => <View style={{ flex: 1 }} />,
        { label: 'Renunta' },
      ],
    }), [colors.danger, deleteUser]);

    return (
      <ScreenContainer loading={users.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.list]}>
          {users.data?.data?.map(renderUser)}
        </View>
        {dialog.renderDialog(dialogRenderOptions)}
        {snackbar.renderSnackbar()}
      </ScreenContainer>
    );
  },
);

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
  },
  list: {
    maxWidth: 500,
    width: '95%',
    marginTop: 21,
  },
  touchStyle: {
    maxWidth: '100%',
  },
  item: {
    maxWidth: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  itemRow: {
    flex: 1,
    flexDirection: 'row',
  },
  itemText: {
    padding: 10,
    paddingBottom: 3,
    fontSize: 18,
  },
  itemSubText: {
    paddingHorizontal: 10,
    fontSize: 16,
    paddingBottom: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
