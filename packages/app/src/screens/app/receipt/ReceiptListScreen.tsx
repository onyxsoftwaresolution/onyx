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
import { SupplierOutDTO } from '@workspace/api/src/modules/supplier/dtos/supplier.out.dto';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { RenderOptionsFunction, useDialog } from '../../../components/hooks/useDialog';
import { AppTheme } from '../../../theme/type';

export default memo<NativeStackScreenProps<any, string>>(
  function ReceiptListScreen(props) {
    const snackbar = useSnackbar()

    const enabled = useIsFocused();
    const suppliers = useQuery(
      Queries.getSuppliers({
        enabled,
        onError() { snackbar.show('A aparut o eroare la listarea angajatilor!') }
      })
    );
    const deleteSupplier = useMutation(Mutations.deleteSupplier({
      onSuccess() { suppliers.refetch(); },
      onError() { snackbar.show('A aparut o eroare la stergerea angajatului!') },
    }),);

    const { colors } = useTheme<AppTheme>();
    const dialog = useDialog<SupplierOutDTO>();

    const onPress = useCallback(
      (supplier: SupplierOutDTO) => {
        props.navigation.navigate(Screens.APP_SUPPLIER_UPSERT, supplier);
      },
      [props.navigation],
    );

    const renderSupplier = useCallback(
      (supplier: SupplierOutDTO) => (
        <View
          style={[styles.touchStyle]}
          key={supplier.id}
        >
          <View style={[styles.item]}>
            <View style={[styles.itemRow]}>
              <TouchableRipple
                onPress={() => onPress(supplier)}
                style={[{ flex: 1 }]}
              >
                <View>
                  <Text style={[styles.itemText]}>{supplier.name}</Text>
                  <Text style={[styles.itemSubText, { color: colors.error }]}>
                    {supplier.cif}
                  </Text>
                  <View style={[{ marginBottom: 10 }]} />
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => dialog.show(supplier)}
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
      [colors.danger, colors.error, dialog, onPress],
    );

    const dialogRenderOptions: RenderOptionsFunction<SupplierOutDTO> = useCallback((supplier) => ({
      title: `Sterge sablon activitate`,
      message: <View>
        <Text>'{supplier?.name}' va fi sters!</Text>
        <Text>Esti sigur?</Text>
      </View>,
      buttons: [
        {
          label: 'Sterge',
          textColor: colors.danger,
          onPress: () => deleteSupplier.mutate(supplier.id),
        },
        () => <View style={{ flex: 1 }} />,
        { label: 'Renunta' },
      ],
    }), [colors.danger, deleteSupplier]);

    return (
      <ScreenContainer loading={suppliers.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.list]}>
          {suppliers.data?.data?.map(renderSupplier)}
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
