import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpsertClientDTO } from '@workspace/api/src/modules/client/dtos/client.in.dto';
import { isNotEmpty, isString } from 'class-validator';
import { memo, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MGButton from '../../../components/MGButton';
import MGCard from '../../../components/MGCard';
import MGRow from '../../../components/MGRow';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { Queries } from '../../../requests/queries';
import { AppTheme } from '../../../theme/type';

type Params = {
  id: number;
};

export default memo<NativeStackScreenProps<any, string>>(function ClientUpsertScreen(props) {
  const params = props.route.params as unknown as Params;

  const { colors } = useTheme<AppTheme>();

  const enabled = useIsFocused();
  const client = useQuery(Queries.getClient(params.id, {
    enabled: enabled && params.id != null,
    onSuccess: data => reset(data.data),
  }));
  const upsert = useMutation(Mutations.upsertClient({
    onSuccess: () => props.navigation.pop(),
    onError: () => snackbar.show(),
  }));

  const snackbar = useSnackbar();

  const values: UpsertClientDTO = useMemo(() => {
    const data = client.data?.data;
    return ({
      id: data?.id ?? undefined,
      name: data?.name ?? '',
      address: data?.address ?? '',
      cif: data?.cif ?? '',
      rc: data?.rc ?? '',
      bankName: data?.bankName ?? '',
      bankIban: data?.bankIban ?? '',
      phoneNumber: data?.phoneNumber ?? '',
      email: data?.email ?? '',
    });
  }, [client.data?.data]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm<UpsertClientDTO>({
    mode: 'onChange',
    values,
  });

  const submit = useCallback(
    ({ id, ...rest }: UpsertClientDTO) => {
      if (params?.id != null) {
        upsert.mutate({ id, ...rest });
      } else {
        upsert.mutate({ ...rest });
      }
    },
    [params?.id, upsert],
  );

  const renderName = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Name field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.name != null
              ? <HelperText type="error">{errors.name.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Nume client'}
            />
          </View>
        )}
        name="name"
      />
    );
  }, [control, errors.name, upsert?.error?.data.code, upsert?.isError]);

  const renderCif = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Cif field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.cif != null
              ? <HelperText type="error">{errors.cif.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'CIF'}
            />
          </View>
        )}
        name="cif"
      />
    );
  }, [control, errors.cif, upsert?.error?.data.code, upsert?.isError]);

  const renderRc = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Rc field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.rc != null
              ? <HelperText type="error">{errors.rc.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'RC'}
            />
          </View>
        )}
        name="rc"
      />
    );
  }, [control, errors.rc, upsert?.error?.data.code, upsert?.isError]);

  const renderAddress = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Address field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.address != null
              ? <HelperText type="error">{errors.address.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Adresa'}
            />
          </View>
        )}
        name="address"
      />
    );
  }, [control, errors.address, upsert?.error?.data.code, upsert?.isError]);

  const renderBankName = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'BankName field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.bankName != null
              ? <HelperText type="error">{errors.bankName.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Banca'}
            />
          </View>
        )}
        name="bankName"
      />
    );
  }, [control, errors.bankName, upsert?.error?.data.code, upsert?.isError]);

  const renderBankIban = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'BankIban field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.bankIban != null
              ? <HelperText type="error">{errors.bankIban.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Iban'}
            />
          </View>
        )}
        name="bankIban"
      />
    );
  }, [control, errors.bankIban, upsert?.error?.data.code, upsert?.isError]);

  const renderPhoneNumber = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'PhoneNumber field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.phoneNumber != null
              ? <HelperText type="error">{errors.phoneNumber.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Telefon'}
            />
          </View>
        )}
        name="phoneNumber"
      />
    );
  }, [control, errors.phoneNumber, upsert?.error?.data.code, upsert?.isError]);

  const renderEmail = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Email field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.email != null
              ? <HelperText type="error">{errors.email.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Email'}
            />
          </View>
        )}
        name="email"
      />
    );
  }, [control, errors.email, upsert?.error?.data.code, upsert?.isError]);

  return (
    <ScreenContainer
      loading={(client.isLoading && params.id != null) || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        <MGCard>
          <View style={[{ height: 20 }]} />
          {renderName()}
          <MGRow>
            {renderCif()}
            {renderRc()}
          </MGRow>
          {renderAddress()}
          <MGRow>
            {renderBankName()}
            {renderBankIban()}
          </MGRow>
          <MGRow>
            {renderPhoneNumber()}
            {renderEmail()}
          </MGRow>
        </MGCard>
        <MGButton
          icon="send"
          label={'Salveaza'}
          onPress={handleSubmit(submit)}
          style={[{ marginTop: 10, marginHorizontal: 10 }]}
        />
        <MGButton
          mode="text"
          icon={props => <Icon name="times" {...props} />}
          label={'Renunta'}
          onPress={() => props.navigation.pop()}
          style={[{ marginTop: 10, marginHorizontal: 10, flex: 1 }]}
          labelStyle={[{ color: colors.danger }]}
        />
        <View style={[{ height: 20 }]} />
      </View>
      {snackbar.renderSnackbar('An error occurred!')}
    </ScreenContainer>
  );
});

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
