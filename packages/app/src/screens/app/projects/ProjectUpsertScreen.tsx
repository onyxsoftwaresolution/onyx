import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ActivityTemplateOutDTO } from '@workspace/api/src/modules/activity-template/dtos/activity-template-out.dto';
import { UpsertProjectDTO } from '@workspace/api/src/modules/project/dtos/project.in.dto';
import { isInt, isNotEmpty, isNumber, isString } from 'class-validator';
import { memo, useCallback, useMemo } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import MGButton from '../../../components/MGButton';
import MGDatePicker from '../../../components/MGDatePicker';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import Select from '../../../components/Select';
import { Mutations } from '../../../requests/Mutations';
import { Queries } from '../../../requests/Queries';
import { EmployeeOutDTO } from "@workspace/api/src/modules/employee/dtos/employee.out.dto"
import { useIsFocused } from '@react-navigation/native';

type Params = {
  id: number;
};

export default memo<NativeStackScreenProps<any, string>>(function ProjectUpsertScreen(props) {
  const params = props.route.params as unknown as Params;

  const enabled = useIsFocused();
  const project = useQuery(Queries.getProject(params.id, { enabled: enabled && params.id != null, onSuccess: () => !isDirty && reset() }));
  const upsert = useMutation(Mutations.upsertProject());

  const values: UpsertProjectDTO = useMemo(() => {
    const data = project.data?.data;
    return ({
      id: data?.id ?? undefined,
      area: data?.area ?? '',
      code: data?.code ?? '',
      description: data?.description ?? '',
      end: data?.end ?? '',
      start: data?.start ?? '',
      projectActivities: data?.projectActivities ?? [],
      localAdmin: data?.localAdmin ?? null,
      areaAdmin: data?.areaAdmin ?? null,
    });
  }, [project.data?.data]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    reset,
  } = useForm<UpsertProjectDTO>({
    mode: 'onChange',
    values,
  });

  const { fields, append } = useFieldArray({
    control,
    name: "projectActivities",
  });

  const submit = useCallback(
    ({ id, ...rest }: UpsertProjectDTO) => {
      console.log({ id, ...rest })
      if (params?.id != null) {
        upsert.mutate({ id, ...rest });
      } else {
        upsert.mutate({ ...rest });
      }
    },
    [params?.id, upsert],
  );

  const renderDescription = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Description field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {errors.description != null
              ? <HelperText type="error">{errors.description.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              multiline
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 7, height: 77 }}
              label={'Description'}
            />
          </>
        )}
        name="description"
      />
    );
  }, [control, errors.description, upsert?.error?.data.code, upsert?.isError]);

  const renderArea = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Area field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {errors.area != null
              ? <HelperText type="error">{errors.area.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              mode='outlined'
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Area'}
            />
          </>
        )}
        name="area"
      />
    );
  }, [control, errors.area, upsert?.error?.data.code, upsert?.isError]);

  const renderCode = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Code field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {errors.code != null
              ? <HelperText type="error">{errors.code.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Code'}
            />
          </>
        )}
        name="code"
      />
    );
  }, [control, errors.code, upsert?.error?.data.code, upsert?.isError]);

  const renderProjectActivityDescription = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Description field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {errors.projectActivities?.[index]?.description != null
              ? <HelperText type="error">{errors.projectActivities?.[index]?.description?.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              multiline
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 7, height: 77 }}
              label={'Description'}
            />
          </>
        )}
        name={`projectActivities.${index}.description`}
      />
    );
  }, [control, errors.projectActivities, upsert?.error?.data.code, upsert?.isError]);

  const renderProjectActivityQuantity = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Quantity field is required!' },
          validate: (value) => isNumber(parseFloat(value.toString())),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {errors.projectActivities?.[index]?.quantity != null
              ? <HelperText type="error">{errors.projectActivities?.[index]?.quantity?.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value.toString()}
              onChangeText={text => onChange(parseFloat(text))}
              style={{ marginBottom: 7 }}
              label={'Quantity'}
            />
          </>
        )}
        name={`projectActivities.${index}.quantity`}
      />
    );
  }, [control, errors.projectActivities, upsert?.error?.data.code, upsert?.isError]);

  const renderProjectActivityMaterial = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Material field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {errors.projectActivities?.[index]?.material != null
              ? <HelperText type="error">{errors.projectActivities?.[index]?.material?.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Material'}
            />
          </>
        )}
        name={`projectActivities.${index}.material`}
      />
    );
  }, [control, errors.projectActivities, upsert?.error?.data.code, upsert?.isError]);

  const renderProjectActivityCost = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Cost field is required!' },
          validate: (value) => isNumber(parseFloat(value.toString())),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {errors.projectActivities?.[index]?.cost != null
              ? <HelperText type="error">{errors.projectActivities?.[index]?.cost?.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value.toString()}
              onChangeText={text => onChange(parseFloat(text))}
              style={{ marginBottom: 7 }}
              label={'Cost'}
            />
          </>
        )}
        name={`projectActivities.${index}.cost`}
      />
    );
  }, [control, errors.projectActivities, upsert?.error?.data.code, upsert?.isError]);

  const renderProjectActivity = useCallback((index: number) => {
    return (
      <View key={index}>
        {renderProjectActivityDescription(index)}
        {renderProjectActivityMaterial(index)}
        {renderProjectActivityCost(index)}
        {renderProjectActivityQuantity(index)}
      </View>
    );
  }, [renderProjectActivityCost, renderProjectActivityDescription, renderProjectActivityMaterial, renderProjectActivityQuantity]);

  const renderLocalAdmin = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Local admin field is required!' },
          validate: (value) => isInt(value.id) && isNotEmpty(value.id),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {errors.localAdmin != null
              ? <HelperText type="error">{errors.localAdmin.message?.toString()}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <Select
              type='input'
              getter={Queries.getEmployees as any}
              text={(data: EmployeeOutDTO) => data?.name ?? value?.name ?? ""}
              data={value}
              onSelect={({ id, name }: EmployeeOutDTO) => { onChange({ id, name }) }}
              label="Local admin"
              containerStyle={[{ marginBottom: 7 }]}
            />
          </>
        )}
        name={`localAdmin`}
      />
    );
  }, [control, errors.localAdmin, upsert?.error?.data.code, upsert?.isError]);

  const renderAreaAdmin = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Area admin field is required!' },
          validate: (value) => isInt(value.id) && isNotEmpty(value.id),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {errors.areaAdmin != null
              ? <HelperText type="error">{errors.areaAdmin.message?.toString()}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <Select
              type='input'
              getter={() => Queries.getEmployees({ enabled }) as any}
              text={(data: EmployeeOutDTO) => data?.name ?? value?.name ?? ""}
              data={value}
              onSelect={({ id, name }: EmployeeOutDTO) => { onChange({ id, name }) }}
              label="Area admin"
              containerStyle={[{ marginBottom: 7 }]}
            />
          </>
        )}
        name={`areaAdmin`}
      />
    );
  }, [control, enabled, errors.areaAdmin, upsert?.error?.data.code, upsert?.isError]);

  return (
    <ScreenContainer
      loading={(project.isLoading && !project.isStale) || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        {renderDescription()}
        {renderArea()}
        {renderCode()}
        <MGDatePicker label={"Start date"} containerStyle={[{ marginBottom: 7 }]} mode="single" />
        <MGDatePicker label={"End date"} containerStyle={[{ marginBottom: 7 }]} mode="single" />
        <View>
          {fields.map((field, index) => renderProjectActivity(index))}
        </View>
        <Select
          getter={() => Queries.getActivityTemplates({ enabled }) as any}
          text={(data: ActivityTemplateOutDTO) => data?.description ?? ''}
          data={undefined}
          onSelect={(data: ActivityTemplateOutDTO) => {
            append({ cost: data.cost, description: data.description, material: data.material, quantity: 0 })
          }}
          label="Add activity"
          containerStyle={[{ marginBottom: 7 }]}
        />
        {renderLocalAdmin()}
        {renderAreaAdmin()}
        <MGButton icon="send" label={'Submit'} onPress={handleSubmit(submit)} />
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
});
