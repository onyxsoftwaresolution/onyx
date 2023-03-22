import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import { ProjectActivityOutDTO } from "@workspace/api/src/modules/project/dtos/project.out.dto";
import { ActivityReportOutDTO, ProjectReportOutDTO } from "@workspace/api/src/modules/report/dtos/report-out.dto";
import { isNotEmpty } from "class-validator";
import dayjs from "dayjs";
import { memo, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Linking, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MGButton from "../../../components/MGButton";
import MGCard from "../../../components/MGCard";
import MGDatePicker from "../../../components/MGDatePicker";
import MGRow from "../../../components/MGRow";
import MGTextInput from "../../../components/MGTextInput";
import ScreenContainer from "../../../components/ScreenContainer";
import { RenderOptionsFunction, useDialog } from "../../../components/hooks/useDialog";
import { useSnackbar } from "../../../components/hooks/useSnackbar";
import { dayOrNull } from "../../../dayOrNull";
import { Mutations } from "../../../requests/mutations";
import { AppTheme } from "../../../theme/type";
import { Report } from "./Report";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { API_URL } from '@env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = PropsWithChildren<NativeStackScreenProps<any, string>> & {
  type: Report;
}

type Params = {
  projectId: number;
  projectReportId?: number;
}

export default memo<Props>(function ReportUpsertScreen(props) {
  const { projectId, projectReportId } = props.route.params as Params;

  const { colors } = useTheme<AppTheme>();
  const dialog = useDialog();
  const snackbar = useSnackbar();

  const [month, setMonth] = useState<string>(dayjs().format('YYYYMM'));

  const isNew = projectReportId == null;

  const report = useMutation(
    Mutations.getReport(
      props.type, isNew, projectId, projectReportId, month,
      {
        onError() { snackbar.show('A aparut o eroare la incarcarea raportului!') },
      }
    ));

  const upsert = useMutation(
    Mutations.upsertReport(
      props.type, projectId, projectReportId,
      {
        onSuccess() { props.navigation.pop() },
        onError() { snackbar.show('A aparut o eroare la salvarea raportului!') }
      }
    ));

  const sendEmail = useMutation(
    Mutations.emailReport(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      props.type, projectId, projectReportId!,
      {
        onSuccess() { props.navigation.pop() },
        onError() { snackbar.show('A aparut o eroare la trimiterea raportului!') }
      }
    ));

  const values: ProjectReportOutDTO = useMemo(() => {
    return ({
      ...(report.data?.data ?? { monthlyActivityReports: [], dailyActivityReports: [] }) as ProjectReportOutDTO,
    })
  }, [report.data?.data]);

  const {
    control,
    handleSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm<ProjectReportOutDTO>({
    mode: 'onChange',
    values,
  });

  const applyComputedDailyActivityReport = useCallback((index: number) => {
    setValue(
      `dailyActivityReports.${index}.totalStock`,
      Number(getValues(`dailyActivityReports.${index}.todayStock`)) + Number(getValues(`dailyActivityReports.${index}.addedStock`))
    );
    setValue(
      `dailyActivityReports.${index}.finalStockToday`,
      Number(getValues(`dailyActivityReports.${index}.totalStock`)) - Number(getValues(`dailyActivityReports.${index}.noImplToday`))
    );
  }, [getValues, setValue])

  const applyComputedMonthlyActivityReport = useCallback((index: number) => {
    setValue(
      `monthlyActivityReports.${index}.monthlyActivityCost`,
      Number(getValues(`monthlyActivityReports.${index}.monthlyNoImplUnits`)) * Number(getValues(`monthlyActivityReports.${index}.monthlyProjectActivity.cost`))
    );
  }, [getValues, setValue]);

  const applyComputedActivityReports = useCallback((projectReport: ProjectReportOutDTO) => {
    for (const index in projectReport.dailyActivityReports) {
      applyComputedDailyActivityReport(index as unknown as number);
    }
    for (const index in projectReport.monthlyActivityReports) {
      applyComputedMonthlyActivityReport(index as unknown as number)
    }
  }, [applyComputedDailyActivityReport, applyComputedMonthlyActivityReport]);

  useEffect(() => {
    (async () => {
      const response = await report.mutateAsync();
      reset(response.data);
      applyComputedActivityReports(response.data)
    })();
    // to run only on month state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const { fields: daily } = useFieldArray({
    control,
    name: "dailyActivityReports",
  });

  const { fields: monthly } = useFieldArray({
    control,
    name: "monthlyActivityReports",
  });

  const submit = useCallback(
    ({ id, ...rest }: ProjectActivityOutDTO) => {
      if (id != null && id > 0) {
        upsert.mutate({ id, ...rest });
      } else {
        upsert.mutate({ ...rest });
      }
    },
    [upsert],
  );

  const renderProjectInfo = useCallback(() => {
    return (
      <MGCard title={report.data?.data.project?.description}>
        <View><Text>{report.data?.data.project?.area}</Text></View>
        <View><Text>{report.data?.data.project?.code}</Text></View>
      </MGCard>
    );
  }, [report.data?.data.project?.area, report.data?.data.project?.code, report.data?.data.project?.description])

  const renderActivityReportTodayStock = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              disabled
              selectTextOnFocus
              value={value.toString()}
              onChangeText={val => {
                onChange(val);
                applyComputedDailyActivityReport(index)
              }}
              style={{ marginBottom: 7 }}
              label={'Stoc azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.todayStock`}
      />
    );
  }, [applyComputedDailyActivityReport, control]);

  const renderActivityReportAddedStock = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedDailyActivityReport(index)
              }}
              style={{ marginBottom: 7 }}
              label={'Cantitate intrare azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.addedStock`}
      />
    );
  }, [applyComputedDailyActivityReport, control]);

  const renderActivityReportTotalStock = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedDailyActivityReport(index)
              }}
              style={{ marginBottom: 7 }}
              label={'Stoc total'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.totalStock`}
      />
    );
  }, [applyComputedDailyActivityReport, control]);

  const renderActivityReportNoImplToday = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedDailyActivityReport(index)
              }}
              style={{ marginBottom: 7 }}
              label={'Realizat azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.noImplToday`}
      />
    );
  }, [applyComputedDailyActivityReport, control]);

  const renderActivityReportFinalStockToday = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              disabled
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedDailyActivityReport(index)
              }}
              style={{ marginBottom: 7 }}
              label={'Stoc ramas'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.finalStockToday`}
      />
    );
  }, [applyComputedDailyActivityReport, control]);

  const renderActivityReportTotalImplToday = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              disabled
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedDailyActivityReport(index)
              }}
              style={{ marginBottom: 7 }}
              label={'Total realizat'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.totalImplToday`}
      />
    );
  }, [applyComputedDailyActivityReport, control]);

  const renderActivityReportTotalProjectUnits = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              disabled
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedDailyActivityReport(index)
              }}
              style={{ marginBottom: 7 }}
              label={'Totalul la nivel de proiect'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.totalProjectUnits`}
      />
    );
  }, [applyComputedDailyActivityReport, control]);

  const renderActivityReportRemainingUnits = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              disabled
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedDailyActivityReport(index)
              }}
              style={{ marginBottom: 7 }}
              label={'Rest de realizat'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.remainingUnits`}
      />
    );
  }, [applyComputedDailyActivityReport, control]);

  const renderDailyActivityReport = useCallback((index: number) => {
    return (
      <View key={index}>
        <MGRow>
          {renderActivityReportTodayStock(index)}
          {renderActivityReportAddedStock(index)}
        </MGRow>
        <MGRow>
          {renderActivityReportTotalStock(index)}
          {renderActivityReportNoImplToday(index)}
        </MGRow>
        <MGRow>
          {renderActivityReportFinalStockToday(index)}
          {renderActivityReportTotalImplToday(index)}
        </MGRow>
        <MGRow>
          {renderActivityReportTotalProjectUnits(index)}
          {renderActivityReportRemainingUnits(index)}
        </MGRow>
      </View>
    );
  }, [renderActivityReportAddedStock, renderActivityReportFinalStockToday, renderActivityReportNoImplToday, renderActivityReportRemainingUnits, renderActivityReportTodayStock, renderActivityReportTotalImplToday, renderActivityReportTotalProjectUnits, renderActivityReportTotalStock]);

  const renderActivityReportMonthlyNoImplUnits = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedMonthlyActivityReport(index);
              }}
              style={{ marginBottom: 7 }}
              label={'Unitati implementate'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyNoImplUnits`}
      />
    );
  }, [applyComputedMonthlyActivityReport, control]);

  const renderActivityReportMonthlyTotalProjectUnits = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              disabled
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedMonthlyActivityReport(index);
              }}
              style={{ marginBottom: 7 }}
              label={'Total la nivel de proiect'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyProjectActivity.quantity`}
      />
    );
  }, [applyComputedMonthlyActivityReport, control]);

  const renderActivityReportActivityCost = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              disabled
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedMonthlyActivityReport(index);
              }}
              style={{ marginBottom: 7 }}
              label={'Cost per activitate'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyProjectActivity.cost`}
      />
    );
  }, [applyComputedMonthlyActivityReport, control]);

  const renderActivityReportMonthlyActivityCost = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              value={value.toString()}
              selectTextOnFocus
              onChangeText={val => {
                onChange(val);
                applyComputedMonthlyActivityReport(index);
              }}
              style={{ marginBottom: 7 }}
              label={'Cost total'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyActivityCost`}
      />
    );
  }, [applyComputedMonthlyActivityReport, control]);

  const renderMonthlyActivityReport = useCallback((index: number) => {
    return (
      <View key={index}>
        <MGRow>
          {renderActivityReportMonthlyNoImplUnits(index)}
          {renderActivityReportMonthlyTotalProjectUnits(index)}
        </MGRow>
        <MGRow>
          {renderActivityReportActivityCost(index)}
          {renderActivityReportMonthlyActivityCost(index)}
        </MGRow>
      </View>
    );
  }, [renderActivityReportActivityCost, renderActivityReportMonthlyActivityCost, renderActivityReportMonthlyNoImplUnits, renderActivityReportMonthlyTotalProjectUnits]);

  const renderActivity = useCallback((report: ActivityReportOutDTO, index: number) => {
    return (
      <View key={index} style={[{ width: '100%', marginTop: 10 }]}>
        <MGCard title={report.dailyProjectActivity?.description ?? report.monthlyProjectActivity?.description}>
          {props.type === Report.DAILY && daily[index] != null && renderDailyActivityReport(index)}
          {props.type === Report.MONTHLY && monthly[index] != null && renderMonthlyActivityReport(index)}
        </MGCard>
      </View>
    );
  }, [daily, monthly, props.type, renderDailyActivityReport, renderMonthlyActivityReport])

  const renderSubmit = useCallback(() => {
    return (
      <>
        <MGButton
          icon="send"
          label={'Salveaza'}
          // @ts-expect-error cdc
          onPress={handleSubmit(submit)}
          style={[{ marginTop: 10, marginHorizontal: 10, flex: 1 }]}
        />
        <MGRow style={[{ marginTop: 10, marginHorizontal: 10 }]}>
          {!isNew
            ? <MGButton
              icon={props => <Icon name="file-pdf" {...props} />}
              label={'Vezi raportul'}
              onPress={() => Linking.openURL(`${API_URL}/v1/view-${props.type}-report/${projectId}/${projectReportId}`)}
              style={[{ flex: 1 }]}
            />
            : null}
          {!isNew
            ? <MGButton
              icon={props => <Icon name="envelope" {...props} />}
              label={'Trimite raportul'}
              onPress={dialog.show}
              style={[{ flex: 1 }]}
            />
            : null}
        </MGRow>
      </>
    );
  }, [dialog.show, handleSubmit, isNew, projectId, projectReportId, props.type, submit])

  const renderSelectMonth = useCallback(() => {
    return (
      <MGCard title={'Alege o luna:'}>
        <MGDatePicker
          mode="single"
          value={dayOrNull(dayjs(month, 'YYYYMM'))?.toDate() ?? dayjs().toDate()}
          renderInputValue={date => dayjs(date).format('MMMM YYYY')}
          onDateChange={date => setMonth(dayjs(date.date).format('YYYYMM'))}
        />
      </MGCard>
    );
  }, [month]);

  const render = useCallback(() => {
    return (
      <>
        <View style={[{ paddingLeft: 10, alignSelf: 'flex-start', paddingTop: 10 }]}>
          <Text style={[{ fontSize: 18 }]}>{'Proiect'}</Text>
        </View>
        {renderProjectInfo()}
        {props.type === Report.MONTHLY && isNew && renderSelectMonth()}
        {<View style={[{ paddingLeft: 10, alignSelf: 'flex-start', paddingTop: 10 }]}>
          <Text style={[{ fontSize: 18 }]}>{'Activitati'}</Text>
        </View>}
        {report.data?.data.dailyActivityReports?.map((report, index) => renderActivity(report, index))}
        {report.data?.data.monthlyActivityReports?.map((report, index) => renderActivity(report, index))}
      </>
    );
  }, [isNew, props.type, renderActivity, renderProjectInfo, renderSelectMonth, report.data?.data.dailyActivityReports, report.data?.data.monthlyActivityReports]);

  const [email, setEmail] = useState('');

  const dialogArg: RenderOptionsFunction<unknown> = useCallback(() => ({
    title: `Trimite mail`,
    message: (
      <View style={[{ flex: 1, width: '100%' }]}>
        <MGTextInput autoComplete="email" value={email} onChangeText={setEmail} style={[{ flex: 1, width: '100%' }]} />
      </View>
    ),
    buttons: [
      {
        label: 'Trimite',
        textColor: colors.danger,
        onPress: () => { sendEmail.mutate(email) },
      },
      () => <View style={{ flex: 1 }} />,
      { label: 'Renunta' },
    ],
  }), [colors.danger, email, sendEmail]);

  return (
    <ScreenContainer
      loading={report.isLoading || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        {render()}
        {renderSubmit()}
        <View style={[{ height: 20 }]} />
        {snackbar.renderSnackbar()}
        {dialog.renderDialog(dialogArg)}
      </View>
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
  list: {
    maxWidth: 500,
    width: '95%',
    marginTop: 21,
  },
  touchStyle: {
    maxWidth: '100%',
  },
  item: {
    maxWidth: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  itemRow: {
    flex: 1,
    flexDirection: 'row',
  },
  itemText: {
    padding: 10,
    paddingBottom: 3,
    fontSize: 18,
  },
  itemSubText: {
    paddingHorizontal: 10,
    fontSize: 16,
    paddingBottom: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
