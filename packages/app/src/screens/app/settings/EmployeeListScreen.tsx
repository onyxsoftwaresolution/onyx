import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import ScreenContainer from '../../../components/ScreenContainer';
import { Queries } from '../../../requests/Queries';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Screens } from '../../Screens';
import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default memo<NativeStackScreenProps<any, string>>(
  function EmployeeListScreen(props) {
    const employees = useQuery(Queries.getEmployees());
    const { colors } = useTheme();

    useFocusEffect(() => {
      employees.refetch();
    });

    const onPress = useCallback(
      (employee) => {
        props.navigation.navigate(Screens.APP_EMPLOYEE_UPSERT, employee);
      },
      [props.navigation],
    );

    const renderEmployee = useCallback(
      (employee, i) => (
        <TouchableRipple
          style={[styles.touchStyle]}
          key={employee.id}
          onPress={() => {}}
        >
          <View style={[styles.item]}>
            <View style={[styles.itemRow]}>
              <View style={[{ flex: 1 }]}>
                <Text style={[styles.itemText]}>{employee.name}</Text>
                <Text style={[styles.itemSubText, { color: colors.error }]}>
                  {employee.position}
                </Text>
              </View>
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
      [colors.error, colors.inverseSurface, onPress],
    );

    return (
      <ScreenContainer scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.list]}>
          {employees.data?.data?.map(renderEmployee)}
        </View>
      </ScreenContainer>
    );
  },
);

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
  },
  list: {
    maxWidth: 300,
    width: '80%',
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
