import { ActivityReportOutDTO, ProjectReportOutDTO } from "@workspace/api/src/modules/report/dtos/report-out.dto";
import { isNotEmpty } from "class-validator";
import { memo, PropsWithChildren, useCallback } from "react";
import { Control, Controller, UseFormSetValue, useWatch } from "react-hook-form";
import { View } from "react-native";
import MGRow from "../../../../components/MGRow";
import MGTextInput from "../../../../components/MGTextInput";

type Props = PropsWithChildren<{
  report: ActivityReportOutDTO;
  index: number;
  control: Control<ProjectReportOutDTO, any>;
  setValue: UseFormSetValue<ProjectReportOutDTO>;
}>

export default memo<Props>(function MonthlyActivityReport({ index, report, control, setValue }) {
  const state = useWatch({ control, name: `monthlyActivityReports.${index}` });

  const renderActivityReportMonthlyNoImplUnits = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              value={value.toString()}
              onChangeText={val => {
                onChange(val);
                setValue(`monthlyActivityReports.${index}.monthlyActivityCost`, parseInt(val) * state.monthlyProjectActivity.cost);
              }}
              style={{ marginBottom: 7 }}
              label={'Unitati implementate'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyNoImplUnits`}
      />
    );
  }, [control, setValue, state.monthlyProjectActivity.cost]);

  const renderActivityReportMonthlyTotalProjectUnits = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              disabled
              value={value.toString()}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Total la nivel de proiect'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyProjectActivity.quantity`}
      />
    );
  }, [control]);

  const renderActivityReportActivityCost = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              disabled
              value={value.toString()}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Cost per activitate'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyProjectActivity.cost`}
      />
    );
  }, [control]);

  const renderActivityReportMonthlyActivityCost = useCallback((index: number) => {
    return (
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'Field is required!' },
          validate: (value) => isNotEmpty(value),
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <MGTextInput
              value={value.toString()}
              onChangeText={onChange}
              style={{ marginBottom: 7 }}
              label={'Cost total'}
            />
          </>
        )}
        name={`monthlyActivityReports.${index}.monthlyActivityCost`}
      />
    );
  }, [control]);

  return (
    <View key={index}>
      <MGRow>
        {renderActivityReportMonthlyNoImplUnits(index)}
        {renderActivityReportMonthlyTotalProjectUnits(index)}
      </MGRow>
      <MGRow>
        {renderActivityReportActivityCost(index)}
        {renderActivityReportMonthlyActivityCost(index)}
      </MGRow>
    </View>
  );
});
