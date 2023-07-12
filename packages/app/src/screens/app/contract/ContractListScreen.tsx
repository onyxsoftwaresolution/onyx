import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ContractOutDTO } from '@workspace/api/src/modules/contract/dtos/contract.out.dto';
import dayjs from 'dayjs';
import { memo, useCallback } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ScreenContainer from '../../../components/ScreenContainer';
import {
  RenderOptionsFunction,
  useDialog,
} from '../../../components/hooks/useDialog';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { Queries } from '../../../requests/queries';
import { AppTheme } from '../../../theme/type';
import { Screens } from '../../Screens';
import { API_URL } from '@env';

type Props = NativeStackScreenProps<any, string>

export default memo<Props>(function ContractListScreen({ navigation }) {
  const enabled = useIsFocused();
  const contracts = useQuery(Queries.getContracts({
    enabled,
    onError() { snackbar.show('A aparut o eroare la afisarea contractelor!') },
  }),);
  const deleteContract = useMutation(Mutations.deleteContract({
    onSuccess() { contracts.refetch(); },
    onError() { snackbar.show('A aparut o eroare la stergerea contractului!') },
  }),);

  const { colors } = useTheme<AppTheme>();

  const dialog = useDialog<ContractOutDTO>();
  const snackbar = useSnackbar();

  const onPress = useCallback(
    (contract: ContractOutDTO) => {
      navigation.navigate(Screens.APP_CONTRACT_UPSERT, { id: contract.id });
    },
    [navigation],
  );

  const onDownloadContract = useCallback(async (id: number) => {
    await Linking.openURL(`${API_URL}/v1/view-contract/${id}`);
  }, []);

  const renderContract = useCallback((contract: ContractOutDTO, index: number) => (
    <View
      style={[styles.touchStyle]}
      key={contract.id}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <TouchableRipple
            onPress={() => onPress(contract)}
            style={[{ flex: 1 }]}
          >
            <View style={[{ flex: 1 }]}>
              <Text style={[styles.itemText]}>{contract.number}</Text>
              <Text style={[styles.itemSubText, { color: colors.error }]}>
                {dayjs(contract.start).format('DD/MM/YYYY')} - {dayjs(contract.end).format('DD/MM/YYYY')}
              </Text>
              <Text style={[styles.itemSubText, { color: colors.error }]}>
                {contract.representative}
              </Text>
              <View style={[{ marginBottom: 10 }]} />
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => onDownloadContract(contract.id)}
            style={[styles.iconContainer]}
          >
            <Icon
              name={'download'}
              style={[{ fontSize: 18 }]}
            />
          </TouchableRipple>
          <TouchableRipple
            onPress={() => dialog.show(contract)}
            style={[styles.iconContainer]}
          >
            <Icon
              name={'trash-alt'}
              style={[{ color: colors.danger, fontSize: 18 }]}
            />
          </TouchableRipple>
        </View>
        <Divider />
      </View>
    </View>
  ), [colors.danger, colors.error, dialog, onPress]);

  const dialogRenderOptions: RenderOptionsFunction<ContractOutDTO> = useCallback((contract) => ({
    title: `Sterge contract '${contract?.number}'`,
    message: 'Esti sigur?',
    buttons: [
      {
        label: 'Sterge',
        textColor: colors.danger,
        onPress: () => deleteContract.mutate(contract.id),
      },
      () => <View style={{ flex: 1 }} />,
      { label: 'Renunta' },
    ],
  }), [colors.danger, deleteContract]);

  return (
    <ScreenContainer
      loading={contracts.isLoading || deleteContract.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      {contracts.data?.data.length === 0
        ? <View style={[styles.list]}>
          <Text style={{ textAlign: 'center' }} variant="bodyLarge">
            Nu ai nici un contract adaugat!
          </Text>
        </View>
        : null}
      <View style={[styles.list]}>
        {contracts.data?.data?.map(renderContract)}
      </View>
      {dialog.renderDialog(dialogRenderOptions)}
      {snackbar.renderSnackbar()}
    </ScreenContainer>
  );
});

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
    paddingHorizontal: 10,
  },
});
