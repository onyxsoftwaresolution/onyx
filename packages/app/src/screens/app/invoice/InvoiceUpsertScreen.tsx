import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpsertInvoiceDTO } from '@workspace/api/src/modules/invoice/dtos/invoice.in.dto';
import { isDate, isDateString, isNotEmpty } from 'class-validator';
import dayjs from 'dayjs';
import { ReactNode, memo, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MGButton from '../../../components/MGButton';
import MGCard from '../../../components/MGCard';
import MGDatePicker from '../../../components/MGDatePicker';
import MGRow from '../../../components/MGRow';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { dayOrNull } from '../../../dayOrNull';
import { Mutations } from '../../../requests/mutations';
import { Queries } from '../../../requests/queries';
import { AppTheme } from '../../../theme/type';
import { getInvoiceNumberFormatter } from './getInvoiceNumberFormatter';
import ListItem from '../../../components/MGListItem';
import { getHumanReadableDate } from '../../../getHumanReadableDate';
import MGDataTable from '../../../components/MGDataTable';
import { ProjectActivityOutDTO } from '@workspace/api/src/modules/project/dtos/project.out.dto';

type Params = {
  id: number;
  projectId: number,
};

export default memo<NativeStackScreenProps<any, string>>(function InvoiceUpsertScreen(props) {
  const params = props.route.params as unknown as Params;

  const { colors } = useTheme<AppTheme>();

  const enabled = useIsFocused();
  const invoice = useQuery(Queries.getInvoice(params.id, ["project.contract.client", "project.projectActivities.activityTemplate.product"], {
    enabled: enabled && params.id != null,
    onSuccess: data => reset(data.data),
  }));
  const project = useQuery(Queries.getProject(params.projectId, {
    enabled: enabled && params.id == null && params.projectId != null,
    // onSuccess: data => reset(data.data),
  }));
  const someProject = invoice.data?.data?.project ?? project.data?.data;
  const upsert = useMutation(Mutations.upsertInvoice({
    onSuccess: () => props.navigation.pop(),
    onError: () => snackbar.show(),
  }));

  const snackbar = useSnackbar();

  const values: UpsertInvoiceDTO = useMemo(() => {
    const data = invoice.data?.data;
    return ({
      id: data?.id ?? undefined,
      number: data?.number ?? '',
      issueDate: (data?.issueDate ?? '') as unknown as Date,
      dueDate: (data?.dueDate ?? '') as unknown as Date,
      projectId: (data?.projectId ?? params?.projectId ?? undefined) as unknown as number,
    });
  }, [invoice.data?.data, params?.projectId]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm<UpsertInvoiceDTO>({
    mode: 'onChange',
    values,
  });

  const submit = useCallback(
    ({ id, ...rest }: UpsertInvoiceDTO) => {
      if (params?.id != null) {
        upsert.mutate({ id, ...rest });
      } else {
        upsert.mutate({ ...rest });
      }
    },
    [params?.id, upsert],
  );

  const renderProject = useCallback(() => {
    return (
      <MGCard title={`Contract: ${someProject?.description}`}>
        <MGRow>
          <ListItem
            rows={[
              { label: 'Activ:', value: someProject?.available ? 'da' : 'nu' },
              { label: 'Area:', value: someProject?.area },
              { label: 'Code:', value: someProject?.code },
            ]}
            labelWidth={100}
            direction='column'
            type='input'
          />
          <ListItem
            rows={[
              { label: 'Data inceput:', value: getHumanReadableDate(someProject?.start) },
              { label: 'Data sfarsit:', value: getHumanReadableDate(someProject?.end) },
            ]}
            labelWidth={100}
            direction='column'
            type='input'
          />
        </MGRow>
      </MGCard>
    );
  }, [someProject]);

  const renderContract = useCallback(() => {
    return (
      <MGCard title={`Contract: ${someProject?.contract?.number}`}>
        <MGRow>
          <ListItem
            rows={[
              { label: 'Activ:', value: someProject?.contract?.active ? 'da' : 'nu' },
              { label: 'Locatie:', value: someProject?.contract?.location },
              { label: 'Data inceput:', value: getHumanReadableDate(someProject?.contract?.start) },
              { label: 'Data sfarsit:', value: getHumanReadableDate(someProject?.contract?.end) },
            ]}
            labelWidth={100}
            direction='column'
            type='input'
          />
          <ListItem
            rows={[
              { label: 'Reprezentativ:', value: someProject?.contract?.representative },
              { label: 'Detalii:', value: someProject?.contract?.details },
              { label: 'Cost:', value: someProject?.contract?.cost },
            ]}
            labelWidth={100}
            direction='column'
            type='input'
          />
        </MGRow>
      </MGCard>
    );
  }, [someProject]);

  const renderClient = useCallback(() => {
    return (
      <MGCard title={`Client: ${someProject?.contract?.client?.name}`}>
        <MGRow>
          <ListItem
            rows={[
              { label: 'CIF:', value: someProject?.contract?.client?.cif },
              { label: 'RC:', value: someProject?.contract?.client?.rc },
              { label: 'Bank:', value: someProject?.contract?.client?.bankName },
              { label: 'IBAN:', value: someProject?.contract?.client?.bankIban },
            ]}
            labelWidth={100}
            direction='column'
            type='input'
          />
          <ListItem
            rows={[
              { label: 'Adresa client:', value: someProject?.contract?.client?.address },
              { label: 'Email:', value: someProject?.contract?.client?.email },
              { label: 'Phone number:', value: someProject?.contract?.client?.phoneNumber },
            ]}
            labelWidth={100}
            direction='column'
            type='input'
          />
        </MGRow>
      </MGCard>
    );
  }, [someProject]);

  const renderProduct = useCallback(() => {
    const rows: ReactNode[][] = someProject?.projectActivities?.map((pa?: ProjectActivityOutDTO) => [
      pa?.description,
      pa?.activityTemplate?.product?.name,
      pa?.quantity,
      pa?.cost,
      (pa?.quantity ?? 0) * (pa?.cost ?? 0),
    ]);
    rows?.push([
      '', '', '', 'Total', rows?.reduce((p, n) => p + (n.at(4) as number), 0)
    ]);

    return (
      <MGCard>
        <MGDataTable
          headers={['Activitate', 'Produs', 'Cantitate', 'Pret', 'Total']}
          rows={rows}
        />
      </MGCard>
    );
  }, [someProject?.projectActivities]);

  const renderNumber = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: false,
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
              disabled
              value={getInvoiceNumberFormatter(value)}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Numar factura'}
            />
          </View>
        )}
        name="number"
      />
    );
  }, [control, errors.number, upsert?.error?.data.code, upsert?.isError]);

  const renderIssueDate = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'IssueDate field is required!' },
          validate: (value) => (isDate(value) || isDateString(value)) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.issueDate != null
              ? <HelperText type="error">{errors.issueDate.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGDatePicker
              mode='single'
              value={dayOrNull(dayjs(value))?.toDate()}
              onDateChange={d => onChange(d.date)}
              containerStyle={{ marginBottom: 7 }}
              label={'Data emitere'}
            />
          </View>
        )}
        name="issueDate"
      />
    );
  }, [control, errors.issueDate, upsert?.error?.data.code, upsert?.isError]);

  const renderDueDate = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'DueDate field is required!' },
          validate: (value) => (isDate(value) || isDateString(value)) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.dueDate != null
              ? <HelperText type="error">{errors.dueDate.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGDatePicker
              mode='single'
              value={dayOrNull(dayjs(value))?.toDate()}
              onDateChange={d => onChange(d.date)}
              containerStyle={{ marginBottom: 7 }}
              label={'Data scadenta'}
            />
          </View>
        )}
        name="dueDate"
      />
    );
  }, [control, errors.dueDate, upsert?.error?.data.code, upsert?.isError]);

  return (
    <ScreenContainer
      loading={(invoice.isLoading && params.id != null) || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        {renderProject()}
        {renderContract()}
        {renderClient()}
        {renderProduct()}
        <MGCard>
          <View style={[{ height: 20 }]} />
          {renderNumber()}
          <MGRow>
            {renderIssueDate()}
            {renderDueDate()}
          </MGRow>
        </MGCard>
        {params.id == null
          ? <MGButton
            icon="send"
            label={'Salveaza'}
            onPress={handleSubmit(submit)}
            style={[{ marginTop: 10, marginHorizontal: 10 }]}
          /> : null}
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
