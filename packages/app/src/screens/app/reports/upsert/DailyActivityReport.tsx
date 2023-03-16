import { ActivityReportOutDTO, ProjectReportOutDTO } from "@workspace/api/src/modules/report/dtos/report-out.dto";
import { isNotEmpty } from "class-validator";
import { memo, PropsWithChildren, useCallback } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import { View } from "react-native";
import MGRow from "../../../../components/MGRow";
import MGTextInput from "../../../../components/MGTextInput";

type Props = PropsWithChildren<{
  report: ActivityReportOutDTO;
  index: number;
  control: Control<ProjectReportOutDTO, any>;
}>

export default memo<Props>(function DailyActivityReport({ index, report, control }) {
  const state = useWatch({ control, name: `dailyActivityReports.${index}` });

  const renderActivityReportTodayStock = useCallback((index: number) => {
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
              label={'Stoc azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.todayStock`}
      />
    );
  }, [control]);

  const renderActivityReportAddedStock = useCallback((index: number) => {
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
              label={'Cantitate intrare azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.addedStock`}
      />
    );
  }, [control]);

  const renderActivityReportTotalStock = useCallback((index: number) => {
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
              label={'Stoc total'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.totalStock`}
      />
    );
  }, [control]);

  const renderActivityReportNoImplToday = useCallback((index: number) => {
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
              label={'Realizat azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.noImplToday`}
      />
    );
  }, [control]);

  const renderActivityReportFinalStockToday = useCallback((index: number) => {
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
              label={'Stoc ramas'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.finalStockToday`}
      />
    );
  }, [control]);

  const renderActivityReportTotalImplToday = useCallback((index: number) => {
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
              label={'Total realizat la azi'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.totalImplToday`}
      />
    );
  }, [control]);

  const renderActivityReportTotalProjectUnits = useCallback((index: number) => {
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
              label={'Totalul la nivel de proiect'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.totalProjectUnits`}
      />
    );
  }, [control]);

  const renderActivityReportRemainingUnits = useCallback((index: number) => {
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
              label={'Rest de realizat'}
            />
          </>
        )}
        name={`dailyActivityReports.${index}.remainingUnits`}
      />
    );
  }, [control]);

  return (
    <View key={index}>
      <MGRow>
        {renderActivityReportTodayStock(index)}
        {renderActivityReportAddedStock(index)}
      </MGRow>
      <MGRow>
        {renderActivityReportTotalStock(index)}
        {renderActivityReportNoImplToday(index)}
      </MGRow>
      <MGRow>
        {renderActivityReportFinalStockToday(index)}
        {renderActivityReportTotalImplToday(index)}
      </MGRow>
      <MGRow>
        {renderActivityReportTotalProjectUnits(index)}
        {renderActivityReportRemainingUnits(index)}
      </MGRow>
    </View>
  );
});
