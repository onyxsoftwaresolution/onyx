import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProjectActivityOutDTO } from "@workspace/api/src/modules/project/dtos/project.out.dto";
import { ActivityReportOutDTO } from "@workspace/api/src/modules/report/dtos/report-out.dto";
import { isNotEmpty } from "class-validator";
import { memo, PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
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
      prevStock: 0,
      addedStock: 0,
      totalStock: 0,
      doneTodayStock: 0,
      nextStock: 0,
      totalDoneStock: 0,
      projectStock: 0,
      remainingStock: 0,
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
      <View style={[{ width: '100%', marginTop: 10 }]}>
        <Card style={[{ marginHorizontal: 10, flex: 1 }]}>
          <Card.Title title={project.data?.data.description} />
          <Card.Content>
            <View><Text>{project.data?.data.area}</Text></View>
            <View><Text>{project.data?.data.code}</Text></View>
          </Card.Content>
        </Card>
      </View>
    );
  }, [project.data?.data.area, project.data?.data.code, project.data?.data.description])


  const renderActivityReportPrevStock = useCallback((index: number) => {
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
              label={'Stoc azi'}
            />
          </>
        )}
        name={`activityReports.${index}.prevStock`}
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

  const renderActivityReportDoneTodayStock = useCallback((index: number) => {
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
        name={`activityReports.${index}.doneTodayStock`}
      />
    );
  }, [control]);

  const renderActivityReportNextStock = useCallback((index: number) => {
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
              label={'Stoc ramas'}
            />
          </>
        )}
        name={`activityReports.${index}.nextStock`}
      />
    );
  }, [control]);

  const renderActivityReportTotalDoneStock = useCallback((index: number) => {
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
              label={'Total realizat la azi'}
            />
          </>
        )}
        name={`activityReports.${index}.totalDoneStock`}
      />
    );
  }, [control]);

  const renderActivityReportProjectStock = useCallback((index: number) => {
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
              label={'Totalul la nivel de proiect'}
            />
          </>
        )}
        name={`activityReports.${index}.projectStock`}
      />
    );
  }, [control]);

  const renderActivityReportRemainingStock = useCallback((index: number) => {
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
              label={'Rest de realizat'}
            />
          </>
        )}
        name={`activityReports.${index}.remainingStock`}
      />
    );
  }, [control]);

  const renderDailyActivityReport = useCallback((report: ActivityReportOutDTO, index: number) => {
    return (
      <View key={index}>
        {renderActivityReportPrevStock(index)}
        {renderActivityReportAddedStock(index)}
        {renderActivityReportTotalStock(index)}
        {renderActivityReportDoneTodayStock(index)}
        {renderActivityReportNextStock(index)}
        {renderActivityReportTotalDoneStock(index)}
        {renderActivityReportProjectStock(index)}
        {renderActivityReportRemainingStock(index)}
      </View>
    );
  }, [renderActivityReportAddedStock, renderActivityReportDoneTodayStock, renderActivityReportNextStock, renderActivityReportPrevStock, renderActivityReportProjectStock, renderActivityReportRemainingStock, renderActivityReportTotalDoneStock, renderActivityReportTotalStock]);

  const renderMonthlyActivityReport = useCallback((report: ActivityReportOutDTO, index: number) => {
    return (
      <View key={index}>

      </View>
    );
  }, []);

  const renderActivity = useCallback((activity: ProjectActivityOutDTO, index: number) => {
    return (
      <View key={index} style={[{ width: '100%', marginTop: 10 }]}>
        <Card style={[{ marginHorizontal: 10, flex: 1 }]}>
          <Card.Title title={activity.description} />
          <Card.Content>
            {props.type === Report.DAILY &&
              fields[index] != null &&
              renderDailyActivityReport(fields[index], index)}
            {props.type === Report.MONTHLY &&
              fields[index] != null &&
              renderMonthlyActivityReport(fields[index], index)}
          </Card.Content>
        </Card>
      </View>
    );
  }, [fields, props.type, renderDailyActivityReport, renderMonthlyActivityReport])

  const render = useCallback(() => {
    return (
      <>
        <View style={[{ paddingLeft: 10, alignSelf: 'flex-start', paddingTop: 10 }]}>
          <Text style={[{ fontSize: 18 }]}>{'Project'}</Text>
        </View>
        {renderProjectInfo()}
        <View style={[{ paddingLeft: 10, alignSelf: 'flex-start', paddingTop: 10 }]}>
          <Text style={[{ fontSize: 18 }]}>{'Activities'}</Text>
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
