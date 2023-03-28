import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ProjectOutDTO } from '@workspace/api/src/modules/project/dtos/project.out.dto';
import dayjs from 'dayjs';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  RenderOptionsFunction,
  useDialog,
} from '../../../components/hooks/useDialog';
import ScreenContainer from '../../../components/ScreenContainer';
import { useSnackbar } from '../../../components/hooks/useSnackbar';
import { Mutations } from '../../../requests/mutations';
import { Queries } from '../../../requests/queries';
import { AppTheme } from '../../../theme/type';
import { Screens } from '../../Screens';
import { Report } from '../reports/Report';

type Props = NativeStackScreenProps<any, string> & {
  type: 'project' | Report;
}

export default memo<Props>(function ProjectListScreen({ type, ...props }) {
  type ??= 'project';

  const enabled = useIsFocused();
  const projects = useQuery(Queries.getProjects({
    enabled,
    onError() { snackbar.show('A aparut o eroare la afisarea proiectelor!') },
  }),);
  const deleteProject = useMutation(Mutations.deleteProject({
    onSuccess() { projects.refetch(); },
    onError() { snackbar.show('A aparut o eroare la stergerea proiectului!') },
  }),);

  const { colors } = useTheme<AppTheme>();

  const dialog = useDialog<ProjectOutDTO>();
  const snackbar = useSnackbar();

  const onPress = useCallback(
    (project: ProjectOutDTO) => {
      props.navigation.navigate(Screens.APP_PROJECT_UPSERT, { id: project.id });
    },
    [props.navigation],
  );

  const renderProject = useCallback((project: ProjectOutDTO, index: number) => (
    <View
      style={[styles.touchStyle]}
      key={project.id}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <TouchableRipple
            onPress={() => onPress(project)}
            style={[{ flex: 1 }]}
          >
            <View style={[{ flex: 1 }]}>
              <Text style={[styles.itemText]}>{project.description}</Text>
              <Text style={[styles.itemSubText, { color: colors.error }]}>
                {dayjs(project.start).format('DD/MM/YYYY')} - {dayjs(project.end).format('DD/MM/YYYY')}
              </Text>
              <Text style={[styles.itemSubText, { color: colors.error }]}>
                {project.area}
              </Text>
              <Text style={[styles.itemSubText, { color: colors.error }]}>
                {project.code}
              </Text>
              <View style={[{ marginBottom: 10 }]} />
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => dialog.show(project)}
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
  ), [colors.danger, colors.error, dialog, onPress]);

  const renderProjectForDaily = useCallback((project: ProjectOutDTO, index: number) => (
    <TouchableRipple
      style={[styles.touchStyle]}
      key={project.id}
      onPress={() => { props.navigation.navigate(Screens.APP_DAILY_REPORT__REPORT_LIST_SCREEN, { projectId: project.id, description: project.description }) }}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <View style={[{ flex: 1 }]}>
            <Text style={[styles.itemText]}>{project.description}</Text>
            <Text style={[styles.itemSubText, { color: colors.error }]}>
              {dayjs(project.start).format('DD/MM/YYYY')} - {dayjs(project.end).format('DD/MM/YYYY')}
            </Text>
            <View style={[{ marginBottom: 10 }]} />
          </View>
        </View>
        <Divider />
      </View>
    </TouchableRipple>
  ), [colors.error, props.navigation]);

  const renderProjectForMonthly = useCallback((project: ProjectOutDTO, index: number) => (
    <TouchableRipple
      style={[styles.touchStyle]}
      key={project.id}
      onPress={() => { props.navigation.navigate(Screens.APP_MONTHLY_REPORT__REPORT_LIST_SCREEN, { projectId: project.id, description: project.description }) }}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <View style={[{ flex: 1 }]}>
            <Text style={[styles.itemText]}>{project.description}</Text>
            <Text style={[styles.itemSubText, { color: colors.error }]}>
              {dayjs(project.start).format('DD/MM/YYYY')} - {dayjs(project.end).format('DD/MM/YYYY')}
            </Text>
            <View style={[{ marginBottom: 10 }]} />
          </View>
        </View>
        <Divider />
      </View>
    </TouchableRipple>
  ), [colors.error, props.navigation]);

  const renderListItem = useCallback((project: ProjectOutDTO, index: number) => {
    switch (type) {
      case Report.DAILY:
        return renderProjectForDaily(project, index);

      case Report.MONTHLY:
        return renderProjectForMonthly(project, index);

      case 'project':
        return renderProject(project, index);

      default:
        return null;
    }
  }, [type, renderProjectForDaily, renderProjectForMonthly, renderProject]);

  const dialogRenderOptions: RenderOptionsFunction<ProjectOutDTO> = useCallback((project) => ({
    title: `Sterge proiect '${project?.description}'`,
    message: 'Esti sigur?',
    buttons: [
      {
        label: 'Sterge',
        textColor: colors.danger,
        onPress: () => deleteProject.mutate(project.id),
      },
      () => <View style={{ flex: 1 }} />,
      { label: 'Renunta' },
    ],
  }), [colors.danger, deleteProject]);

  return (
    <ScreenContainer
      loading={projects.isLoading || deleteProject.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      {projects.data?.data.length === 0
        ? <View style={[styles.list]}>
          <Text style={{ textAlign: 'center' }} variant="bodyLarge">
            Nu ai nici un proiect adaugat!
          </Text>
        </View>
        : null}
      <View style={[styles.list]}>
        {projects.data?.data?.map(renderListItem)}
      </View>
      {dialog.renderDialog(dialogRenderOptions)}
      {snackbar.renderSnackbar()}
    </ScreenContainer>
  );
});

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
    paddingHorizontal: 10,
  },
});
