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
import { ProjectReportOutDTO } from '@workspace/api/src/modules/report/dtos/report-out.dto';
import { UserOutDTO } from '@workspace/api/src/modules/user/dtos/user-out.dto';
import { CreateUserDTO } from '@workspace/api/src/modules/user/dtos/user.create.dto';
import { ClientOutDTO } from '@workspace/api/src/modules/client/dtos/client.out.dto';
import { SupplierOutDTO } from '@workspace/api/src/modules/supplier/dtos/supplier.out.dto';
import { ContractOutDTO } from '@workspace/api/src/modules/contract/dtos/contract.out.dto';
import { UpsertContractDTO } from '@workspace/api/src/modules/contract/dtos/contract.in.dto';
import { ProductOutDTO } from '@workspace/api/src/modules/product/dtos/product.out.dto';

type Options<T = never> = Partial<Pick<UseMutationOptions<T>, 'onError' | 'onSuccess'>> & {
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

  static upsertUser({ onError, onLoading, onSuccess }: Options<FetchResponse<UserOutDTO>> = {}) {
    return {
      mutationKey: ['user'],
      mutationFn: async (body) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/user`,
          {
            // @ts-expect-error a simple typescript mistake
            body,
            method: 'PUT',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<UserOutDTO>, FetchError, CreateUserDTO>;
  }

  static deleteUser({ onError, onLoading, onSuccess }: Options<FetchResponse<UserOutDTO>> = {}) {
    return {
      mutationKey: [`/v1/user/username`],
      mutationFn: async (username) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/user/${username}`,
          { method: 'DELETE' },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<UserOutDTO>, FetchError, string>;
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

  static upsertClient({ onError, onLoading, onSuccess }: Options<FetchResponse<ClientOutDTO>> = {}) {
    return {
      mutationKey: ['client'],
      mutationFn: async (body) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/client`,
          {
            // @ts-expect-error a simple typescript mistake
            body,
            method: 'PUT',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<ClientOutDTO>, FetchError, Partial<ClientOutDTO>>;
  }

  static upsertSupplier({ onError, onLoading, onSuccess }: Options<FetchResponse<SupplierOutDTO>> = {}) {
    return {
      mutationKey: ['supplier'],
      mutationFn: async (body) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/supplier`,
          {
            // @ts-expect-error a simple typescript mistake
            body,
            method: 'PUT',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<SupplierOutDTO>, FetchError, Partial<SupplierOutDTO>>;
  }

  static upsertProduct({ onError, onLoading, onSuccess }: Options<FetchResponse<ProductOutDTO>> = {}) {
    return {
      mutationKey: ['product'],
      mutationFn: async (body) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/product`,
          {
            // @ts-expect-error a simple typescript mistake
            body,
            method: 'PUT',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<ProductOutDTO>, FetchError, Partial<ProductOutDTO>>;
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

  static deleteClient({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: [`/v1/client/`],
      mutationFn: async (id) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/client/${id}`,
          {
            method: 'DELETE',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<ClientOutDTO>, FetchError, number>;
  }

  static deleteSupplier({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: [`/v1/supplier/`],
      mutationFn: async (id) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/supplier/${id}`,
          {
            method: 'DELETE',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<SupplierOutDTO>, FetchError, number>;
  }

  static deleteProduct({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: [`/v1/product/`],
      mutationFn: async (id) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/product/${id}`,
          {
            method: 'DELETE',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<ProductOutDTO>, FetchError, number>;
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

  static deleteContract({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: ['contract'],
      mutationFn: async (id) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/contract/${id}`,
          {
            method: 'DELETE',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<FetchResponse<ContractOutDTO>, unknown, number>;
  }

  static getReport = (
    type: Report, isNew: boolean, projectId: number, projectReportId: number | undefined, month: string,
    { onError, onLoading, onSuccess }: Options<FetchResponse<ProjectReportOutDTO>> = {}
  ) => {
    let path = '';
    if (isNew && type === Report.MONTHLY) {
      path = `/v1/new-${type}-report/${projectId}/${month}`;
    } else if (isNew && type === Report.DAILY) {
      path = `/v1/new-${type}-report/${projectId}`;
    } else if (projectReportId != null) {
      path = `/v1/${type}-report/${projectId}/${projectReportId}`;
    }
    return ({
      mutationKey: [`${path}`],
      mutationFn: async () => {
        onLoading?.();
        return await Mutations.mutationFn(`${API_URL}${path}`);
      },
      onError,
      onSuccess,
    } as UseMutationOptions<FetchResponse<ProjectReportOutDTO>, FetchError>)
  };

  static deleteReport = (type: Report, { onError, onLoading, onSuccess }: Options<FetchResponse<ProjectReportOutDTO>> = {}) => {
    return ({
      mutationKey: [`delete-report}`],
      mutationFn: async (projectReportId) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/${type}-report/${projectReportId}`,
          { method: 'DELETE' }
        );
      },
      onError,
      onSuccess,
    } as UseMutationOptions<FetchResponse<ProjectReportOutDTO>, FetchError, number>)
  };

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

  static upsertContract({ onError, onLoading, onSuccess }: Options = {}) {
    return {
      mutationKey: ['contract'],
      mutationFn: async (body) => {
        onLoading?.();
        return await Mutations.mutationFn(
          `${API_URL}/v1/contract/`,
          {
            body: body as any,
            method: 'PUT',
          },
        );
      },
      onSuccess,
      onError,
    } as UseMutationOptions<
      FetchResponse<ContractOutDTO>,
      FetchError,
      UpsertContractDTO,
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
