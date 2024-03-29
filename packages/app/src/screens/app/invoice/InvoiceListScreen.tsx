import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import ScreenContainer from '../../../components/ScreenContainer';
import { Queries } from '../../../requests/queries';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Screens } from '../../Screens';
import { useIsFocused } from '@react-navigation/native';
import { InvoiceOutDTO } from '@workspace/api/src/modules/invoice/dtos/invoice.out.dto';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { RenderOptionsFunction, useDialog } from '../../../components/hooks/useDialog';
import { AppTheme } from '../../../theme/type';
import dayjs from 'dayjs';
import ListItem from '../../../components/MGListItem';
import { getInvoiceNumberFormatter } from './getInvoiceNumberFormatter';
import { isUUID } from 'class-validator';
import { API_URL } from '@env';

type Params = {
  projectId: number;
};

export default memo<NativeStackScreenProps<any, string>>(function InvoiceListScreen(props) {
  const params = props.route.params as unknown as Params;

  const snackbar = useSnackbar()

  const enabled = useIsFocused();
  const invoices = useQuery(
    Queries.getInvoices(params.projectId, {
      enabled,
      onError() { snackbar.show('A aparut o eroare la listarea angajatilor!') }
    })
  );
  const deleteInvoice = useMutation(Mutations.deleteInvoice({
    onSuccess() { invoices.refetch(); },
    onError() { snackbar.show('A aparut o eroare la stergerea angajatului!') },
  }),);
  const invoiceUrl = useMutation(Mutations.getInvoiceUrl());

  const { colors } = useTheme<AppTheme>();
  const dialog = useDialog<InvoiceOutDTO>();

  const onPress = useCallback(
    (invoice: InvoiceOutDTO) => {
      props.navigation.navigate(Screens.APP_INVOICE_UPSERT, invoice);
    },
    [props.navigation],
  );

  const onDownloadInvoiceUrl = useCallback(async (invoiceNumber: string) => {
    const url = await invoiceUrl.mutateAsync(invoiceNumber);
    await Linking.openURL(url.data.url);
  }, [invoiceUrl]);

  const onDownloadInvoice = useCallback(async (id: number) => {
    await Linking.openURL(`${API_URL}/v1/view-invoice/${id}`);
  }, []);

  const renderInvoice = useCallback(
    (invoice: InvoiceOutDTO) => (
      <View
        style={[styles.touchStyle]}
        key={invoice.id}
      >
        <View style={[styles.item]}>
          <View style={[styles.itemRow]}>
            <TouchableRipple
              onPress={() => onPress(invoice)}
              style={[{ flex: 1 }]}
            >
              <ListItem
                rows={[
                  { label: 'Numar factura:', value: getInvoiceNumberFormatter(invoice.number) },
                  { label: 'Data emitere:', value: dayjs(invoice.issueDate).format('DD/MM/YYYY') },
                  { label: 'Data scadenta:', value: dayjs(invoice.dueDate).format('DD/MM/YYYY') },
                ]}
              />
            </TouchableRipple>
            <TouchableRipple
              onPress={() => onDownloadInvoice(invoice.id)}
              style={[styles.iconContainer, { opacity: isUUID(invoice.number) ? 0 : 1 }]}
              disabled={isUUID(invoice.number)}
            >
              <Icon
                name={'download'}
                style={[{ fontSize: 18 }]}
              />
            </TouchableRipple>
            <TouchableRipple
              onPress={() => dialog.show(invoice)}
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
    [colors.danger, dialog, onDownloadInvoice, onPress],
  );

  const dialogRenderOptions: RenderOptionsFunction<InvoiceOutDTO> = useCallback((invoice) => ({
    title: `Sterge sablon activitate`,
    message: <View>
      <Text>'{invoice?.number}' va fi sters!</Text>
      <Text>Esti sigur?</Text>
    </View>,
    buttons: [
      {
        label: 'Sterge',
        textColor: colors.danger,
        onPress: () => deleteInvoice.mutate(invoice.id),
      },
      () => <View style={{ flex: 1 }} />,
      { label: 'Renunta' },
    ],
  }), [colors.danger, deleteInvoice]);

  return (
    <ScreenContainer loading={invoices.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
      {invoices.data?.data.length === 0
        ? <View style={[styles.list]}>
          <Text style={{ textAlign: 'center' }} variant="bodyLarge">
            Nu ai nici o factura adaugata!
          </Text>
        </View>
        : null}
      <View style={[styles.list]}>
        {invoices.data?.data?.map(renderInvoice)}
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
