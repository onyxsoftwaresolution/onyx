import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import * as ReactPDF from '@react-pdf/renderer';
import * as React from 'react';
import { ProjectReportOutDTO } from '../dtos/report-out.dto';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  section: {
    margin: 10,
    padding: 10,
    width: '20%',
    backgroundColor: '#fff',
  },
  test: {
    color: '#000',
  },
});

type Props = React.PropsWithChildren<{
  report: ProjectReportOutDTO;
}>;

const DailyPDF = React.memo<Props>(() => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          {[1, 2, 3, 4, 5].map((m) => (
            <View key={m} style={styles.section}>
              <Text style={styles.test}>Section #{m}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
});

const MonthlyPDF = React.memo<Props>(() => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          {[1, 2, 3, 4, 5].map((m) => (
            <View key={m} style={styles.section}>
              <Text style={styles.test}>Section #{m}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
});

export const getDailyPDF = async (report: ProjectReportOutDTO) => {
  return await ReactPDF.renderToBuffer(<DailyPDF report={report} />);
};

export const getMonthlyPDF = async (report: ProjectReportOutDTO) => {
  return await ReactPDF.renderToBuffer(<MonthlyPDF report={report} />);
};
