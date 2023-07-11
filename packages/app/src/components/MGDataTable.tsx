import React, { ReactNode, memo, useCallback } from "react";
import { DataTable, Text } from "react-native-paper";

type MGDataTableProps = {
  headers?: ReactNode[];
  rows?: ReactNode[][];
}

export default memo<MGDataTableProps>(function MGDataTable(props) {
  const renderHeader = useCallback(() => {
    if (props.headers == null) return null;
    return (
      <DataTable.Header>
        {props.headers?.map((header, i) => (
          <DataTable.Title key={i}>
            {typeof header === "string" ? <Text>{header}</Text> : header}
          </DataTable.Title>
        ))}
      </DataTable.Header>
    );
  }, [props.headers]);

  const renderRow = useCallback((row: ReactNode[], i: number) => {
    return (
      <DataTable.Row key={i}>
        {row?.map((cell, j) => (
          <DataTable.Cell key={j}>
            {typeof cell === "string" ? <Text>{cell}</Text> : cell}
          </DataTable.Cell>
        ))}
      </DataTable.Row>
    );
  }, []);

  return (
    <DataTable>
      {renderHeader()}
      {props.rows?.map((row, i) => renderRow(row, i))}
    </DataTable>
  );
});
