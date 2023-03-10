import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import { memo, PropsWithChildren, useEffect } from "react";
import { StyleSheet } from "react-native";
import ScreenContainer from "../../../components/ScreenContainer";
import { Mutations } from "../../../requests/Mutations";
import { Report } from "./Report";

type Props = PropsWithChildren<NativeStackScreenProps<any, string>> & {
  type: Report;
}

export default memo<Props>(function ReportUpsertScreen(props) {
  const { projectId } = props.route.params as { projectId: number };

  const upsert = useMutation(Mutations.createReport(props.type, projectId));

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
    marginHorizontal: 10,
  },
});
