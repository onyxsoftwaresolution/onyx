import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ClientOutDTO } from '@workspace/api/src/modules/client/dtos/client.out.dto';
import { UpsertContractDTO } from '@workspace/api/src/modules/contract/dtos/contract.in.dto';
import { isDate, isDateString, isInt, isNotEmpty, isNumber, isString } from 'class-validator';
import dayjs from 'dayjs';
import { memo, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MGButton from '../../../components/MGButton';
import MGCard from '../../../components/MGCard';
import MGDatePicker from '../../../components/MGDatePicker';
import MGRow from '../../../components/MGRow';
import MGSelect from '../../../components/MGSelect';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { dayOrNull } from '../../../dayOrNull';
import { Mutations } from '../../../requests/mutations';
import { Queries } from '../../../requests/queries';
import { AppTheme } from '../../../theme/type';

type Params = {
  id: number;
};

export default memo<NativeStackScreenProps<any, string>>(function ContractUpsertScreen(props) {
  const params = props.route.params as unknown as Params;

  const { colors } = useTheme<AppTheme>();

  const enabled = useIsFocused();
  const contract = useQuery(Queries.getContract(params.id, {
    enabled: enabled && params.id != null,
    onSuccess: data => reset(data.data),
  }));
  const upsert = useMutation(Mutations.upsertContract({
    onSuccess: () => props.navigation.pop(),
    onError: () => snackbar.show(),
  }));

  const snackbar = useSnackbar();

  const values: UpsertContractDTO = useMemo(() => {
    const data = contract.data?.data;
    return ({
      id: data?.id ?? undefined,
      end: data?.end ?? '',
      start: data?.start ?? '',
      client: data?.client ?? '',
      cost: (data?.cost ?? '') as unknown as number,
      details: data?.details ?? '',
      location: data?.location ?? '',
      number: data?.number ?? '',
      representative: data?.representative ?? '',
    });
  }, [contract.data?.data]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm<UpsertContractDTO>({
    mode: 'onChange',
    values,
  });

  const submit = useCallback(
    ({ id, ...rest }: UpsertContractDTO) => {
      if (params?.id != null) {
        upsert.mutate({ id, ...rest });
      } else {
        upsert.mutate({ ...rest });
      }
    },
    [params?.id, upsert],
  );

  const renderNumber = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Number field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.number != null
              ? <HelperText type="error">{errors.number.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Numar contract'}
            />
          </View>
        )}
        name="number"
      />
    );
  }, [control, errors.number, upsert?.error?.data.code, upsert?.isError]);

  const renderCost = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Cost field is required!' },
          validate: (value) => isNumber(parseFloat(value.toString())),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.cost != null
              ? <HelperText type="error">{errors.cost.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value?.toString()}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Cost'}
            />
          </View>
        )}
        name="cost"
      />
    );
  }, [control, errors.cost, upsert?.error?.data.code, upsert?.isError]);

  const renderRepresentative = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Representative field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.representative != null
              ? <HelperText type="error">{errors.representative.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Reprezentant'}
            />
          </View>
        )}
        name="representative"
      />
    );
  }, [control, errors.representative, upsert?.error?.data.code, upsert?.isError]);

  const renderDetails = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Details field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.details != null
              ? <HelperText type="error">{errors.details.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Detailii'}
            />
          </View>
        )}
        name="details"
      />
    );
  }, [control, errors.details, upsert?.error?.data.code, upsert?.isError]);

  const renderLocation = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Location field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.location != null
              ? <HelperText type="error">{errors.location.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Locatie'}
            />
          </View>
        )}
        name="location"
      />
    );
  }, [control, errors.location, upsert?.error?.data.code, upsert?.isError]);

  const renderStart = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Start field is required!' },
          validate: (value) => (isDate(value) || isDateString(value)) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.start != null
              ? <HelperText type="error">{errors.start.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGDatePicker
              mode='single'
              value={dayOrNull(dayjs(value))?.toDate()}
              onDateChange={d => onChange(d.date)}
              containerStyle={{ marginBottom: 7 }}
              label={'Data inceput'}
            />
          </View>
        )}
        name="start"
      />
    );
  }, [control, errors.start, upsert?.error?.data.code, upsert?.isError]);

  const renderEnd = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'End field is required!' },
          validate: (value) => (isDate(value) || isDateString(value)) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.end != null
              ? <HelperText type="error">{errors.end.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGDatePicker
              mode='single'
              value={dayOrNull(dayjs(value))?.toDate()}
              onDateChange={d => onChange(d.date)}
              containerStyle={{ marginBottom: 7 }}
              label={'Data sfarsit'}
            />
          </View>
        )}
        name="end"
      />
    );
  }, [control, errors.end, upsert?.error?.data.code, upsert?.isError]);

  const renderClient = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Client field is required!' },
          validate: (value) => isInt(value.id) && isNotEmpty(value.id),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.client != null
              ? <HelperText type="error">{errors.client.message?.toString()}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGSelect
              title='Alege angajat'
              type='input'
              getter={() => Queries.getClients({ enabled }) as any}
              text={(data: ClientOutDTO) => data?.name ?? value?.name ?? ""}
              data={value}
              onSelect={({ id, name }: ClientOutDTO) => { onChange({ id, name }) }}
              label="Client"
              containerStyle={[{ marginBottom: 7 }]}
            />
          </View>
        )}
        name={`client`}
      />
    );
  }, [control, enabled, errors.client, upsert?.error?.data.code, upsert?.isError]);

  return (
    <ScreenContainer
      loading={(contract.isLoading && params.id != null) || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        <MGCard title={'Detalii contract'}>
          {renderNumber()}
          <MGRow>
            {renderClient()}
            {renderRepresentative()}
          </MGRow>
          <MGRow>
            {renderCost()}
            {renderDetails()}
          </MGRow>
          <MGRow>
            {renderStart()}
            {renderEnd()}
          </MGRow>
          {renderLocation()}
        </MGCard>
        <View>
          {/* {supplierFields.map((_, index) => renderSupplier(index))} */}
          {/* {renderSupplierMultiselect()} */}
        </View>
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
