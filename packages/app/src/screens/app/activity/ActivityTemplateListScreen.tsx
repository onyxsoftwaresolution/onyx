import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenContainer from '../../../components/ScreenContainer';
import { Queries } from '../../../requests/queries';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Screens } from '../../Screens';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActivityTemplateOutDTO } from '@workspace/api/src/modules/activity-template/dtos/activity-template-out.dto';
import { useIsFocused } from '@react-navigation/native';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { RenderOptionsFunction, useDialog } from '../../../components/hooks/useDialog';
import { AppTheme } from '../../../theme/type';
import { Mutations } from '../../../requests/mutations';

export default memo<NativeStackScreenProps<any, string>>(
  function ActivityTemplateListScreen(props) {
    const snackbar = useSnackbar();

    const enabled = useIsFocused();
    const activities = useQuery(
      Queries.getActivityTemplates({
        enabled,
        onError() { snackbar.show('A aparut o eroare la listarea activitatilor!') },
      })
    );
    const deleteActivity = useMutation(Mutations.deleteActivityTemplate({
      onSuccess() { activities.refetch(); },
      onError() { snackbar.show('A aparut o eroare la stergerea activitatii!') },
    }),);

    const { colors } = useTheme<AppTheme>();
    const dialog = useDialog<ActivityTemplateOutDTO>();

    const onPress = useCallback(
      (activity: ActivityTemplateOutDTO) => {
        props.navigation.navigate(
          Screens.APP_ACTIVITY_TEMPLATE_UPSERT,
          activity,
        );
      },
      [props.navigation],
    );

    const renderActivity = useCallback(
      (activity: ActivityTemplateOutDTO, index: number) => (
        <View
          key={activity.id}
          style={[styles.touchStyle]}
        >
          <View style={[styles.item]}>
            <View style={[styles.itemRow]}>
              <TouchableRipple
                onPress={() => onPress(activity)}
                style={[{ flex: 1 }]}
              >
                <View>
                  <Text style={[styles.itemText]}>{activity.description}</Text>
                  <Text style={[styles.itemSubText, { color: colors.error }]}>
                    {activity.material}
                  </Text>
                  <Text style={[styles.itemSubText, { color: colors.error }]}>
                    {activity.cost}
                  </Text>
                  <View style={[{ marginBottom: 10 }]} />
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => dialog.show(activity)}
                style={[styles.iconContainer]}
              >
                <Icon
                  name={'trash-alt'}
                  style={[{ color: colors.danger, fontSize: 18 }]}
                />
              </TouchableRipple>
            </View>
            <Divider />
          </View>
        </View>
      ),
      [colors.danger, colors.error, dialog, onPress],
    );

    const dialogRenderOptions: RenderOptionsFunction<ActivityTemplateOutDTO> = useCallback((activity) => ({
      title: `Sterge sablon activitate`,
      message: <View>
        <Text>'{activity?.description}' va fi sters!</Text>
        <Text>Esti sigur?</Text>
      </View>,
      buttons: [
        {
          label: 'Sterge',
          textColor: colors.danger,
          onPress: () => deleteActivity.mutate(activity.id),
        },
        () => <View style={{ flex: 1 }} />,
        { label: 'Renunta' },
      ],
    }), [colors.danger, deleteActivity]);

    return (
      <ScreenContainer
        loading={activities.isLoading}
        scrollContainerStyle={[styles.scrollContainer]}
      >
        <View style={[styles.list]}>
          {activities.data?.data?.map(renderActivity)}
        </View>
        {dialog.renderDialog(dialogRenderOptions)}
        {snackbar.renderSnackbar()}
      </ScreenContainer>
    );
  },
);

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
    maxWidth: '100%',
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
    paddingBottom: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});
