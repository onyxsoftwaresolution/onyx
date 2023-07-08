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
import { CostOutDTO } from '@workspace/api/src/modules/cost/dtos/cost.out.dto';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { RenderOptionsFunction, useDialog } from '../../../components/hooks/useDialog';
import { AppTheme } from '../../../theme/type';

type Params = {
  activityId: number;
};

export default memo<NativeStackScreenProps<any, string>>(function CostListScreen(props) {
  const params = props.route.params as unknown as Params;

  const snackbar = useSnackbar()

  const enabled = useIsFocused();
  const costs = useQuery(
    Queries.getCosts(params.activityId, {
      enabled,
      onError() { snackbar.show('A aparut o eroare la listarea angajatilor!') }
    })
  );
  const deleteCost = useMutation(Mutations.deleteCost({
    onSuccess() { costs.refetch(); },
    onError() { snackbar.show('A aparut o eroare la stergerea angajatului!') },
  }),);

  const { colors } = useTheme<AppTheme>();
  const dialog = useDialog<CostOutDTO>();

  const onPress = useCallback(
    (cost: CostOutDTO) => {
      props.navigation.navigate(Screens.APP_COST_UPSERT, cost);
    },
    [props.navigation],
  );

  const renderCost = useCallback(
    (cost: CostOutDTO) => (
      <View
        style={[styles.touchStyle]}
        key={cost.id}
      >
        <View style={[styles.item]}>
          <View style={[styles.itemRow]}>
            <TouchableRipple
              onPress={() => onPress(cost)}
              style={[{ flex: 1 }]}
            >
              <View>
                <Text style={[styles.itemText]}>{cost.details}</Text>
                <Text style={[styles.itemSubText, { color: colors.error }]}>
                  {cost.amount}
                </Text>
                <View style={[{ marginBottom: 10 }]} />
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => dialog.show(cost)}
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

  const dialogRenderOptions: RenderOptionsFunction<CostOutDTO> = useCallback((cost) => ({
    title: `Sterge sablon activitate`,
    message: <View>
      <Text>'{cost?.details}' va fi sters!</Text>
      <Text>Esti sigur?</Text>
    </View>,
    buttons: [
      {
        label: 'Sterge',
        textColor: colors.danger,
        onPress: () => deleteCost.mutate(cost.id),
      },
      () => <View style={{ flex: 1 }} />,
      { label: 'Renunta' },
    ],
  }), [colors.danger, deleteCost]);

  return (
    <ScreenContainer loading={costs.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
      {costs.data?.data.length === 0
        ? <View style={[styles.list]}>
          <Text style={{ textAlign: 'center' }} variant="bodyLarge">
            Nu ai nici un cost adaugat!
          </Text>
        </View>
        : null}
      <View style={[styles.list]}>
        {costs.data?.data?.map(renderCost)}
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
