import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProjectActivityOutDTO } from "@workspace/api/src/modules/project/dtos/project.out.dto";
import { ActivityReportOutDTO } from "@workspace/api/src/modules/report/dtos/report-out.dto";
import { isNotEmpty } from "class-validator";
import { memo, PropsWithChildren, useCallback, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import MGCard from "../../../components/MGCard";
import MGRow from "../../../components/MGRow";
import MGTextInput from "../../../components/MGTextInput";
import ScreenContainer from "../../../components/ScreenContainer";
import { Mutations } from "../../../requests/Mutations";
import { Queries } from "../../../requests/Queries";
import { Report } from "./Report";

type Props = PropsWithChildren<NativeStackScreenProps<any, string>> & {
  type: Report;
}

type FormState = {
  activityReports: (ActivityReportOutDTO & {
    projectActivityId: number;
  })[]
}

export default memo<Props>(function ReportUpsertScreen(props) {
  const { projectId } = props.route.params as { projectId: number };

  const enabled = useIsFocused();
  const project = useQuery(Queries.getProject(projectId, { enabled }));
  const upsert = useMutation(Mutations.createReport(props.type, projectId));

  const values: FormState = useMemo(() => {
    const activityReports = (project.data?.data.projectActivities ?? []).map(activity => ({
      projectActivityId: activity.id,
      todayStock: 0,
      addedStock: 0,
      totalStock: 0,
      noImplToday: 0,
      finalStockToday: 0,
      totalImplToday: 0,
      totalProjectUnits: 0,
      remainingUnits: 0,
    } as FormState['activityReports'][0]));
    return ({ activityReports });
  }, [project.data?.data.projectActivities]);

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

  const { fields } = useFieldArray({
    control,
    name: "activityReports",
  });

  const renderProjectInfo = useCallback(() => {
    return (
      <MGCard title={project.data?.data.description}>
        <View><Text>{project.data?.data.area}</Text></View>
        <View><Text>{project.data?.data.code}</Text></View>
      </MGCard>
    );
  }, [project.data?.data.area, project.data?.data.code, project.data?.data.description])


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
        name={`activityReports.${index}.todayStock`}
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
        name={`activityReports.${index}.addedStock`}
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
              value={value.toString()}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Stoc total'}
            />
          </>
        )}
        name={`activityReports.${index}.totalStock`}
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
        name={`activityReports.${index}.noImplToday`}
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
        name={`activityReports.${index}.finalStockToday`}
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
        name={`activityReports.${index}.totalImplToday`}
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
        name={`activityReports.${index}.totalProjectUnits`}
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
        name={`activityReports.${index}.remainingUnits`}
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

  const renderMonthlyActivityReport = useCallback((report: ActivityReportOutDTO, index: number) => {
    return (
      <View key={index}>

      </View>
    );
  }, []);

  const renderActivity = useCallback((activity: ProjectActivityOutDTO, index: number) => {
    return (
      <View key={index} style={[{ width: '100%', marginTop: 10 }]}>
        <MGCard title={activity.description}>
          {props.type === Report.DAILY &&
            fields[index] != null &&
            renderDailyActivityReport(fields[index], index)}
          {props.type === Report.MONTHLY &&
            fields[index] != null &&
            renderMonthlyActivityReport(fields[index], index)}
        </MGCard>
      </View>
    );
  }, [fields, props.type, renderDailyActivityReport, renderMonthlyActivityReport])

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
        {project.data?.data?.projectActivities.map((activity, index) => renderActivity(activity, index))}
      </>
    );
  }, [project.data?.data?.projectActivities, renderActivity, renderProjectInfo]);

  return (
    <ScreenContainer
      loading={project.isLoading || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      {render()}
      <View style={[{ height: 20 }]} />
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
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
