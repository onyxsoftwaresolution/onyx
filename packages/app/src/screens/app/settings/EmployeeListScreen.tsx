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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { EmployeeOutDTO } from '@workspace/api/src/modules/employee/dtos/employee.out.dto';
import { useSnackbar } from '../../../components/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { RenderOptionsFunction, useDialog } from '../../../components/useDialog';
import { AppTheme } from '../../../theme/type';

export default memo<NativeStackScreenProps<any, string>>(
  function EmployeeListScreen(props) {
    const snackbar = useSnackbar()

    const enabled = useIsFocused();
    const employees = useQuery(
      Queries.getEmployees({
        enabled,
        onError() { snackbar.show('A aparut o eroare la listarea angajatilor!') }
      })
    );
    const deleteEmployee = useMutation(Mutations.deleteEmployee({
      onSuccess() { employees.refetch(); },
      onError() { snackbar.show('A aparut o eroare la stergerea angajatului!') },
    }),);

    const { colors } = useTheme<AppTheme>();
    const dialog = useDialog<EmployeeOutDTO>();

    const onPress = useCallback(
      (employee: EmployeeOutDTO) => {
        props.navigation.navigate(Screens.APP_EMPLOYEE_UPSERT, employee);
      },
      [props.navigation],
    );

    const renderEmployee = useCallback(
      (employee: EmployeeOutDTO, index: number) => (
        <TouchableRipple
          style={[styles.touchStyle]}
          key={employee.id}
          onPress={() => { }}
        >
          <View style={[styles.item]}>
            <View style={[styles.itemRow]}>
              <View style={[{ flex: 1 }]}>
                <Text style={[styles.itemText]}>{employee.name}</Text>
                <Text style={[styles.itemSubText, { color: colors.error }]}>
                  {employee.position}
                </Text>
                <View style={[{ marginBottom: 10 }]} />
              </View>
              <TouchableWithoutFeedback
                onPress={() => dialog.show(employee)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'trash-alt'}
                  style={[{ color: colors.danger, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => onPress(employee)}
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

    const dialogRenderOptions: RenderOptionsFunction<EmployeeOutDTO> = useCallback((employee) => ({
      title: `Sterge sablon activitate`,
      message: <View>
        <Text>'{employee?.name}' va fi sters!</Text>
        <Text>Esti sigur?</Text>
      </View>,
      buttons: [
        {
          label: 'Sterge',
          textColor: colors.danger,
          onPress: () => deleteEmployee.mutate(employee.id),
        },
        () => <View style={{ flex: 1 }} />,
        { label: 'Renunta' },
      ],
    }), [colors.danger, deleteEmployee]);

    return (
      <ScreenContainer loading={employees.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.list]}>
          {employees.data?.data?.map(renderEmployee)}
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
