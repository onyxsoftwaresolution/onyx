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
import { ProductOutDTO } from '@workspace/api/src/modules/product/dtos/product.out.dto';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { RenderOptionsFunction, useDialog } from '../../../components/hooks/useDialog';
import { AppTheme } from '../../../theme/type';

export default memo<NativeStackScreenProps<any, string>>(
  function ProductListScreen(props) {
    const snackbar = useSnackbar()

    const enabled = useIsFocused();
    const products = useQuery(
      Queries.getProducts({
        enabled,
        onError() { snackbar.show('A aparut o eroare la listarea angajatilor!') }
      })
    );
    const deleteProduct = useMutation(Mutations.deleteProduct({
      onSuccess() { products.refetch(); },
      onError() { snackbar.show('A aparut o eroare la stergerea angajatului!') },
    }),);

    const { colors } = useTheme<AppTheme>();
    const dialog = useDialog<ProductOutDTO>();

    const onPress = useCallback(
      (product: ProductOutDTO) => {
        props.navigation.navigate(Screens.APP_PRODUCT_UPSERT, product);
      },
      [props.navigation],
    );

    const renderProduct = useCallback(
      (product: ProductOutDTO) => (
        <View
          style={[styles.touchStyle]}
          key={product.id}
        >
          <View style={[styles.item]}>
            <View style={[styles.itemRow]}>
              <TouchableRipple
                onPress={() => onPress(product)}
                style={[{ flex: 1 }]}
              >
                <View>
                  <Text style={[styles.itemText]}>{product.name}</Text>
                  <Text style={[styles.itemSubText, { color: colors.error }]}>
                    {product?.suppliers?.map(s => s.name).join(', ')}
                  </Text>
                  <View style={[{ marginBottom: 10 }]} />
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => dialog.show(product)}
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

    const dialogRenderOptions: RenderOptionsFunction<ProductOutDTO> = useCallback((product) => ({
      title: `Sterge sablon activitate`,
      message: <View>
        <Text>'{product?.name}' va fi sters!</Text>
        <Text>Esti sigur?</Text>
      </View>,
      buttons: [
        {
          label: 'Sterge',
          textColor: colors.danger,
          onPress: () => deleteProduct.mutate(product.id),
        },
        () => <View style={{ flex: 1 }} />,
        { label: 'Renunta' },
      ],
    }), [colors.danger, deleteProduct]);

    return (
      <ScreenContainer
        loading={products.isLoading}
        scrollContainerStyle={[styles.scrollContainer]}
      >
        {products.data?.data.length === 0
          ? <View style={[styles.list]}>
            <Text style={{ textAlign: 'center' }} variant="bodyLarge">
              Nu ai nici un produs adaugat!
            </Text>
          </View>
          : null}
        <View style={[styles.list]}>
          {products.data?.data?.map(renderProduct)}
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
