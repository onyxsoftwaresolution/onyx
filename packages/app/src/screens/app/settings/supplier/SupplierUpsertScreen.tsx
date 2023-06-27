import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpsertSupplierDTO } from '@workspace/api/src/modules/supplier/dtos/supplier.in.dto';
import { isNotEmpty, isString } from 'class-validator';
import { memo, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MGButton from '../../../../components/MGButton';
import MGCard from '../../../../components/MGCard';
import MGRow from '../../../../components/MGRow';
import MGTextInput from '../../../../components/MGTextInput';
import ScreenContainer from '../../../../components/ScreenContainer';
import { useSnackbar } from '../../../../components/hooks/useSnackbar';
import { Mutations } from '../../../../requests/mutations';
import { Queries } from '../../../../requests/queries';
import { AppTheme } from '../../../../theme/type';

type Params = {
  id: number;
};

export default memo<NativeStackScreenProps<any, string>>(function SupplierUpsertScreen(props) {
  const params = props.route.params as unknown as Params;

  const { colors } = useTheme<AppTheme>();

  const enabled = useIsFocused();
  const supplier = useQuery(Queries.getSupplier(params.id, {
    enabled: enabled && params.id != null,
    onSuccess: data => reset(data.data),
  }));
  const upsert = useMutation(Mutations.upsertSupplier({
    onSuccess: () => props.navigation.pop(),
    onError: () => snackbar.show(),
  }));

  const snackbar = useSnackbar();

  const values: UpsertSupplierDTO = useMemo(() => {
    const data = supplier.data?.data;
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
      products: data?.products ?? '',
    });
  }, [supplier.data?.data]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm<UpsertSupplierDTO>({
    mode: 'onChange',
    values,
  });

  const submit = useCallback(
    ({ id, ...rest }: UpsertSupplierDTO) => {
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
              multiline
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7, height: 77 }}
              label={'Nume furnizor'}
            />
          </View>
        )}
        name="name"
      />
    );
  }, [control, errors.name, upsert?.error?.data.code, upsert?.isError]);

  return (
    <ScreenContainer
      loading={(supplier.isLoading && params.id != null) || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        <MGCard title={'Detalii furnizor'}>
          {renderName()}
          <MGRow>
            {/* {renderArea()}
            {renderCode()} */}
          </MGRow>
          <MGRow>
            {/* {renderStart()}
            {renderEnd()} */}
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
