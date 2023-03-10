import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import { memo, useEffect } from "react";
import { Mutations } from "../../../requests/Mutations";
import { StyleSheet } from "react-native";
import ScreenContainer from "../../../components/ScreenContainer";

export default memo<NativeStackScreenProps<any, string>>(function DailyReportUpsertScreen(props) {
  const { projectId } = props.route.params as { projectId: number };

  const upsert = useMutation(Mutations.createReport(projectId));

  useEffect(() => {
    upsert.mutate({});
  }, []);

  return (
    <ScreenContainer scrollContainerStyle={[styles.scrollContainer]}>
      { }
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
