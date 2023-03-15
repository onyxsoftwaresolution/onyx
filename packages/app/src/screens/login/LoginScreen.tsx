import { useMutation } from '@tanstack/react-query';
import { isNotEmpty, isString } from 'class-validator';
import React, { memo, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import MGButton from '../../components/MGButton';
import MGTextInput from '../../components/MGTextInput';
import ScreenContainer from '../../components/ScreenContainer';
import { useUser } from '../../context/userContext';
import { Mutations } from '../../requests/mutations';

export default memo(function LoginScreen() {
  const [, setUser] = useUser();

  const login = useMutation(Mutations.postLogin());

  useEffect(() => {
    if (login.isSuccess) {
      const { data, ...rest } = login.data;
      setUser?.({
        ...rest,
        data: login.data?.data?.user,
      });
    }
  }, [login, setUser]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<unknown>({
    mode: 'onChange',
    values: { username: '', password: '' },
  });

  const submit = useCallback(
    ({ username, password }: unknown) => {
      login.mutate({ username, password });
    },
    [login],
  );

  return (
    <ScreenContainer scrollContainerStyle={styles.scrollContainer}>
      <View style={styles.view}>
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
              {login?.isError ? (
                <HelperText type="error">
                  Error: {login?.error?.data?.code}
                </HelperText>
              ) : null}
              <View style={[{ flexDirection: 'row' }]}>
                <MGTextInput
                  value={value}
                  onChangeText={onChange}
                  style={{ marginBottom: 7 }}
                  label={'Username'}
                />
              </View>
            </>
          )}
          name="username"
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
              {errors.password != null ? (
                <HelperText type="error">{errors.password.message}</HelperText>
              ) : null}
              {login?.isError ? (
                <HelperText type="error">
                  Error: {login?.error?.data?.code}
                </HelperText>
              ) : null}
              <View style={[{ flexDirection: 'row' }]}>
                <MGTextInput
                  mode='outlined'
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  style={{ marginBottom: 7 }}
                  label={'Password'}
                />
              </View>
            </>
          )}
          name="password"
        />
        <MGButton icon="lock" label={'Login'} onPress={handleSubmit(submit)} />
      </View>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  view: {
    alignSelf: 'center',
    maxWidth: 500,
    width: '95%',
  },
});
