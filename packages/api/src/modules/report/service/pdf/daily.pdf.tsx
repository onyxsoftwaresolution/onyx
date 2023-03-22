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
    width: '20%',
    borderColor: '#90e5fc',
    borderLeftWidth: 1,
  },
  cell2: {
    width: '8%',
  },
  cell3: {
    width: '8%',
  },
  cell4: {
    width: '8%',
  },
  cell5: {
    width: '8%',
  },
  cell6: {
    width: '8%',
  },
  cell7: {
    width: '8%',
  },
  cell8: {
    width: '8%',
  },
  cell9: {
    width: '8%',
  },
  cell10: {
    width: '8%',
  },
  cell11: {
    width: '8%',
  },
  test: {
    color: '#000000',
    fontSize: 8
  },
});

type Props = React.PropsWithChildren<{
  report: ProjectReportOutDTO;
}>;

const DailyPDF = React.memo<Props>((props) => {
  return (
    <Document>
      <Page orientation='landscape' size="A4" style={styles.page}>
        <View style={styles.table}>
          <View style={[styles.row, styles.tableHeader]}>
            <View style={[styles.cell, styles.cell1]}>
              <Text style={styles.test}>{'Denumire Activitate'}</Text>
            </View>
            <View style={[styles.cell, styles.cell2]}>
              <Text style={styles.test}>{'Materiale'}</Text>
            </View>
            <View style={[styles.cell, styles.cell3]}>
              <Text style={styles.test}>{'Stoc azi'}</Text>
            </View>
            <View style={[styles.cell, styles.cell4]}>
              <Text style={styles.test}>{'Cant. intrare azi'}</Text>
            </View>
            <View style={[styles.cell, styles.cell5]}>
              <Text style={styles.test}>{'Stoc total'}</Text>
            </View>
            <View style={[styles.cell, styles.cell6]}>
              <Text style={styles.test}>{'Realizat azi'}</Text>
            </View>
            <View style={[styles.cell, styles.cell7]}>
              <Text style={styles.test}>{'Stoc ramas'}</Text>
            </View>
            <View style={[styles.cell, styles.cell8]}>
              <Text style={styles.test}>{'Total realizat'}</Text>
            </View>
            <View style={[styles.cell, styles.cell9]}>
              <Text style={styles.test}>{'Total la nivel de proiect'}</Text>
            </View>
            <View style={[styles.cell, styles.cell10]}>
              <Text style={styles.test}>{'Rest de realizat'}</Text>
            </View>
            <View style={[styles.cell, styles.cell11]}>
              <Text style={styles.test}>{'% finalizat'}</Text>
            </View>
          </View>
          {props.report.dailyActivityReports.map(dar => {
            return (
              <View key={dar.id} style={styles.row}>
                <View style={[styles.cell, styles.cell1]}>
                  <Text style={styles.test}>
                    {dar.dailyProjectActivity.description}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell2]}>
                  <Text style={styles.test}>
                    {dar.dailyProjectActivity.material}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell3]}>
                  <Text style={styles.test}>
                    {dar.todayStock}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell4]}>
                  <Text style={styles.test}>
                    {dar.addedStock}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell5]}>
                  <Text style={styles.test}>
                    {dar.totalStock}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell6]}>
                  <Text style={styles.test}>
                    {dar.noImplToday}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell7]}>
                  <Text style={styles.test}>
                    {dar.finalStockToday}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell8]}>
                  <Text style={styles.test}>
                    {dar.totalImplToday}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell9]}>
                  <Text style={styles.test}>
                    {dar.totalProjectUnits}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell10]}>
                  <Text style={styles.test}>
                    {dar.remainingUnits}
                  </Text>
                </View>
                <View style={[styles.cell, styles.cell11]}>
                  <Text style={styles.test}>
                    {Number((1 - (dar.remainingUnits / dar.totalProjectUnits)).toFixed(2)) * 100}%
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

export const getDailyPDF = async (report: ProjectReportOutDTO) => {
  return await ReactPDF.renderToBuffer(<DailyPDF report={report} />);
};
