import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ReportListItemOutDTO } from '@workspace/api/src/modules/report/dtos/report-out.dto';
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
import { Mutations } from '../../../requests/mutations';
import { Queries } from '../../../requests/queries';
import { AppTheme } from '../../../theme/type';
import { Screens } from '../../Screens';
import { Report } from './Report';

type Props = NativeStackScreenProps<any, string> & {
  type: Report;
}

export default memo<Props>(function ReportListScreen(props) {
  const { projectId, description } = props.route.params as { projectId: number, description: string };

  const enabled = useIsFocused();
  const reports = useQuery(Queries.getReports(props.type, projectId, { enabled }));

  const deleteReport = useMutation(
    Mutations.deleteReport(
      props.type,
      {
        onSuccess() {
          reports.refetch();
        },
      }),
  );

  const { colors } = useTheme<AppTheme>();

  const dialog = useDialog<ReportListItemOutDTO>();

  const onGoToUpsertScreen = useCallback(({ id, date }: ReportListItemOutDTO) => {
    switch (props.type) {
      case Report.DAILY:
        props.navigation.push(Screens.APP_DAILY_REPORT__UPSERT_SCREEN, { projectId, projectReportId: id, date });
        break;
      case Report.MONTHLY:
        props.navigation.push(Screens.APP_MONTHLY_REPORT__UPSERT_SCREEN, { projectId, projectReportId: id, date });
        break;
      default:
        break;
    }
  }, [projectId, props.navigation, props.type]);

  const renderReport = useCallback((report: ReportListItemOutDTO, index: number) => (
    <View
      style={[styles.touchStyle]}
      key={report.id}
    >
      <View style={[styles.item]}>
        <View style={[styles.itemRow]}>
          <TouchableRipple
            style={[{ flex: 1 }]}
            onPress={() => onGoToUpsertScreen(report)}
          >
            <Text style={[styles.itemText]}>{dayjs(report.date).format('YYYY-MM-DD HH:mm')}</Text>
          </TouchableRipple>
          {index == 0
            ? <TouchableRipple
              onPress={() => dialog.show(report)}
              style={[styles.iconContainer]}
            >
              <Icon
                name={'trash-alt'}
                style={[{ color: colors.danger, fontSize: 18 }]}
              />
            </TouchableRipple> : null}
        </View>
        <Divider />
      </View>
    </View>
  ), [colors.danger, dialog, onGoToUpsertScreen]);

  const renderListItem = useCallback((project: ReportListItemOutDTO, index: number) => {
    switch (props.type) {
      case Report.DAILY:
        return renderReport(project, index);

      case Report.MONTHLY:
        return renderReport(project, index);

      default:
        return null;
    }
  }, [props.type, renderReport]);

  const dialogRenderOptions: RenderOptionsFunction<ReportListItemOutDTO> = useCallback((report) => ({
    title: `Sterge report '${dayjs(report?.date).format('YYYY-MM-DD HH:mm')}'`,
    message: 'Esti sigur?',
    buttons: [
      {
        label: 'Sterge',
        textColor: colors.danger,
        onPress: () => deleteReport.mutate(report.id),
      },
      () => <View style={{ flex: 1 }} />,
      { label: 'Renunta' },
    ],
  }), [colors.danger, deleteReport]);

  return (
    <ScreenContainer
      loading={reports.isLoading}
      scrollContainerStyle={[styles.scrollContainer]}
    >
      {reports.data?.data.length === 0
        ? <View style={[styles.list]}>
          <Text style={{ textAlign: 'center' }} variant="bodyLarge">Nu ai nici un raport adaugat!</Text>
        </View>
        : null}
      <View style={[styles.list]}>
        <View style={[{ flexDirection: 'row', paddingBottom: 10 }]}>
          <Text variant='bodyLarge' style={[{ fontWeight: 'bold' }]}>Proiect: </Text>
          <Text variant='bodyLarge'>{description}</Text>
        </View>
        {reports.data?.data?.map(renderListItem)}
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
