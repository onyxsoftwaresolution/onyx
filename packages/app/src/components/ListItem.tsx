import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Text, HelperText } from "react-native-paper";

type Row = {
  label: string;
  value: string;
}

type ListItemProps = {
  rows: Row[];
  labelWidth?: number;
}

export default memo<ListItemProps>(function ListItem(props) {
  return (
    <View style={[{ flex: 1 }]}>
      {props.rows.map((row, index) => (
        <Text key={index} style={[styles.parentText]}>
          <HelperText
            style={[
              styles.helperText,
              {
                width: props.labelWidth ?? styles.helperText.width,
                minWidth: props.labelWidth ?? styles.helperText.width
              }
            ]}
            variant='bodySmall'
            type='info'
          >
            {row.label}
          </HelperText>
          <Text variant='bodyLarge' style={[styles.itemText]}>{row.value}</Text>
        </Text>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  parentText: {
    display: 'flex',
    flexDirection: 'row',
  },
  helperText: {
    width: 130,
    minWidth: 130,
    display: 'flex',
  },
  itemText: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 3,
  },
});
