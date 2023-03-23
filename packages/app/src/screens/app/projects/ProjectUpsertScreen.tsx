import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ActivityTemplateOutDTO } from '@workspace/api/src/modules/activity-template/dtos/activity-template-out.dto';
import { UpsertProjectDTO } from '@workspace/api/src/modules/project/dtos/project.in.dto';
import { isDate, isDateString, isInt, isNotEmpty, isNumber, isString } from 'class-validator';
import { memo, useCallback, useMemo } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText, Text, TouchableRipple, useTheme } from 'react-native-paper';
import MGButton from '../../../components/MGButton';
import MGDatePicker from '../../../components/MGDatePicker';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import MGSelect from '../../../components/MGSelect';
import { Mutations } from '../../../requests/mutations';
import { Queries } from '../../../requests/queries';
import { EmployeeOutDTO } from "@workspace/api/src/modules/employee/dtos/employee.out.dto"
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import { dayOrNull } from '../../../dayOrNull';
import MGCard from '../../../components/MGCard';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import MGRow from '../../../components/MGRow';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AppTheme } from '../../../theme/type';

type Params = {
  id: number;
};

export default memo<NativeStackScreenProps<any, string>>(function ProjectUpsertScreen(props) {
  const params = props.route.params as unknown as Params;

  const { colors } = useTheme<AppTheme>();

  const enabled = useIsFocused();
  const project = useQuery(Queries.getProject(params.id, {
    enabled: enabled && params.id != null,
    onSuccess: data => reset(data.data),
  }));
  const upsert = useMutation(Mutations.upsertProject({
    onSuccess: () => props.navigation.pop(),
    onError: () => snackbar.show(),
  }));

  const snackbar = useSnackbar();

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projectActivities",
  });

  const submit = useCallback(
    ({ id, ...rest }: UpsertProjectDTO) => {
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
          <View style={[{ flex: 1 }]}>
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
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7, height: 77 }}
              label={'Nume proiect'}
            />
          </View>
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
          <View style={[{ flex: 1 }]}>
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
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Aria'}
            />
          </View>
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
          <View style={[{ flex: 1 }]}>
            {errors.code != null
              ? <HelperText type="error">{errors.code.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              error={!!errors.code}
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Cod'}
            />
          </View>
        )}
        name="code"
      />
    );
  }, [control, errors.code, upsert?.error?.data.code, upsert?.isError]);

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

  const renderProjectActivityDescription = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Description field is required!' },
          validate: (value) => isString(value) && isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
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
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7, height: 77 }}
              label={'Nume activitate'}
            />
          </View>
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
          <View style={[{ flex: 1 }]}>
            {errors.projectActivities?.[index]?.quantity != null
              ? <HelperText type="error">{errors.projectActivities?.[index]?.quantity?.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value.toString()}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Quantity'}
            />
          </View>
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
          <View style={[{ flex: 1 }]}>
            {errors.projectActivities?.[index]?.material != null
              ? <HelperText type="error">{errors.projectActivities?.[index]?.material?.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Material'}
            />
          </View>
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
          <View style={[{ flex: 1 }]}>
            {errors.projectActivities?.[index]?.cost != null
              ? <HelperText type="error">{errors.projectActivities?.[index]?.cost?.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value.toString()}
              onChangeText={text => onChange(parseFloat(text))}
              containerStyle={[{ justifyContent: 'flex-end' }]}
              style={{ marginBottom: 7 }}
              label={'Cost'}
            />
          </View>
        )}
        name={`projectActivities.${index}.cost`}
      />
    );
  }, [control, errors.projectActivities, upsert?.error?.data.code, upsert?.isError]);

  const renderActivityCardTitle = useCallback((index: number) => {
    return (
      <View style={[{ flexDirection: 'row', width: '100%' }]}>
        <Text style={[{ flex: 1, alignItems: 'center', display: 'flex' }]}>{`Activitate ${index + 1}`}</Text>
        {params.id == null
          ? <TouchableRipple onPress={() => { remove(index) }}>
            <Icon style={[{ padding: 10, color: colors.danger }]} name='trash-alt' />
          </TouchableRipple>
          : null}
      </View>
    );
  }, [colors.danger, params.id, remove]);

  const renderProjectActivity = useCallback((index: number) => {
    return (
      <MGCard key={`${index}-${fields[index].id}`} title={renderActivityCardTitle(index)}>
        {renderProjectActivityDescription(index)}
        <MGRow>
          {renderProjectActivityMaterial(index)}
          {renderProjectActivityCost(index)}
          {renderProjectActivityQuantity(index)}
        </MGRow>
      </MGCard>
    );
  }, [fields, renderActivityCardTitle, renderProjectActivityCost, renderProjectActivityDescription, renderProjectActivityMaterial, renderProjectActivityQuantity]);

  const renderLocalAdmin = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Local admin field is required!' },
          validate: (value) => isInt(value.id) && isNotEmpty(value.id),
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.localAdmin != null
              ? <HelperText type="error">{errors.localAdmin.message?.toString()}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGSelect
              title='Alege angajat'
              type='input'
              getter={Queries.getEmployees as any}
              text={(data: EmployeeOutDTO) => data?.name ?? value?.name ?? ""}
              data={value}
              onSelect={({ id, name }: EmployeeOutDTO) => { onChange({ id, name }) }}
              label="Sef de santier"
              containerStyle={[{ marginBottom: 7 }]}
            />
          </View>
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
          <View style={[{ flex: 1 }]}>
            {errors.areaAdmin != null
              ? <HelperText type="error">{errors.areaAdmin.message?.toString()}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGSelect
              title='Alege angajat'
              type='input'
              getter={() => Queries.getEmployees({ enabled }) as any}
              text={(data: EmployeeOutDTO) => data?.name ?? value?.name ?? ""}
              data={value}
              onSelect={({ id, name }: EmployeeOutDTO) => { onChange({ id, name }) }}
              label="Sef punct de lucru"
              containerStyle={[{ marginBottom: 7 }]}
            />
          </View>
        )}
        name={`areaAdmin`}
      />
    );
  }, [control, enabled, errors.areaAdmin, upsert?.error?.data.code, upsert?.isError]);

  return (
    <ScreenContainer
      loading={(project.isLoading && params.id != null) || upsert.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.view]}>
        <MGCard title={'Detalii proiect'}>
          {renderDescription()}
          <MGRow>
            {renderArea()}
            {renderCode()}
          </MGRow>
          <MGRow>
            {renderStart()}
            {renderEnd()}
          </MGRow>
        </MGCard>
        <View>
          {fields.map((_, index) => renderProjectActivity(index))}
          <MGSelect
            title='Alege activitate'
            getter={() => Queries.getActivityTemplates({ enabled }) as any}
            text={(data: ActivityTemplateOutDTO) => data?.description ?? ''}
            data={undefined}
            onSelect={(data: ActivityTemplateOutDTO) => {
              append({ cost: data.cost, description: data.description, material: data.material, quantity: 0 })
            }}
            label="Adauga activitate"
            containerStyle={[{ marginTop: 10, marginHorizontal: 10 }]}
          />
        </View>
        <MGCard title={`Angajati`}>
          <MGRow>
            {renderLocalAdmin()}
            {renderAreaAdmin()}
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
