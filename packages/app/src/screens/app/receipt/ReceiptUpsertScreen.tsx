import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpsertReceiptDTO } from '@workspace/api/src/modules/receipt/dtos/receipt.in.dto';
import { isDate, isDateString, isInt, isNotEmpty, isNumber, isString } from 'class-validator';
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
import MGSelect from '../../../components/MGSelect';
import { InvoiceOutDTO } from '@workspace/api/src/modules/invoice/dtos/invoice.out.dto';
import MGDatePicker from '../../../components/MGDatePicker';
import { dayOrNull } from '../../../dayOrNull';
import dayjs from 'dayjs';
import { getInvoiceNumberFormatter } from '../invoice/getInvoiceNumberFormatter';

type Params = {
  id: number;
  projectId: number;
};

export default memo<NativeStackScreenProps<any, string>>(function ReceiptUpsertScreen(props) {
  const params = props.route.params as unknown as Params;

  const { colors } = useTheme<AppTheme>();

  const enabled = useIsFocused();
  const receipt = useQuery(Queries.getReceipt(params.id, {
    enabled: enabled && params.id != null,
    onSuccess: data => reset(data.data),
  }));
  const upsert = useMutation(Mutations.upsertReceipt({
    onSuccess: () => props.navigation.pop(),
    onError: () => snackbar.show(),
  }));

  const snackbar = useSnackbar();

  const values: UpsertReceiptDTO = useMemo(() => {
    const data = receipt.data?.data;
    return ({
      id: data?.id ?? undefined,
      invoice: data?.invoice ?? undefined,
      amount: (data?.amount ?? '') as unknown as number,
      date: data?.date ?? '',
      type: data?.type ?? '',
    });
  }, [receipt.data?.data]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm<UpsertReceiptDTO>({
    mode: 'onChange',
    values,
  });

  const submit = useCallback(
    ({ id, ...rest }: UpsertReceiptDTO) => {
      if (params?.id != null) {
        upsert.mutate({ id, ...rest });
      } else {
        upsert.mutate({ ...rest });
      }
    },
    [params?.id, upsert],
  );

  const renderInvoice = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Invoice field is required!' },
          validate: (value) => isInt(value.id) && isNotEmpty(value.id),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.invoice != null
              ? <HelperText type="error">{errors.invoice.message?.toString()}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGSelect
              title='Alege factura'
              type='input'
              getter={() => Queries.getInvoices(params.projectId, { enabled }) as any}
              text={(data: InvoiceOutDTO) => getInvoiceNumberFormatter(data?.number ?? value?.number) ?? ""}
              data={value}
              onSelect={({ id, number }: InvoiceOutDTO) => { onChange({ id, number }) }}
              label="Factura"
              containerStyle={[{ marginBottom: 7 }]}
            />
          </View>
        )}
        name="invoice"
      />
    );
  }, [control, enabled, errors.invoice, params.projectId, upsert?.error?.data.code, upsert?.isError]);

  const renderAmount = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Amount field is required!' },
          validate: (value) => isNumber(parseFloat(value.toString())),
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
          required: { value: true, message: 'Start field is required!' },
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

  const renderType = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Type field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.type != null
              ? <HelperText type="error">{errors.type.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Metoda de plata'}
            />
          </View>
        )}
        name="type"
      />
    );
  }, [control, errors.type, upsert?.error?.data.code, upsert?.isError]);

  return (
    <ScreenContainer
      loading={(receipt.isLoading && params.id != null) || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        <MGCard>
          <View style={[{ height: 20 }]} />
          {renderInvoice()}
          <MGRow>
            {renderAmount()}
            {renderDate()}
          </MGRow>
          {renderType()}
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
