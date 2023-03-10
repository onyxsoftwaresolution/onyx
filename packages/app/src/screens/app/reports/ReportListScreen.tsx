import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ReportListItemOutDTO } from '@workspace/api/src/modules/report/dtos/report-out.dto';
import dayjs from 'dayjs';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  RenderOptionsFunction,
  useDialog,
} from '../../../components/dialog/useDialog';
import ScreenContainer from '../../../components/ScreenContainer';
import { Mutations } from '../../../requests/Mutations';
import { Queries } from '../../../requests/Queries';
import { AppTheme } from '../../../theme/type';
import { Screens } from '../../Screens';

type Props = NativeStackScreenProps<any, string> & {
  type: 'daily' | 'monthly' | 'site';
}

export default memo<Props>(function ReportListScreen(props) {
  const { projectId } = props.route.params as { projectId: number };

  const reports = useQuery(Queries.getReports(props.type, projectId));

  // const deleteProject = useMutation(
  //   Mutations.deleteProject({
  //     onSuccess() {
  //       reports.refetch();
  //     },
  //   }),
  // );

  const { colors } = useTheme<AppTheme>();

  const dialog = useDialog<ReportListItemOutDTO>();

  useFocusEffect(() => {
    reports.refetch();
  });

  const onPress = useCallback((project: ReportListItemOutDTO) => {
    props.navigation.navigate(Screens.APP_PROJECT_UPSERT, project);
  }, [props.navigation]);

  const renderReport = useCallback((report: ReportListItemOutDTO, index: number) => (
    <TouchableRipple
      style={[styles.touchStyle]}
      key={report.id}
      onPress={() => { }}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <View style={[{ flex: 1 }]}>
            <Text style={[styles.itemText]}>{dayjs(report.date).format('YYYY-MM-DD HH:mm')}</Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => dialog.show(report)}
            containerStyle={[styles.iconContainer]}
          >
            <Icon
              name={'trash-alt'}
              style={[{ color: colors.danger, fontSize: 18 }]}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => onPress(report)}
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
  ), [colors.danger, colors.inverseSurface, dialog, onPress]);

  const renderListItem = useCallback((project: ReportListItemOutDTO, index: number) => {
    switch (props.type) {
      case 'daily':
        return renderReport(project, index);

      case 'monthly':
        return renderReport(project, index);

      case 'site':
        return renderReport(project, index);

      default:
        return null;
    }
  }, [props.type, renderReport]);

  // const dialogRenderOptions: RenderOptionsFunction<ReportListItemOutDTO> = useCallback((project) => ({
  //   title: `Delete project '${project?.description}'`,
  //   message: 'Are you sure?',
  //   buttons: [
  //     {
  //       label: 'Delete',
  //       textColor: colors.danger,
  //       onPress: () => deleteProject.mutate(project.id),
  //     },
  //     () => <View style={{ flex: 1 }} />,
  //     { label: 'Cancel' },
  //   ],
  // }), [colors.danger, deleteProject]);

  return (
    <ScreenContainer
      loading={reports.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.list]}>
        {reports.data?.data?.map(renderListItem)}
      </View>
      {/* {dialog.renderDialog(dialogRenderOptions)} */}
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
  },
  list: {
    maxWidth: 300,
    width: '80%',
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
