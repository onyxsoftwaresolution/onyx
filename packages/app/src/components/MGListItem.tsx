import React, { memo, useCallback } from "react";
import { View, StyleSheet, FlexStyle } from "react-native";
import { Text, HelperText } from "react-native-paper";
import MGTextInput from "./MGTextInput";

type Row = {
  label: string;
  value: string;
}

type ListItemProps = {
  rows: Row[];
  labelWidth?: number;
  direction?: FlexStyle['flexDirection'];
  type?: 'text' | 'input';
}

export default memo<ListItemProps>(function MGListItem({ direction, labelWidth, type, ...props }) {
  direction ??= 'row';
  labelWidth ??= 130;
  type ??= 'text';

  const renderText = useCallback((row: Row, index: number) => {
    return (
      <Text key={index} style={[styles.parentText, { flexDirection: direction }]}>
        <HelperText
          style={[
            styles.helperText,
            {
              width: direction === 'row' ? labelWidth : undefined,
              minWidth: direction === 'row' ? labelWidth : undefined,
            }
          ]}
          variant='bodySmall'
          type='info'
        >
          {row.label}
        </HelperText>
        <Text variant='bodyLarge' style={[styles.itemText]}>{row.value}</Text>
      </Text>
    );
  }, [direction, labelWidth]);

  const renderInput = useCallback((row: Row, index: number) => {
    return (
      <MGTextInput
        key={index}
        disabled
        label={row.label}
        value={row.value ?? ''}
        onChange={() => { }}
      />
    );
  }, [])

  return (
    <View>
      {props.rows.map((row, index) => (
        type === 'text' ? renderText(row, index) : renderInput(row, index)
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
    display: 'flex',
  },
  itemText: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 3,
  },
});
