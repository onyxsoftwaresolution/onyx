import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenContainer from '../../../components/ScreenContainer';
import { Queries } from '../../../requests/Queries';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Screens } from '../../Screens';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActivityTemplateOutDTO } from '@workspace/api/src/modules/activity-template/dtos/activity-template-out.dto';
import { useIsFocused } from '@react-navigation/native';

export default memo<NativeStackScreenProps<any, string>>(
  function ActivityTemplateListScreen(props) {
    const enabled = useIsFocused();
    const activities = useQuery(Queries.getActivityTemplates({ enabled }));
    const { colors } = useTheme();

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
        <TouchableRipple
          key={activity.id}
          style={[styles.touchStyle]}
          onPress={() => { }}
        >
          <View style={[styles.item]}>
            <View style={[styles.itemRow]}>
              <View style={[{ flex: 1 }]}>
                <Text style={[styles.itemText]}>{activity.description}</Text>
                <Text style={[styles.itemSubText, { color: colors.error }]}>
                  {activity.material}
                </Text>
                <Text style={[styles.itemSubText, { color: colors.error }]}>
                  {activity.cost}
                </Text>
              </View>
              <TouchableWithoutFeedback
                onPress={() => onPress(activity)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'pen'}
                  style={[{ color: colors.inverseSurface, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback>
            </View>
            <Divider />
          </View>
        </TouchableRipple>
      ),
      [colors.error, colors.inverseSurface, onPress],
    );

    // console.log(activities.isLoading, activities.isFetching, activities.isRefetching)

    return (
      <ScreenContainer
        loading={activities.isLoading}
        scrollContainerStyle={[styles.scrollContainer]}
      >
        <View style={[styles.list]}>
          {activities.data?.data?.map(renderActivity)}
        </View>
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
    marginHorizontal: 10,
  },
});
