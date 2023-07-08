import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpsertCostDTO } from '@workspace/api/src/modules/cost/dtos/cost.in.dto';
import { isDate, isDateString, isNotEmpty, isNumber, isNumberString, isString } from 'class-validator';
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
import MGDatePicker from '../../../components/MGDatePicker';
import { dayOrNull } from '../../../dayOrNull';
import dayjs from 'dayjs';

type Params = {
  id: number;
  projectActivityId: number;
};

export default memo<NativeStackScreenProps<any, string>>(function CostUpsertScreen(props) {
  const params = props.route.params as unknown as Params;

  const { colors } = useTheme<AppTheme>();

  const enabled = useIsFocused();
  const cost = useQuery(Queries.getCost(params.id, {
    enabled: enabled && params.id != null,
    onSuccess: data => reset(data.data),
  }));
  const upsert = useMutation(Mutations.upsertCost({
    onSuccess: () => props.navigation.pop(),
    onError: () => snackbar.show(),
  }));

  const snackbar = useSnackbar();

  const values: UpsertCostDTO = useMemo(() => {
    const data = cost.data?.data;
    return ({
      id: data?.id ?? undefined,
      amount: (data?.amount ?? '') as unknown as number,
      projectActivityId: data?.projectActivityId ?? params.projectActivityId ?? undefined,
      date: data?.date ?? '',
      details: data?.details ?? '',
      invoiceNumber: data?.invoiceNumber ?? '',
    });
  }, [cost.data?.data, params.projectActivityId]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm<UpsertCostDTO>({
    mode: 'onChange',
    values,
  });

  const submit = useCallback(
    ({ id, ...rest }: UpsertCostDTO) => {
      if (params?.id != null) {
        upsert.mutate({ id, ...rest });
      } else {
        upsert.mutate({ ...rest });
      }
    },
    [params?.id, upsert],
  );

  const renderInvoiceNumber = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'InvoiceNumber field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.invoiceNumber != null
              ? <HelperText type="error">{errors.invoiceNumber.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Numar factura'}
            />
          </View>
        )}
        name="invoiceNumber"
      />
    );
  }, [control, errors.invoiceNumber, upsert?.error?.data.code, upsert?.isError]);

  const renderAmount = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Amount field is required!' },
          validate: (value) => (isNumber(value) || isNumberString(value)) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.amount != null
              ? <HelperText type="error">{errors.amount.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value?.toString()}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Suma'}
            />
          </View>
        )}
        name="amount"
      />
    );
  }, [control, errors.amount, upsert?.error?.data.code, upsert?.isError]);

  const renderDate = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Date field is required!' },
          validate: (value) => (isDate(value) || isDateString(value)) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.date != null
              ? <HelperText type="error">{errors.date.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGDatePicker
              mode='single'
              value={dayOrNull(dayjs(value))?.toDate()}
              onDateChange={d => onChange(d.date)}
              containerStyle={{ marginBottom: 7 }}
              label={'Data'}
            />
          </View>
        )}
        name="date"
      />
    );
  }, [control, errors.date, upsert?.error?.data.code, upsert?.isError]);

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
              multiline
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7, height: 77 }}
              label={'Detalii'}
            />
          </View>
        )}
        name="details"
      />
    );
  }, [control, errors.details, upsert?.error?.data.code, upsert?.isError]);

  return (
    <ScreenContainer
      loading={(cost.isLoading && params.id != null) || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        <MGCard>
          <View style={[{ height: 20 }]} />
          <MGRow>
            {renderInvoiceNumber()}
          </MGRow>
          <MGRow>
            {renderAmount()}
            {renderDate()}
          </MGRow>
          <MGRow>
            {renderDetails()}
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
