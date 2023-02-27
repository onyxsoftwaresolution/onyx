import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { isNotEmpty, isString } from 'class-validator';
import { memo, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import MGButton from '../../../components/MGButton';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import { Mutations } from '../../../requests/Mutations';
import { Screens } from '../../Screens';

export default memo<NativeStackScreenProps<any, string>>(
  function EmployeeUpsertScreen(props) {
    const params: { name: string; position: string; id: number } =
      props.route.params ?? {};

    const employee = useMutation(Mutations.upsertEmployee());

    const {
      control,
      handleSubmit,
      formState: { errors, isValid },
      getValues,
    } = useForm<unknown>({
      mode: 'onChange',
      values: {
        id: params.id ?? '',
        name: params.name ?? '',
        position: params.position ?? '',
      },
    });

    useEffect(() => {
      if (employee.isSuccess) {
        if (props.navigation.canGoBack()) {
          props.navigation.goBack();
        } else {
          props.navigation.navigate(Screens.APP_EMPLOYEE_LIST);
        }
      }
    }, [employee.isSuccess, props.navigation]);

    const submit = useCallback(
      ({ id, name, position }: unknown) => {
        if (params.id != null) {
          employee.mutate({ id, name, position });
        } else {
          employee.mutate({ name, position });
        }
      },
      [employee, params.id],
    );

    return (
      <ScreenContainer scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.view]}>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'required message',
              },
              validate: (value) => {
                return isString(value) && isNotEmpty(value);
              },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                {errors.name != null ? (
                  <HelperText type="error">{errors.name.message}</HelperText>
                ) : null}
                {employee?.isError ? (
                  <HelperText type="error">
                    Error: {employee?.error?.data.code}
                  </HelperText>
                ) : null}
                <MGTextInput
                  value={value}
                  onChangeText={onChange}
                  style={{ marginBottom: 7 }}
                  placeholder={'Name'}
                />
              </>
            )}
            name="name"
          />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'required message',
              },
              validate: (value) => {
                return isString(value) && isNotEmpty(value);
              },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                {errors.position != null ? (
                  <HelperText type="error">
                    {errors.position.message}
                  </HelperText>
                ) : null}
                {employee?.isError ? (
                  <HelperText type="error">
                    Error: {employee?.error?.data.code}
                  </HelperText>
                ) : null}
                <MGTextInput
                  value={value}
                  onChangeText={onChange}
                  style={{ marginBottom: 7 }}
                  placeholder={'Position'}
                />
              </>
            )}
            name="position"
          />
          <MGButton
            icon="send"
            label={'Submit'}
            onPress={handleSubmit(submit)}
          />
        </View>
      </ScreenContainer>
    );
  },
);

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
  },
  view: {
    maxWidth: 300,
    width: '80%',
    marginTop: 21,
  },
});
