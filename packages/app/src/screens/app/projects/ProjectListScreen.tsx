import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDialog } from '../../../components/dialog/useDialog';
import ScreenContainer from '../../../components/ScreenContainer';
import { Mutations } from '../../../requests/mutations';
import { Queries } from '../../../requests/queries';
import { AppTheme } from '../../../theme/type';
import { Screens } from '../../Screens';

export default memo<NativeStackScreenProps<any, string>>(
  function ProjectListScreen(props) {
    const projects = useQuery(Queries.getProjects());
    const deleteProject = useMutation(
      Mutations.deleteProject({
        onSuccess() {
          projects.refetch();
        },
      }),
    );

    const { colors } = useTheme<AppTheme>();

    const dialog = useDialog();

    useFocusEffect(() => {
      projects.refetch();
    });

    const onPress = useCallback(
      (project) => {
        props.navigation.navigate(Screens.APP_PROJECT_UPSERT, project);
      },
      [props.navigation],
    );

    const renderProjects = useCallback(
      (project, i) => (
        <TouchableRipple
          style={[styles.touchStyle]}
          key={project.id}
          onPress={() => {}}
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
      ),
      [colors.danger, colors.error, colors.inverseSurface, dialog, onPress],
    );

    const dialogRenderOptions = useCallback(
      (project) => ({
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
      }),
      [colors.danger, deleteProject],
    );

    return (
      <ScreenContainer scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.list]}>
          {projects.data?.data?.map(renderProjects)}
        </View>
        {dialog.renderDialog(dialogRenderOptions)}
      </ScreenContainer>
    );
  },
);

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
