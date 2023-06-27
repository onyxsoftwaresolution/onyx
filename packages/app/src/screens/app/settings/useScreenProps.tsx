import { RouteConfig } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import { HeaderAddButton } from "../../../components/HeaderAddButton";
import { Screens } from "../../Screens";
import { useScreenOptions } from "../../useScreenOptions";
import ActivityTemplateListScreen from "../activity/ActivityTemplateListScreen";
import EmployeeListScreen from "./employee/EmployeeListScreen";
import React from 'react';

export const useActivityTemplateListScreenProps = (): RouteConfig<any, any, any, any, any> => {
  const options = useScreenOptions();

  return ({
    name: Screens.APP_ACTIVITY_TEMPLATE_LIST,
    component: ActivityTemplateListScreen,
    options: (screenProps: RouteProp<any, any>) => ({
      ...options('Sablon activitati'),
      headerRight: (headerProps: any) => (
        <HeaderAddButton
          {...screenProps}
          {...headerProps}
          screenName={Screens.APP_ACTIVITY_TEMPLATE_UPSERT}
        />
      ),
    }),
  });
}

export const useEmployeeListScreenProps = (): RouteConfig<any, any, any, any, any> => {
  const options = useScreenOptions();

  return ({
    name: Screens.APP_EMPLOYEE_LIST,
    component: EmployeeListScreen,
    options: (screenProps: RouteProp<any, any>) => ({
      ...options('Angajati'),
      headerRight: (headerProps: any) => (
        <HeaderAddButton
          {...screenProps}
          {...headerProps}
          screenName={Screens.APP_EMPLOYEE_UPSERT}
        />
      ),
    }),
  });
}
