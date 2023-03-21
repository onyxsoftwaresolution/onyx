import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { ActivityTemplateOutDTO } from '@workspace/api/src/modules/activity-template/dtos/activity-template-out.dto';
import { isNotEmpty, isString } from 'class-validator';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import MGButton from '../../../components/MGButton';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { Screens } from '../../Screens';

type Params = {
  description: string;
  material: string;
  cost: number;
  id: number;
}

export default memo<NativeStackScreenProps<any, string>>(
  function ActivityTemplateUpsertScreen(props) {
    const params = (props.route.params ?? {}) as Params;

    const snackbar = useSnackbar();

    const upsert = useMutation(
      Mutations.upsertActivityTemplate({
        onSuccess: () => props.navigation.pop(),
        onError() { snackbar.show('A aparut o eroare la salvarea activitatii!') },
      })
    );

    const upserErrors = useMemo(() => Mutations.getMutationError(upsert.error), [upsert.error]);

    console.log(upserErrors);

    const {
      control,
      handleSubmit,
      formState: { errors, isValid },
      getValues,
    } = useForm<Partial<ActivityTemplateOutDTO>>({
      mode: 'onChange',
      values: {
        id: params.id ?? '',
        description: params.description ?? '',
        material: params.material ?? '',
        cost: params.cost ?? '',
      },
    });

    useEffect(() => {
      if (upsert.isSuccess) {
        if (props.navigation.canGoBack()) {
          props.navigation.goBack();
        } else {
          props.navigation.navigate(Screens.APP_ACTIVITY_TEMPLATE_LIST);
        }
      }
    }, [upsert.isSuccess, props.navigation]);

    const submit = useCallback(
      ({ id, description, material, cost }: Partial<ActivityTemplateOutDTO>) => {
        if (params.id != null) {
          upsert.mutate({ id, description, material, cost });
        } else {
          upsert.mutate({ description, material, cost });
        }
      },
      [upsert, params.id],
    );

    return (
      <ScreenContainer loading={upsert.isLoading} scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.view]}>
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
              <>
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
              </>
            )}
            name="description"
          />
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
              <>
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
              </>
            )}
            name="material"
          />
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
              <>
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
              </>
            )}
            name="cost"
          />
          <MGButton
            icon="send"
            label={'Submit'}
            onPress={handleSubmit(submit)}
          />
        </View>
        {snackbar.renderSnackbar()}
      </ScreenContainer>
    );
  },
);

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
