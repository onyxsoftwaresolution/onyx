import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProjectActivityOutDTO } from "@workspace/api/src/modules/project/dtos/project.out.dto";
import { ActivityReportOutDTO, ProjectReportOutDTO } from "@workspace/api/src/modules/report/dtos/report-out.dto";
import { isNotEmpty } from "class-validator";
import { memo, PropsWithChildren, useCallback, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import MGButton from "../../../components/MGButton";
import MGCard from "../../../components/MGCard";
import MGRow from "../../../components/MGRow";
import MGTextInput from "../../../components/MGTextInput";
import ScreenContainer from "../../../components/ScreenContainer";
import { useSnackbar } from "../../../components/useSnackbar";
import { Mutations } from "../../../requests/Mutations";
import { Queries } from "../../../requests/Queries";
import { Report } from "./Report";

type Props = PropsWithChildren<NativeStackScreenProps<any, string>> & {
  type: Report;
}

type Params = {
  projectId: number;
  projectReportId?: number;
}

export default memo<Props>(function ReportUpsertScreen(props) {
  const { projectId, projectReportId } = props.route.params as Params;

  const snackbar = useSnackbar();

  const enabled = useIsFocused();
  const report = useQuery(
    Queries.getReport(
      props.type, projectId, projectReportId,
      {
        enabled,
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

  // @ts-expect-error cdc
  const values: ProjectReportOutDTO = useMemo(() => {
    return report.data?.data ?? {}
  }, [report.data?.data]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm<typeof values>({
    mode: 'onChange',
    values,
  });

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
              value={value.toString()}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Stoc azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.todayStock`}
      />
    );
  }, [control]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Cantitate intrare azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.addedStock`}
      />
    );
  }, [control]);

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
              disabled
              value={value.toString()}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Stoc total'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.totalStock`}
      />
    );
  }, [control]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Realizat azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.noImplToday`}
      />
    );
  }, [control]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Stoc ramas'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.finalStockToday`}
      />
    );
  }, [control]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Total realizat la azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.totalImplToday`}
      />
    );
  }, [control]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Totalul la nivel de proiect'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.totalProjectUnits`}
      />
    );
  }, [control]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Rest de realizat'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.remainingUnits`}
      />
    );
  }, [control]);

  const renderDailyActivityReport = useCallback((report: ActivityReportOutDTO, index: number) => {
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
  }, [renderActivityReportAddedStock, renderActivityReportNoImplToday, renderActivityReportFinalStockToday, renderActivityReportTodayStock, renderActivityReportTotalProjectUnits, renderActivityReportRemainingUnits, renderActivityReportTotalImplToday, renderActivityReportTotalStock]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Unitati implementate'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyNoImplUnits`}
      />
    );
  }, [control]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Total la nivel de proiect'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyProjectActivity.quantity`}
      />
    );
  }, [control]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Cost per activitate'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyProjectActivity.cost`}
      />
    );
  }, [control]);

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
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Cost total'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyActivityCost`}
      />
    );
  }, [control]);

  const renderMonthlyActivityReport = useCallback((report: ActivityReportOutDTO, index: number) => {
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
          {props.type === Report.DAILY &&
            daily[index] != null &&
            renderDailyActivityReport(daily[index], index)}
          {props.type === Report.MONTHLY &&
            monthly[index] != null &&
            renderMonthlyActivityReport(monthly[index], index)}
        </MGCard>
      </View>
    );
  }, [daily, monthly, props.type, renderDailyActivityReport, renderMonthlyActivityReport])

  const render = useCallback(() => {
    return (
      <>
        <View style={[{ paddingLeft: 10, alignSelf: 'flex-start', paddingTop: 10 }]}>
          <Text style={[{ fontSize: 18 }]}>{'Proiect'}</Text>
        </View>
        {renderProjectInfo()}
        <View style={[{ paddingLeft: 10, alignSelf: 'flex-start', paddingTop: 10 }]}>
          <Text style={[{ fontSize: 18 }]}>{'Activitati'}</Text>
        </View>
        {report.data?.data.dailyActivityReports?.map((report, index) => renderActivity(report, index))}
        {report.data?.data.monthlyActivityReports?.map((report, index) => renderActivity(report, index))}
      </>
    );
  }, [renderActivity, renderProjectInfo, report.data?.data.dailyActivityReports, report.data?.data.monthlyActivityReports]);

  return (
    <ScreenContainer
      loading={report.isLoading || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        {render()}
        <MGButton
          icon="send"
          label={'Salveaza'}
          // @ts-expect-error cdc
          onPress={handleSubmit(submit)}
          style={[{ marginTop: 10, marginHorizontal: 10, flex: 1 }]}
        />
        <View style={[{ height: 20 }]} />
        {snackbar.renderSnackbar()}
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
