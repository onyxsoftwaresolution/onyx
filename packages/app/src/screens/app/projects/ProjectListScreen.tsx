import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ProjectOutDTO } from '@workspace/api/src/modules/project/dtos/project.out.dto';
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
  type: 'project' | 'daily' | 'monthly' | 'site';
}

export default memo<Props>(function ProjectListScreen({ type, ...props }) {
  type ??= 'project';

  const projects = useQuery(Queries.getProjects());
  const deleteProject = useMutation(
    Mutations.deleteProject({
      onSuccess() {
        projects.refetch();
      },
    }),
  );

  const { colors } = useTheme<AppTheme>();

  const dialog = useDialog<ProjectOutDTO>();

  useFocusEffect(() => {
    projects.refetch();
  });

  const onPress = useCallback(
    (project: ProjectOutDTO) => {
      props.navigation.navigate(Screens.APP_PROJECT_UPSERT, project);
    },
    [props.navigation],
  );

  const renderProject = useCallback((project: ProjectOutDTO, index: number) => (
    <TouchableRipple
      style={[styles.touchStyle]}
      key={project.id}
      onPress={() => { }}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <View style={[{ flex: 1 }]}>
            <Text style={[styles.itemText]}>{project.description}</Text>
            <Text style={[styles.itemSubText, { color: colors.error }]}>
              {project.area}
            </Text>
            <Text style={[styles.itemSubText, { color: colors.error }]}>
              {project.code}
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => dialog.show(project)}
            containerStyle={[styles.iconContainer]}
          >
            <Icon
              name={'trash-alt'}
              style={[{ color: colors.danger, fontSize: 18 }]}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => onPress(project)}
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
  ), [colors.danger, colors.error, colors.inverseSurface, dialog, onPress]);

  const renderProjectForDaily = useCallback((project: ProjectOutDTO, index: number) => (
    <TouchableRipple
      style={[styles.touchStyle]}
      key={project.id}
      onPress={() => { props.navigation.navigate(Screens.APP_DAILY_REPORT__REPORT_LIST_SCREEN, { projectId: project.id }) }}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <View style={[{ flex: 1 }]}>
            <Text style={[styles.itemText]}>{project.description}</Text>
            {/* <Text style={[styles.itemSubText, { color: colors.error }]}>
              {project.area}
            </Text>
            <Text style={[styles.itemSubText, { color: colors.error }]}>
              {project.code}
            </Text> */}
          </View>
          {/* <TouchableWithoutFeedback
                onPress={() => dialog.show(project)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'trash-alt'}
                  style={[{ color: colors.danger, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => onPress(project)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'pen'}
                  style={[{ color: colors.inverseSurface, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback> */}
        </View>
        <Divider />
      </View>
    </TouchableRipple>
  ), [props.navigation]);

  const renderProjectForMonthly = useCallback((project: ProjectOutDTO, index: number) => (
    <TouchableRipple
      style={[styles.touchStyle]}
      key={project.id}
      onPress={() => { props.navigation.navigate(Screens.APP_MONTHLY_REPORT__REPORT_LIST_SCREEN, { projectId: project.id }) }}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <View style={[{ flex: 1 }]}>
            <Text style={[styles.itemText]}>{project.description}</Text>
            {/* <Text style={[styles.itemSubText, { color: colors.error }]}>
              {project.area}
            </Text>
            <Text style={[styles.itemSubText, { color: colors.error }]}>
              {project.code}
            </Text> */}
          </View>
          {/* <TouchableWithoutFeedback
                onPress={() => dialog.show(project)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'trash-alt'}
                  style={[{ color: colors.danger, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => onPress(project)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'pen'}
                  style={[{ color: colors.inverseSurface, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback> */}
        </View>
        <Divider />
      </View>
    </TouchableRipple>
  ), [props.navigation]);

  const renderProjectForSite = useCallback((project: ProjectOutDTO, index: number) => (
    <TouchableRipple
      style={[styles.touchStyle]}
      key={project.id}
      onPress={() => { props.navigation.navigate(Screens.APP_SITE_REPORT__REPORT_LIST_SCREEN, { projectId: project.id }) }}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <View style={[{ flex: 1 }]}>
            <Text style={[styles.itemText]}>{project.description}</Text>
            {/* <Text style={[styles.itemSubText, { color: colors.error }]}>
              {project.area}
            </Text>
            <Text style={[styles.itemSubText, { color: colors.error }]}>
              {project.code}
            </Text> */}
          </View>
          {/* <TouchableWithoutFeedback
                onPress={() => dialog.show(project)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'trash-alt'}
                  style={[{ color: colors.danger, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => onPress(project)}
                containerStyle={[styles.iconContainer]}
              >
                <Icon
                  name={'pen'}
                  style={[{ color: colors.inverseSurface, fontSize: 18 }]}
                />
              </TouchableWithoutFeedback> */}
        </View>
        <Divider />
      </View>
    </TouchableRipple>
  ), [props.navigation]);

  const renderListItem = useCallback((project: ProjectOutDTO, index: number) => {
    switch (type) {
      case 'daily':
        return renderProjectForDaily(project, index);

      case 'monthly':
        return renderProjectForMonthly(project, index);

      case 'project':
        return renderProject(project, index);

      case 'site':
        return renderProjectForSite(project, index);
      default:
        return null;
    }
  }, [type, renderProjectForDaily, renderProjectForMonthly, renderProject, renderProjectForSite]);

  const dialogRenderOptions: RenderOptionsFunction<ProjectOutDTO> = useCallback((project) => ({
    title: `Delete project '${project?.description}'`,
    message: 'Are you sure?',
    buttons: [
      {
        label: 'Delete',
        textColor: colors.danger,
        onPress: () => deleteProject.mutate(project.id),
      },
      () => <View style={{ flex: 1 }} />,
      { label: 'Cancel' },
    ],
  }), [colors.danger, deleteProject]);

  return (
    <ScreenContainer
      loading={projects.isLoading || deleteProject.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      <View style={[styles.list]}>
        {projects.data?.data?.map(renderListItem)}
      </View>
      {dialog.renderDialog(dialogRenderOptions)}
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
