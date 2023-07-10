import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ProjectActivityOutDTO, ProjectActivityQueryParams } from '@workspace/api/src/modules/project/dtos/project.out.dto';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, HelperText, Text, TouchableRipple, useTheme } from 'react-native-paper';
import ScreenContainer from '../../../components/ScreenContainer';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Queries } from '../../../requests/queries';
import { AppTheme } from '../../../theme/type';
import { Screens } from '../../Screens';

type Props = NativeStackScreenProps<any, string> & {
  type: 'cost';
}

const getQuerySearchParams = (type: Props['type']) => {
  switch (type) {
    case 'cost':
      return {
        costs: true,
        "activityTemplate.supplier": true,
        "activityTemplate.product": true,
      } as ProjectActivityQueryParams;

    default:
      return {};
  }
}

export default memo<Props>(function ProjectActivityListScreen({ type, ...props }) {
  type ??= 'cost';

  const { projectId, description } = props.route.params as { projectId: number, description: string };

  const snackbar = useSnackbar();

  const enabled = useIsFocused();
  const activities = useQuery(
    Queries.getProjectActivities(projectId,
      getQuerySearchParams(type),
      {
        enabled,
        onError() { snackbar.show('A aparut o eroare la listarea activitatilor!') },
      })
  );

  const { colors } = useTheme<AppTheme>();

  const renderCostActivity = useCallback(
    (activity: ProjectActivityOutDTO, index: number) => (
      <View
        key={activity.id}
        style={[styles.touchStyle]}
      >
        <View style={[styles.item]}>
          <View style={[styles.itemRow]}>
            <TouchableRipple
              onPress={() => props.navigation.navigate(Screens.APP_COST_LIST, { activityId: activity.id })}
              style={[{ flex: 1 }]}
            >
              <View>
                <Text style={[styles.parentText]}>
                  <HelperText style={[styles.helperText]} variant='bodySmall' type='info'>Nume activitate: </HelperText>
                  <Text variant='bodyLarge' style={[styles.itemText]}>{activity.description}</Text>
                </Text>
                <Text style={[styles.parentText]}>
                  <HelperText style={[styles.helperText]} type='info'>Furnizor: </HelperText>
                  <Text variant='bodyLarge' style={[styles.itemSubText, { color: colors.error }]}>
                    {activity.activityTemplate.supplier?.name}
                  </Text>
                </Text>
                <Text style={[styles.parentText]}>
                  <HelperText style={[styles.helperText]} type='info'>Produs: </HelperText>
                  <Text variant='bodyLarge' style={[styles.itemSubText, { color: colors.error }]}>
                    {activity.activityTemplate.product?.name}
                  </Text>
                </Text>
                <Text style={[styles.parentText]}>
                  <HelperText style={[styles.helperText]} type='info'>Cost activitate: </HelperText>
                  <Text variant='bodyLarge' style={[styles.itemSubText, { color: colors.error }]}>
                    {activity.cost}
                  </Text>
                </Text>
                <Text style={[styles.parentText]}>
                  <HelperText style={[styles.helperText]} type='info'>Total costuri: </HelperText>
                  <Text variant='bodyLarge' style={[styles.itemSubText, { color: colors.error }]}>
                    {activity.costs?.reduce((p, n) => p + n.amount, 0)}
                  </Text>
                </Text>
                <View style={[{ marginBottom: 10 }]} />
              </View>
            </TouchableRipple>
          </View>
          <Divider />
        </View>
      </View>
    ),
    [colors.error, props.navigation],
  );

  const renderListItem = useCallback((activity: ProjectActivityOutDTO, index: number) => {
    switch (type) {
      case 'cost':
        return renderCostActivity(activity, index);

      default:
        return null;
    }
  }, [type, renderCostActivity]);

  return (
    <ScreenContainer
      loading={activities.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      {activities.data?.data.length === 0
        ? <View style={[styles.list]}>
          <Text style={{ textAlign: 'center' }} variant="bodyLarge">
            Nu ai nici o activitate adaugata!
          </Text>
        </View>
        : null}
      <View style={[styles.list]}>
        {activities.data?.data?.map(renderListItem)}
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
  parentText: {
    display: 'flex',
    flexDirection: 'row',
  },
  helperText: {
    width: 130,
    display: 'flex',
  },
  itemText: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 3,
  },
  itemSubText: {
    paddingHorizontal: 10,
    // paddingBottom: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});
