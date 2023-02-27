import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { isNotEmpty, isString } from 'class-validator';
import { memo, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import MGButton from '../../../components/MGButton';
import MGTextInput from '../../../components/MGTextInput';
import ScreenContainer from '../../../components/ScreenContainer';
import { Mutations } from '../../../requests/Mutations';
import { Screens } from '../../Screens';

export default memo<NativeStackScreenProps<any, string>>(
  function ActivityTemplateUpsertScreen(props) {
    const params: {
      description: string;
      material: string;
      cost: number;
      id: number;
    } = props.route.params ?? {};

    const activity = useMutation(Mutations.upsertActivityTemplate());

    const {
      control,
      handleSubmit,
      formState: { errors, isValid },
      getValues,
    } = useForm<unknown>({
      mode: 'onChange',
      values: {
        id: params.id ?? '',
        description: params.description ?? '',
        material: params.material ?? '',
        cost: params.cost ?? '',
      },
    });

    useEffect(() => {
      if (activity.isSuccess) {
        if (props.navigation.canGoBack()) {
          props.navigation.goBack();
        } else {
          props.navigation.navigate(Screens.APP_ACTIVITY_TEMPLATE_LIST);
        }
      }
    }, [activity.isSuccess, props.navigation]);

    const submit = useCallback(
      ({ id, description, material, cost }: unknown) => {
        if (params.id != null) {
          activity.mutate({ id, description, material, cost });
        } else {
          activity.mutate({ description, material, cost });
        }
      },
      [activity, params.id],
    );

    return (
      <ScreenContainer scrollContainerStyle={[styles.scrollContainer]}>
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
                {activity?.isError ? (
                  <HelperText type="error">
                    Error: {activity?.error?.data.code}
                  </HelperText>
                ) : null}
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
                {activity?.isError ? (
                  <HelperText type="error">
                    Error: {activity?.error?.data.code}
                  </HelperText>
                ) : null}
                <MGTextInput
                  value={value}
                  onChangeText={onChange}
                  style={{ marginBottom: 7 }}
                  placeholder={'Material'}
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
                {errors.cost != null ? (
                  <HelperText type="error">{errors.cost.message}</HelperText>
                ) : null}
                {activity?.isError ? (
                  <HelperText type="error">
                    Error: {activity?.error?.data.code}
                  </HelperText>
                ) : null}
                <MGTextInput
                  value={value}
                  onChangeText={onChange}
                  style={{ marginBottom: 7 }}
                  placeholder={'Cost'}
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
      </ScreenContainer>
    );
  },
);

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
