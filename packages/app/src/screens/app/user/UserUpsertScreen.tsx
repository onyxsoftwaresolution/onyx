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
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { Screens } from '../../Screens';
import { CreateUserDTO } from '@workspace/api/src/modules/user/dtos/user.create.dto';
import MGSelect from '../../../components/MGSelect';
import { Queries } from '../../../requests/queries';

export default memo<NativeStackScreenProps<any, string>>(
  function UserUpsertScreen(props) {
    const params = (props.route.params ?? {}) as CreateUserDTO;

    const snackbar = useSnackbar();

    const upsert = useMutation(
      Mutations.upsertUser({
        onSuccess: () => props.navigation.pop(),
        onError() { snackbar.show('A aparut o eroare la salvarea utilizatorului!') }
      })
    );

    const {
      control,
      handleSubmit,
      formState: { errors, isValid },
      getValues,
      watch,
    } = useForm<CreateUserDTO>({
      mode: 'onChange',
      values: {
        id: params.id ?? -1,
        username: params.username ?? '',
        password: '',
        confirmPassword: '',
        role: params.role,
      },
    });

    useEffect(() => {
      if (upsert.isSuccess) {
        if (props.navigation.canGoBack()) {
          props.navigation.goBack();
        } else {
          props.navigation.navigate(Screens.APP_USER_LIST);
        }
      }
    }, [upsert.isSuccess, props.navigation]);

    const submit = useCallback(
      ({ id, ...rest }: CreateUserDTO) => {
        if (params.id != null) {
          upsert.mutate({ id, ...rest });
        } else {
          upsert.mutate({ ...rest });
        }
      },
      [upsert, params.id],
    );

    const renderUsername = useCallback(() => {
      return (
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
              {errors.username != null ? (
                <HelperText type="error">{errors.username.message}</HelperText>
              ) : null}
              {upsert?.isError ? (
                <HelperText type="error">
                  Error: {upsert?.error?.data.code}
                </HelperText>
              ) : null}
              <MGTextInput
                value={value?.toString()}
                onChangeText={onChange}
                style={{ marginBottom: 7 }}
                label={'Nume'}
              />
            </>
          )}
          name="username"
        />
      );
    }, [control, errors.username, upsert?.error?.data.code, upsert?.isError]);

    const renderPassword = useCallback(() => {
      return (
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
              {errors.password != null ? (
                <HelperText type="error">
                  {errors.password.message}
                </HelperText>
              ) : null}
              {upsert?.isError ? (
                <HelperText type="error">
                  Error: {upsert?.error?.data.code}
                </HelperText>
              ) : null}
              <MGTextInput
                error={errors.password != null}
                secureTextEntry
                value={value}
                onChangeText={onChange}
                style={{ marginBottom: 7 }}
                label={'Parola'}
              />
            </>
          )}
          name="password"
        />
      )
    }, [control, errors.password, upsert?.error?.data.code, upsert?.isError]);

    const renderConfirmPassword = useCallback(() => {
      return (
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'required message',
            },
            validate: (value) => {
              if (watch('password') !== value) {
                return "Parolele nu sunt identice";
              }
              return isString(value) && isNotEmpty(value);
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              {errors.confirmPassword != null ? (
                <HelperText type="error">
                  {errors.confirmPassword.message}
                </HelperText>
              ) : null}
              {upsert?.isError ? (
                <HelperText type="error">
                  Error: {upsert?.error?.data.code}
                </HelperText>
              ) : null}
              <MGTextInput
                error={errors.confirmPassword != null}
                secureTextEntry
                value={value}
                onChangeText={onChange}
                style={{ marginBottom: 7 }}
                label={'Confirma parola'}
              />
            </>
          )}
          name="confirmPassword"
        />
      )
    }, [control, errors.confirmPassword, upsert?.error?.data.code, upsert?.isError]);

    const renderRole = useCallback(() => {
      return (
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
              {errors.role != null ? (
                <HelperText type="error">
                  {errors.role.message}
                </HelperText>
              ) : null}
              {upsert?.isError ? (
                <HelperText type="error">
                  Error: {upsert?.error?.data.code}
                </HelperText>
              ) : null}
              <MGSelect
                title='Alege rol'
                error={errors.role != null}
                type='input'
                getter={Queries.getRoles as any}
                text={(data: any) => data ?? value ?? ""}
                // @ts-expect-error works with string just fine
                data={value}
                onSelect={(role: any) => { onChange(role) }}
                label="Rol"
                containerStyle={[{ marginBottom: 7 }]}
              />
            </>
          )}
          name="role"
        />
      )
    }, [control, errors.role, upsert?.error?.data.code, upsert?.isError]);

    return (
      <ScreenContainer loading={upsert.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.view]}>
          {renderUsername()}
          {renderPassword()}
          {renderConfirmPassword()}
          {renderRole()}
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
