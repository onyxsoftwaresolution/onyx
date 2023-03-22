import { ProjectReportOutDTO } from "@modules/report/dtos/report-out.dto";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import 'dayjs/locale/ro';
dayjs.locale('ro');
import React, { memo, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  report: ProjectReportOutDTO;
}>;

const styles = StyleSheet.create({
  table: {
    borderColor: '#90e5fc',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    borderColor: '#90e5fc',
    // borderBottomWidth: 1,
  },
  cell: {
    padding: 3,
  },
  cell1: {
    width: 80,
    borderColor: '#90e5fc',
    borderRightWidth: 1,
    textAlign: 'right',
  },
  cell2: {},
  text: {
    color: '#000000',
    fontSize: 8
  },
  bold: {
    fontWeight: 'bold',
  }
});

export default memo<Props>(function Header(props) {
  const start = dayjs(props.report.project.start).format('DD.MM.YYYY');
  const end = dayjs(props.report.project.end).format('DD.MM.YYYY');
  const dailyDate = dayjs(props.report.date).format('DD.MM.YYYY HH:mm');
  const monthlyDate = dayjs(props.report.date).format('MMMM YYYY');
  const type = props.report.dailyActivityReports != null ? 'zilnic' : 'lunar';
  const date = type === 'zilnic' ? dailyDate : monthlyDate;
  return (
    <View style={styles.table}>
      <View style={styles.row}>
        <View style={[styles.cell, styles.cell1]}>
          <Text style={[styles.text, styles.bold]}>raport {type}</Text>
        </View>
        <View style={[styles.cell, styles.cell2]}>
          <Text style={[styles.text]}>{date}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.cell, styles.cell1]}>
          <Text style={[styles.text, styles.bold]}>proiect</Text>
        </View>
        <View style={[styles.cell, styles.cell2]}>
          <Text style={[styles.text]}>{props.report.project.description}</Text>
        </View>
      </View>
      <View style={[styles.row]}>
        <View style={[styles.cell, styles.cell1]}>
          <Text style={[styles.text, styles.bold]}>perioada</Text>
        </View>
        <View style={[styles.cell, styles.cell2]}>
          <Text style={[styles.text]}>{`${start} - ${end}`}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.cell, styles.cell1]}>
          <Text style={[styles.text, styles.bold]}>arie</Text>
        </View>
        <View style={[styles.cell, styles.cell2]}>
          <Text style={[styles.text]}>{props.report.project.area}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.cell, styles.cell1]}>
          <Text style={[styles.text, styles.bold]}>cod</Text>
        </View>
        <View style={[styles.cell, styles.cell2]}>
          <Text style={[styles.text]}>{props.report.project.code}</Text>
        </View>
      </View>
      <View style={[styles.row]}>
        <View style={[styles.cell, styles.cell1]}>
          <Text style={[styles.text, styles.bold]}>Sef de santier</Text>
        </View>
        <View style={[styles.cell, styles.cell2]}>
          <Text style={[styles.text]}>{props.report.project.localAdmin.name}</Text>
        </View>
      </View>
      <View style={[styles.row, { borderWidth: 0 }]}>
        <View style={[styles.cell, styles.cell1]}>
          <Text style={[styles.text, styles.bold]}>Sef punct de lucru</Text>
        </View>
        <View style={[styles.cell, styles.cell2]}>
          <Text style={[styles.text]}>{props.report.project.areaAdmin.name}</Text>
        </View>
      </View>
    </View>
  );
});
