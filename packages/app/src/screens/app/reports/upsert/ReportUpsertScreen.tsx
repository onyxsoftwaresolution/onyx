import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import { ProjectActivityOutDTO } from "@workspace/api/src/modules/project/dtos/project.out.dto";
import { ActivityReportOutDTO, ProjectReportOutDTO } from "@workspace/api/src/modules/report/dtos/report-out.dto";
import dayjs from "dayjs";
import { memo, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MGButton from "../../../../components/MGButton";
import MGCard from "../../../../components/MGCard";
import MGDatePicker from "../../../../components/MGDatePicker";
import MGTextInput from "../../../../components/MGTextInput";
import ScreenContainer from "../../../../components/ScreenContainer";
import { RenderOptionsFunction, useDialog } from "../../../../components/useDialog";
import { useSnackbar } from "../../../../components/useSnackbar";
import { dayOrNull } from "../../../../dayOrNull";
import { Mutations } from "../../../../requests/mutations";
import { AppTheme } from "../../../../theme/type";
import { Report } from "../Report";
import DailyActivityReport from "./DailyActivityReport";
import MonthlyActivityReport from "./MonthlyActivityReport";

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
    setValue,
    reset,
  } = useForm<ProjectReportOutDTO>({
    mode: 'onChange',
    values,
  });

  useEffect(() => {
    (async () => {
      const response = await report.mutateAsync();
      reset(response.data);
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

  const renderActivity = useCallback((report: ActivityReportOutDTO, index: number) => {
    return (
      <View key={index} style={[{ width: '100%', marginTop: 10 }]}>
        <MGCard title={report.dailyProjectActivity?.description ?? report.monthlyProjectActivity?.description}>
          {props.type === Report.DAILY &&
            daily[index] != null &&
            <DailyActivityReport control={control} index={index} report={monthly[index]} setValue={setValue} />}
          {props.type === Report.MONTHLY &&
            monthly[index] != null && <MonthlyActivityReport control={control} index={index} report={monthly[index]} setValue={setValue} />}
        </MGCard>
      </View>
    );
  }, [control, daily, monthly, props.type, setValue])

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
        {!isNew
          ? <MGButton
            icon="mail"
            label={'Trimite raportul prin e-mail'}
            onPress={dialog.show}
            style={[{ marginTop: 10, marginHorizontal: 10, flex: 1 }]}
          />
          : null}
      </>
    );
  }, [dialog.show, handleSubmit, isNew, submit])

  const renderSelectMonth = useCallback(() => {
    return (
      <MGCard title={'Selecteaza luna:'}>
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
        <MGTextInput value={email} onChangeText={setEmail} style={[{ flex: 1, width: '100%' }]} />
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
