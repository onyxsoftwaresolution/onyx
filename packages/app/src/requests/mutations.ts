import { UseMutationOptions } from '@tanstack/react-query';
import { ProjectOutDTO } from '@workspace/api/src/modules/project/dtos/project.out.dto';
import { UpsertProjectDTO } from '@workspace/api/src/modules/project/dtos/project.in.dto';
import { LoginTokenDTO } from '@workspace/api/src/modules/auth/dtos/login.token.dto';
import { LoginDTO } from '@workspace/api/src/modules/auth/dtos/login.dto';
import { Store } from '../storage/Store';
import { FetchError, FetchResponse, request } from './request';
import { Report } from '../screens/app/reports/Report';
import { EmployeeOutDTO } from '@workspace/api/src/modules/employee/dtos/employee.out.dto';
import { ActivityTemplateOutDTO } from '@workspace/api/src/modules/activity-template/dtos/activity-template-out.dto';
import { API_URL } from '@env';

type Options<T = unknown> = Partial<Pick<UseMutationOptions<T>, 'onError' | 'onSuccess'>> & {
  onLoading?: () => void;
};

export class Mutations {
  static mutationFn = async <T>(
    input: RequestInfo,
    init?: RequestInit,
    onSuccess?: (result: FetchResponse<T>) => void,
  ) => {
    const token = await Store.get('access_token');
    const auth =
      token != null
        ? {
          Authorization: `Bearer ${token}`,
        }
        : {};
    const response = await request<T>(input, {
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

  static getMutationError = (error: FetchError | null | undefined) => {
    return error?.data.message.reduce((p, n) => {
      const parsed: { key: string; value: string; } = JSON.parse(n);
      if (p[parsed.key] == null) p[parsed.key] = [];
      p[parsed.key].push(parsed.value);
      return p;
    }, {} as Record<string, string[]>);
  }

  static postLogin({ onError, onLoading, onSuccess }: Options<FetchResponse<EmployeeOutDTO>> = {}) {
    return {
      mutationKey: ['login'],
      mutationFn: async (body) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/auth/login`,
          { body: body as any, method: 'POST' },
          (response) => {
            Store.set('access_token', response.data?.access_token ?? null);
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<LoginTokenDTO>, FetchError, LoginDTO>;
  }

  static upsertEmployee({ onError, onLoading, onSuccess }: Options<FetchResponse<EmployeeOutDTO>> = {}) {
    return {
      mutationKey: ['employee'],
      mutationFn: async (body) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/employee`,
          {
            // @ts-expect-error a simple typescript mistake
            body,
            method: 'PUT',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<EmployeeOutDTO>, FetchError, Partial<EmployeeOutDTO>>;
  }

  static deleteActivityTemplate({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: [`/v1/activity-template/`],
      mutationFn: async (id) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/activity-template/${id}`,
          {
            method: 'DELETE',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<ActivityTemplateOutDTO>, FetchError, number>;
  }

  static deleteEmployee({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: [`/v1/employee/`],
      mutationFn: async (id) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/employee/${id}`,
          {
            method: 'DELETE',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<EmployeeOutDTO>, FetchError, number>;
  }


  static upsertActivityTemplate({ onError, onLoading, onSuccess }: Options<FetchResponse<ActivityTemplateOutDTO>> = {}) {
    return {
      mutationKey: ['activity-template'],
      mutationFn: async (body: any) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/activity-template`,
          {
            body,
            method: 'PUT',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<ActivityTemplateOutDTO>, FetchError, Partial<ActivityTemplateOutDTO>>;
  }

  static deleteProject({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: ['project'],
      mutationFn: async (id) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/project/${id}`,
          {
            method: 'DELETE',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<ProjectOutDTO>, unknown, number>;
  }

  static upsertProject({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: ['project'],
      mutationFn: async (body) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/project/`,
          {
            body: body as any,
            method: 'PUT',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<
      FetchResponse<ProjectOutDTO>,
      FetchError,
      UpsertProjectDTO,
      unknown
    >;
  }

  static upsertReport(
    type: Report, projectId: number, projectReportId: number | undefined,
    { onError, onLoading, onSuccess }: Options = {}
  ) {
    return {
      mutationKey: [`report-project-${projectId}`],
      mutationFn: async (body) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/${type}-report/${projectId}/${projectReportId ?? ''}`,
          {
            body: body as any,
            method: 'PUT',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<
      FetchResponse<any>,
      FetchError,
      any,
      unknown
    >;
  }

  static emailReport(
    type: Report, projectId: number, projectReportId: number,
    { onError, onLoading, onSuccess }: Options = {}
  ) {
    return {
      mutationKey: [`report-project-${projectId}`],
      mutationFn: async (to: string) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/${type}-report/${projectId}/${projectReportId}/${to}`,
          {
            method: 'POST',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<
      FetchResponse<any>,
      FetchError,
      any,
      unknown
    >;
  }
}
