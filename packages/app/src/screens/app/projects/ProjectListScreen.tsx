import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ScreenContainer from '../../../components/ScreenContainer';
import { Queries } from '../../../requests/queries';
import { Screens } from '../../Screens';

export default memo<NativeStackScreenProps<any, string>>(
  function ProjectListScreen(props) {
    const projects = useQuery(Queries.getProjects());
    const { colors } = useTheme();

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
      [colors.error, colors.inverseSurface, onPress],
    );

    return (
      <ScreenContainer scrollContainerStyle={[styles.scrollContainer]}>
        <View style={[styles.list]}>
          {projects.data?.data?.map(renderProjects)}
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
    flexDirection: 'row',
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
