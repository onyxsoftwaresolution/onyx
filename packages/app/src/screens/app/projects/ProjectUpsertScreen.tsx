import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpsertProjectDTO } from '@workspace/api/src/modules/project/dtos/project.in.dto';
import { isNotEmpty, isString } from 'class-validator';
import { Fragment, memo, useCallback, useMemo } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { StyleSheet, View, Text } from 'react-native';
import { HelperText } from 'react-native-paper';
import MGButton from '../../../components/MGButton';
import MGDatePicker from '../../../components/MGDatePicker';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import { Mutations } from '../../../requests/Mutations';
import { Queries } from '../../../requests/Queries';

type Params = {
  id: number;
};

export default memo<NativeStackScreenProps<any, string>>(function ProjectUpsertScreen(props) {
  const params = props.route.params as unknown as Params;

  const project = useQuery(Queries.getProject(params?.id, { onSuccess: () => !isDirty && reset() }));
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
    });
  }, [project.data?.data]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    reset,
  } = useForm<UpsertProjectDTO>({
    mode: 'onChange',
    values,
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
          <>
            {errors.description != null
              ? <HelperText type="error">{errors.description.message}</HelperText>
              : null}
            {upsert?.isError
              ? <HelperText type="error">{upsert?.error?.data.code}</HelperText>
              : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              placeholder={'Description'}
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
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              placeholder={'Area'}
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
              placeholder={'Code'}
            />
          </>
        )}
        name="code"
      />
    );
  }, [control, errors.code, upsert?.error?.data.code, upsert?.isError]);

  return (
    <ScreenContainer scrollContainerStyle={[styles.scrollContainer]}>
      <View style={[styles.view]}>
        {renderDescription()}
        {renderArea()}
        {renderCode()}
        <MGDatePicker mode="single" />
        {/* <MGButton icon="send" label={'Submit'} onPress={handleSubmit(submit)} /> */}
      </View>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
  },
  view: {
    maxWidth: 300,
    width: '80%',
    marginTop: 21,
  },
});
