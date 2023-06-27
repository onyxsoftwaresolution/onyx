import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { EmployeeOutDTO } from '@workspace/api/src/modules/employee/dtos/employee.out.dto';
import { isNotEmpty, isString } from 'class-validator';
import { memo, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import MGButton from '../../../components/MGButton';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { Screens } from '../../Screens';

type Params = { name: string; position: string; id: number };

export default memo<NativeStackScreenProps<any, string>>(
  function EmployeeUpsertScreen(props) {
    const params = (props.route.params ?? {}) as Params;

    const snackbar = useSnackbar();

    const upsert = useMutation(
      Mutations.upsertEmployee({
        onSuccess: () => props.navigation.pop(),
        onError() { snackbar.show('A aparut o eroare la salvarea angajatului!') }
      })
    );

    const {
      control,
      handleSubmit,
      formState: { errors, isValid },
      getValues,
    } = useForm<Partial<EmployeeOutDTO>>({
      mode: 'onChange',
      values: {
        id: params.id ?? '',
        name: params.name ?? '',
        position: params.position ?? '',
      },
    });

    useEffect(() => {
      if (upsert.isSuccess) {
        if (props.navigation.canGoBack()) {
          props.navigation.goBack();
        } else {
          props.navigation.navigate(Screens.APP_EMPLOYEE_LIST);
        }
      }
    }, [upsert.isSuccess, props.navigation]);

    const submit = useCallback(
      ({ id, name, position }: Partial<EmployeeOutDTO>) => {
        if (params.id != null) {
          upsert.mutate({ id, name, position });
        } else {
          upsert.mutate({ name, position });
        }
      },
      [upsert, params.id],
    );

    return (
      <ScreenContainer loading={upsert.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
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
                {upsert?.isError ? (
                  <HelperText type="error">
                    Error: {upsert?.error?.data.code}
                  </HelperText>
                ) : null}
                <MGTextInput
                  value={value}
                  onChangeText={onChange}
                  style={{ marginBottom: 7 }}
                  label={'Nume'}
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
                {upsert?.isError ? (
                  <HelperText type="error">
                    Error: {upsert?.error?.data.code}
                  </HelperText>
                ) : null}
                <MGTextInput
                  value={value}
                  onChangeText={onChange}
                  style={{ marginBottom: 7 }}
                  label={'Rol'}
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
    maxWidth: 500,
    width: '95%',
    marginTop: 21,
  },
});
