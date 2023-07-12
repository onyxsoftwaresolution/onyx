import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenContainer from '../../../components/ScreenContainer';
import { Queries } from '../../../requests/queries';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Screens } from '../../Screens';
import { useIsFocused } from '@react-navigation/native';
import { ReceiptOutDTO } from '@workspace/api/src/modules/receipt/dtos/receipt.out.dto';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { RenderOptionsFunction, useDialog } from '../../../components/hooks/useDialog';
import { AppTheme } from '../../../theme/type';
import ListItem from '../../../components/MGListItem';
import { getHumanReadableDate } from '../../../getHumanReadableDate';
import { getInvoiceNumberFormatter } from '../invoice/getInvoiceNumberFormatter';

type Params = {
  projectId: number;
};

export default memo<NativeStackScreenProps<any, string>>(function ReceiptListScreen(props) {
  const params = props.route.params as unknown as Params;

  const snackbar = useSnackbar()

  const enabled = useIsFocused();
  const receipts = useQuery(
    Queries.getReceipts(params.projectId, {
      enabled,
      onError() { snackbar.show('A aparut o eroare la listarea angajatilor!') }
    })
  );
  const deleteReceipt = useMutation(Mutations.deleteReceipt({
    onSuccess() { receipts.refetch(); },
    onError() { snackbar.show('A aparut o eroare la stergerea angajatului!') },
  }),);

  const { colors } = useTheme<AppTheme>();
  const dialog = useDialog<ReceiptOutDTO>();

  const onPress = useCallback(
    (receipt: ReceiptOutDTO) => {
      props.navigation.navigate(Screens.APP_RECEIPT_UPSERT, { id: receipt.id, projectId: params.projectId });
    },
    [params.projectId, props.navigation],
  );

  const renderReceipt = useCallback(
    (receipt: ReceiptOutDTO) => (
      <View
        style={[styles.touchStyle]}
        key={receipt.id}
      >
        <View style={[styles.item]}>
          <View style={[styles.itemRow]}>
            <TouchableRipple
              onPress={() => onPress(receipt)}
              style={[{ flex: 1 }]}
            >
              <ListItem
                rows={[
                  { label: 'Numar factura:', value: getInvoiceNumberFormatter(receipt.invoice?.number) },
                  { label: 'Data:', value: getHumanReadableDate(receipt.date) },
                  { label: 'Suma:', value: receipt.amount?.toString() },
                ]}
              />
            </TouchableRipple>
            <TouchableRipple
              onPress={() => dialog.show(receipt)}
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
    ),
    [colors.danger, dialog, onPress],
  );

  const dialogRenderOptions: RenderOptionsFunction<ReceiptOutDTO> = useCallback((receipt) => ({
    title: `Sterge sablon activitate`,
    message: <View>
      <Text>'{receipt?.invoice?.number}' va fi sters!</Text>
      <Text>Esti sigur?</Text>
    </View>,
    buttons: [
      {
        label: 'Sterge',
        textColor: colors.danger,
        onPress: () => deleteReceipt.mutate(receipt.id),
      },
      () => <View style={{ flex: 1 }} />,
      { label: 'Renunta' },
    ],
  }), [colors.danger, deleteReceipt]);

  return (
    <ScreenContainer loading={receipts.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
      <View style={[styles.list]}>
        {receipts.data?.data?.map(renderReceipt)}
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
    paddingHorizontal: 10,
  },
});
