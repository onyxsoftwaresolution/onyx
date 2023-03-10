import { UseQueryOptions } from '@tanstack/react-query';
import { Store } from '../storage/Store';
import { FetchError, FetchResponse, request } from './request';
import { ProjectOutDTO } from '@workspace/api/src/modules/project/dtos/project.out.dto';
import { ActivityTemplateOutDTO } from "@workspace/api/src/modules/activity-template/dtos/activity-template-out.dto"
import { EmployeeOutDTO } from "@workspace/api/src/modules/employee/dtos/employee.out.dto"
import { ReportListItemOutDTO } from '@workspace/api/src/modules/report/dtos/report-out.dto';
import { Report } from '../screens/app/reports/Report';

type Options = Partial<Pick<UseQueryOptions, 'onError' | 'onSuccess'>> & {
  onLoading?: () => void;
};

export class Queries {
  static queryFn = async (input: RequestInfo, init?: RequestInit, onSuccess?: (result: unknown) => void) => {
    const token = await Store.get('access_token');
    const auth =
      token != null
        ? {
          Authorization: `Bearer ${token}`,
        }
        : {};
    const response = await request(input, {
      ...init,
      body: JSON.stringify(init?.body),
      headers: {
        ...auth,
        'content-type': 'application/json',
        ...init?.headers,
      } as any,
    });
    onSuccess?.(response);
    return response;
  };

  static getSelf = ({ onError, onLoading, onSuccess }: Options = {}) =>
  ({
    queryKey: ['self'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`http://192.168.0.102:4000/v1/user/self`);
    },
    onError,
    onSuccess,
  } as UseQueryOptions);

  static getEmployees = ({ onError, onLoading, onSuccess }: Options = {}) =>
  ({
    queryKey: ['employees'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`http://192.168.0.102:4000/v1/employees`);
    },
    onError,
    onSuccess,
  } as UseQueryOptions<FetchResponse<EmployeeOutDTO>, FetchError>);

  static getActivityTemplates = ({ onError, onLoading, onSuccess }: Options = {}) =>
  ({
    queryKey: ['activity-templates'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`http://192.168.0.102:4000/v1/activity-templates`);
    },
    onError,
    onSuccess,
  } as UseQueryOptions<FetchResponse<ActivityTemplateOutDTO[]>, FetchError>);

  static getProjects = ({ onError, onLoading, onSuccess }: Options = {}) =>
  ({
    queryKey: ['projects'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`http://192.168.0.102:4000/v1/projects`);
    },
    onError,
    onSuccess,
  } as UseQueryOptions<FetchResponse<ProjectOutDTO[]>>);

  static getProject = (id: number, { onError, onLoading, onSuccess }: Options = {}) =>
  ({
    queryKey: [`project-${id}`],
    queryFn: async () => {
      onLoading?.();
      if (id == null) return;
      return await Queries.queryFn(`http://192.168.0.102:4000/v1/project/${id}`);
    },
    onError,
    onSuccess,
  } as UseQueryOptions<FetchResponse<ProjectOutDTO>, FetchError>);

  static getReports = (type: Report, projectId: number, { onError, onLoading, onSuccess }: Options = {}) =>
  ({
    queryKey: [`/v1/${type}-reports/${projectId}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`http://192.168.0.102:4000/v1/${type}-reports/${projectId}`);
    },
    onError,
    onSuccess,
  } as UseQueryOptions<FetchResponse<ReportListItemOutDTO[]>>);
}
