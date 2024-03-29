import { UseQueryOptions } from '@tanstack/react-query';
import { Store } from '../storage/Store';
import { FetchError, FetchResponse, request } from './request';
import { ProjectActivityOutDTO, ProjectActivityQueryParams, ProjectOutDTO } from '@workspace/api/src/modules/project/dtos/project.out.dto';
import { ActivityTemplateOutDTO } from "@workspace/api/src/modules/activity-template/dtos/activity-template-out.dto"
import { EmployeeOutDTO } from "@workspace/api/src/modules/employee/dtos/employee.out.dto"
import { ReportListItemOutDTO } from '@workspace/api/src/modules/report/dtos/report-out.dto';
import { Report } from '../screens/app/reports/Report';
import { JwtUserDTO } from '@workspace/api/src/modules/user/dtos/jwt.user.dto';
import { API_URL } from '@env';
import { InfoDTO } from "@workspace/api/src/modules/app/dtos/info.dto"
import { UserOutDTO } from '@workspace/api/src/modules/user/dtos/user-out.dto';
import { Role } from '@workspace/api/prisma/prisma';
import { SupplierOutDTO } from '@workspace/api/src/modules/supplier/dtos/supplier.out.dto';
import { ClientOutDTO } from '@workspace/api/src/modules/client/dtos/client.out.dto';
import { ContractOutDTO } from '@workspace/api/src/modules/contract/dtos/contract.out.dto';
import { ProductOutDTO } from '@workspace/api/src/modules/product/dtos/product.out.dto';
import { CostOutDTO } from '@workspace/api/src/modules/cost/dtos/cost.out.dto';
import { getQueryParams } from '../getQueryParams';
import { InvoiceOutDTO } from '@workspace/api/src/modules/invoice/dtos/invoice.out.dto';
import { ReceiptOutDTO } from '@workspace/api/src/modules/receipt/dtos/receipt.out.dto';

type Options<T = never> = Partial<Pick<UseQueryOptions<T>, 'onError' | 'onSuccess'>> & {
  onLoading?: () => void;
  enabled?: boolean;
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

  static getSelf = ({ enabled = true, onError, onLoading, onSuccess }: Options<FetchResponse<JwtUserDTO>> = {}) => ({
    queryKey: ['self'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/user/self`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<JwtUserDTO>, FetchError>);

  static getRoles = ({ enabled = true, onError, onLoading, onSuccess }: Options<FetchResponse<any[]>> = {}) => ({
    queryKey: ['roles'],
    queryFn: async () => {
      onLoading?.();
      return {
        data: Object.values(Role),
        ok: true, status: 200, statusText: '', url: '',
      };
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<any[]>, FetchError>);

  static getUsers = ({ enabled = true, onError, onLoading, onSuccess }: Options<FetchResponse<UserOutDTO>> = {}) => ({
    queryKey: ['users'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/users`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<UserOutDTO[]>, FetchError>);

  static getEmployees = ({ enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: ['employees'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/employees`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<EmployeeOutDTO[]>, FetchError>);

  static getClients = ({ enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: ['clients'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/clients`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ClientOutDTO[]>, FetchError>);

  static getClient = (id: number, { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<ClientOutDTO>> = {}) => ({
    queryKey: [`client-${id}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/client/${id}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ClientOutDTO>, FetchError>);

  static getCosts = (activityId: number, { enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: [`/v1/project-activity/${activityId}/costs`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/project-activity/${activityId}/costs`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<CostOutDTO[]>, FetchError>);

  static getCost = (id: number, { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<CostOutDTO>> = {}) => ({
    queryKey: [`cost-${id}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/cost/${id}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<CostOutDTO>, FetchError>);

  static getInvoices = (projectId: number, { enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: [`/v1/project/${projectId}/invoices`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/project/${projectId}/invoices`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<InvoiceOutDTO[]>, FetchError>);

  static getInvoice = (id: number, paths: string[], { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<InvoiceOutDTO>> = {}) => ({
    queryKey: [`/v1/invoice/${id}?paths=${JSON.stringify(paths)}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/invoice/${id}?paths=${JSON.stringify(paths)}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<InvoiceOutDTO>, FetchError>);

  static getReceipts = (projectId: number, { enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: [`/v1/project/${projectId}/receipts`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/project/${projectId}/receipts`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ReceiptOutDTO[]>, FetchError>);

  static getReceipt = (id: number, { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<ReceiptOutDTO>> = {}) => ({
    queryKey: [`receipt-${id}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/receipt/${id}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ReceiptOutDTO>, FetchError>);

  static getSuppliers = ({ enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: ['suppliers'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/suppliers`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<SupplierOutDTO[]>, FetchError>);

  static getSupplier = (id: number, { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<SupplierOutDTO>> = {}) => ({
    queryKey: [`supplier-${id}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/supplier/${id}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<SupplierOutDTO>, FetchError>);

  static getSupplierProducts = (id: number, { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<ProductOutDTO[]>> = {}) => ({
    queryKey: [`supplier-${id}-products`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/supplier/${id}/products`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ProductOutDTO[]>, FetchError>);

  static getProducts = ({ enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: ['products'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/products`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ProductOutDTO[]>, FetchError>);

  static getActivityTemplate = (id: number, { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<ActivityTemplateOutDTO>> = {}) => ({
    queryKey: [`activity-template-${id}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/activity-template/${id}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ActivityTemplateOutDTO>, FetchError>);

  static getProduct = (id: number, { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<ProductOutDTO>> = {}) => ({
    queryKey: [`product-${id}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/product/${id}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ProductOutDTO>, FetchError>);

  static getActivityTemplates = ({ enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: ['activity-templates'],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/activity-templates`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ActivityTemplateOutDTO[]>, FetchError>);

  static getProjectActivities = (projectId: number, params: ProjectActivityQueryParams, { enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: [`/v1/project/${projectId}/project-activities?${getQueryParams(params)}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/project/${projectId}/project-activities?${getQueryParams(params)}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<
    FetchResponse<ProjectActivityOutDTO[]>,
    FetchError
  >);

  static getProjects(paths: string[], { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<ProjectOutDTO[]>> = {}) {
    return ({
      queryKey: [`/v1/projects?paths=${JSON.stringify(paths)}`],
      async queryFn() {
        onLoading?.();
        return await Queries.queryFn(`${API_URL}/v1/projects?paths=${JSON.stringify(paths)}`);
      },
      onError,
      onSuccess,
      enabled,
    } as UseQueryOptions<FetchResponse<ProjectOutDTO[]>>);
  }

  static getProject = (id: number, { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<ProjectOutDTO>> = {}) => ({
    queryKey: [`project-${id}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/project/${id}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ProjectOutDTO>, FetchError>);

  static getContracts({ enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<ContractOutDTO[]>> = {}) {
    return ({
      queryKey: ['contracts'],
      async queryFn() {
        onLoading?.();
        return await Queries.queryFn(`${API_URL}/v1/contracts`);
      },
      onError,
      onSuccess,
      enabled,
    } as UseQueryOptions<FetchResponse<ContractOutDTO[]>>);
  }

  static getContract = (id: number, { enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<ContractOutDTO>> = {}) => ({
    queryKey: [`contract-${id}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/contract/${id}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ContractOutDTO>, FetchError>);

  static getReports = (type: Report, projectId: number, { enabled = false, onError, onLoading, onSuccess }: Options = {}) => ({
    queryKey: [`/v1/${type}-reports/${projectId}`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/${type}-reports/${projectId}`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<ReportListItemOutDTO[]>>);

  static getInfo = ({ enabled = false, onError, onLoading, onSuccess }: Options<FetchResponse<InfoDTO>> = {}) => ({
    queryKey: [`/v1/info`],
    queryFn: async () => {
      onLoading?.();
      return await Queries.queryFn(`${API_URL}/v1/info`);
    },
    onError,
    onSuccess,
    enabled,
  } as UseQueryOptions<FetchResponse<InfoDTO>>);
}
