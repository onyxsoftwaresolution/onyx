import { Page, Text, View, Document, StyleSheet, } from '@react-pdf/renderer';
import * as ReactPDF from '@react-pdf/renderer';
import * as React from 'react';
import { ProjectReportOutDTO } from '../../dtos/report-out.dto';
import Header from './header';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: '5%'
  },
  container: {
    width: '100%',
  },
  table: {
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
  text: {
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
        <View style={styles.container}>
          <Header report={props.report} />
          <View style={styles.table}>
            <View style={[styles.row, styles.tableHeader]}>
              <View style={[styles.cell, styles.cell1]}>
                <Text style={styles.text}>{'Denumire Activitate'}</Text>
              </View>
              <View style={[styles.cell, styles.cell2]}>
                <Text style={styles.text}>{'Materiale'}</Text>
              </View>
              <View style={[styles.cell, styles.cell3]}>
                <Text style={styles.text}>{'Unitati implementate'}</Text>
              </View>
              <View style={[styles.cell, styles.cell4]}>
                <Text style={styles.text}>{'Total Proiect'}</Text>
              </View>
              <View style={[styles.cell, styles.cell5]}>
                <Text style={styles.text}>{'Cost per activitate'}</Text>
              </View>
              <View style={[styles.cell, styles.cell6]}>
                <Text style={styles.text}>{'Cost total'}</Text>
              </View>
            </View>
            {props.report.monthlyActivityReports.map(mar => {
              return (
                <View key={mar.id} style={styles.row}>
                  <View style={[styles.cell, styles.cell1]}>
                    <Text style={styles.text}>
                      {mar.monthlyProjectActivity.description}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.cell2]}>
                    <Text style={styles.text}>
                      {mar.monthlyProjectActivity.activityTemplate?.product?.name}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.cell3]}>
                    <Text style={styles.text}>
                      {mar.monthlyNoImplUnits}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.cell4]}>
                    <Text style={styles.text}>
                      {mar.monthlyProjectActivity.quantity}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.cell5]}>
                    <Text style={styles.text}>
                      {mar.monthlyProjectActivity.cost}
                    </Text>
                  </View>
                  <View style={[styles.cell, styles.cell6]}>
                    <Text style={styles.text}>
                      {mar.monthlyActivityCost}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  )
});

export const getMonthlyPDF = async (report: ProjectReportOutDTO) => {
  return await ReactPDF.renderToBuffer(<MonthlyPDF report={report} />);
};
