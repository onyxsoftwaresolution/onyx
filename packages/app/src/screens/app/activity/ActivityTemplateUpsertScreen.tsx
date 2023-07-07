import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpsertActivityTemplateDTO } from '@workspace/api/src/modules/activity-template/dtos/activity-template-in.dto';
import { isNotEmpty, isString } from 'class-validator';
import { memo, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import MGButton from '../../../components/MGButton';
import MGCard from '../../../components/MGCard';
import MGRow from '../../../components/MGRow';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { Queries } from '../../../requests/queries';

type Params = {
  id: number;
}

export default memo<NativeStackScreenProps<any, string>>(function ActivityTemplateUpsertScreen(props) {
  const params = (props.route.params ?? {}) as Params;

  const enabled = useIsFocused();
  const supplier = useQuery(Queries.getActivityTemplate(params.id, {
    enabled: enabled && params.id != null,
    onSuccess: data => reset(data.data),
  }));
  const upsert = useMutation(Mutations.upsertActivityTemplate({
    onSuccess: () => props.navigation.pop(),
    onError() { snackbar.show('A aparut o eroare la salvarea activitatii!') },
  }));

  const snackbar = useSnackbar();

  const upserErrors = useMemo(() => Mutations.getMutationError(upsert.error), [upsert.error]);

  const values: UpsertActivityTemplateDTO = useMemo(() => {
    const data = supplier.data?.data;
    return ({
      id: data?.id ?? undefined,
      description: data?.description ?? '',
      material: data?.material ?? '',
      cost: (data?.cost ?? '') as unknown as number,
      supplierId: data?.supplier ?? '',
      productId: data?.product ?? '',
    });
  }, [supplier.data?.data]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
    reset,
  } = useForm<UpsertActivityTemplateDTO>({
    mode: 'onChange',
    values,
  });

  const submit = useCallback(
    ({ id, ...rest }: UpsertActivityTemplateDTO) => {
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
          required: {
            value: true,
            message: 'required message',
          },
          validate: (value) => {
            return isString(value) && isNotEmpty(value);
          },
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.description != null ? (
              <HelperText type="error">
                {errors.description.message}
              </HelperText>
            ) : null}
            {upserErrors?.['description']?.at(0) ? (
              <HelperText type="error">
                Error: {upserErrors?.['description']?.at(0)}
              </HelperText>
            ) : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Descriere'}
            />
          </View>
        )}
        name="description"
      />
    );
  }, [control, errors.description, upserErrors]);

  const renderMaterial = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'required message',
          },
          validate: (value) => {
            return isString(value) && isNotEmpty(value);
          },
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.material != null ? (
              <HelperText type="error">
                {errors.material.message}
              </HelperText>
            ) : null}
            {upserErrors?.['material']?.at(0) ? (
              <HelperText type="error">
                Error: {upserErrors?.['material']?.at(0)}
              </HelperText>
            ) : null}
            <MGTextInput
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Material'}
            />
          </View>
        )}
        name="material"
      />
    );
  }, [control, errors.material, upserErrors]);

  const renderCost = useCallback(() => {
    return (
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'required message',
          },
          validate: (value) => {
            return isString(value) && isNotEmpty(value);
          },
        }}
        render={({ field: { onChange, value } }) => (
          <View style={[{ flex: 1 }]}>
            {errors.cost != null && (
              <HelperText type="error">{errors.cost.message}</HelperText>
            )}
            {upserErrors?.['cost']?.at(0) && (
              <HelperText type="error">
                Error: {upserErrors?.['cost']?.at(0)}
              </HelperText>
            )}
            <MGTextInput
              value={value?.toString()}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Cost'}
              keyboardType="numeric"
            />
          </View>
        )}
        name="cost"
      />
    );
  }, [control, errors.cost, upserErrors]);

  return (
    <ScreenContainer loading={upsert.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
      <View style={[styles.view]}>
        <MGCard title="Detalii activitate">
          {renderDescription()}
          <MGRow>
            {renderMaterial()}
            {renderCost()}
          </MGRow>
          <MGRow>
          </MGRow>
        </MGCard>
        <MGButton
          icon="send"
          label={'Submit'}
          onPress={handleSubmit(submit)}
          style={[{ marginTop: 10, marginHorizontal: 10 }]}
        />
      </View>
      {snackbar.renderSnackbar()}
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
