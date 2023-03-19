import { Page, Text, View, Document, StyleSheet, } from '@react-pdf/renderer';
import * as ReactPDF from '@react-pdf/renderer';
import * as React from 'react';
import { ProjectReportOutDTO } from '../../dtos/report-out.dto';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: '5%'
  },
  table: {
    width: '90%',
    marginHorizontal: '5%',
    borderColor: '#90e5fc',
    borderTopWidth: 1,
  },
  tableHeader: {
    backgroundColor: '#bff0fd',
  },
  row: {
    flexDirection: 'row',
    borderColor: '#90e5fc',
    borderBottomWidth: 1,
  },
  cell: {
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderColor: '#90e5fc',
    borderRightWidth: 1,
  },
  cell1: {
    width: '25%',
    borderColor: '#90e5fc',
    borderLeftWidth: 1,
  },
  cell2: {
    width: '15%',
  },
  cell3: {
    width: '15%',
  },
  cell4: {
    width: '15%',
  },
  cell5: {
    width: '15%',
  },
  cell6: {
    width: '15%',
  },
  test: {
    color: '#000000',
    fontSize: 8
  },
});

type Props = React.PropsWithChildren<{
  report: ProjectReportOutDTO;
}>;

const MonthlyPDF = React.memo<Props>((props) => {
  return (
    <Document>
      <Page orientation='portrait' size="A4" style={styles.page}>
        <View style={styles.table}>
          <View style={[styles.row, styles.tableHeader]}>
            <View style={[styles.cell, styles.cell1]}>
              <Text style={styles.test}>{'Denumire Activitate'}</Text>
            </View>
            <View style={[styles.cell, styles.cell2]}>
              <Text style={styles.test}>{'Materiale'}</Text>
            </View>
            <View style={[styles.cell, styles.cell3]}>
              <Text style={styles.test}>{'Unitati implementate'}</Text>
            </View>
            <View style={[styles.cell, styles.cell4]}>
              <Text style={styles.test}>{'Total Proiect'}</Text>
            </View>
            <View style={[styles.cell, styles.cell5]}>
              <Text style={styles.test}>{'Cost per activitate'}</Text>
            </View>
            <View style={[styles.cell, styles.cell6]}>
              <Text style={styles.test}>{'Cost total'}</Text>
            </View>
          </View>
          {props.report.monthlyActivityReports.map(mar => {
            return (
              <View key={mar.id} style={styles.row}>
                <View style={[styles.cell, styles.cell1]}>
                  <Text style={styles.test}>
                    {mar.monthlyProjectActivity.description}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell2]}>
                  <Text style={styles.test}>
                    {mar.monthlyProjectActivity.material}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell3]}>
                  <Text style={styles.test}>
                    {mar.monthlyNoImplUnits}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell4]}>
                  <Text style={styles.test}>
                    {mar.monthlyProjectActivity.quantity}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell5]}>
                  <Text style={styles.test}>
                    {mar.monthlyProjectActivity.cost}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell6]}>
                  <Text style={styles.test}>
                    {mar.monthlyActivityCost}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  )
});

export const getMonthlyPDF = async (report: ProjectReportOutDTO) => {
  return await ReactPDF.renderToBuffer(<MonthlyPDF report={report} />);
};
