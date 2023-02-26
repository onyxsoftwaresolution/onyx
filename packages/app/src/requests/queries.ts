import { UseQueryOptions } from '@tanstack/react-query';
import { Store } from '../storage/Store';
import { queryFn, request } from './request';

type Options = Partial<Pick<UseQueryOptions, 'onError' | 'onSuccess'>> & {
  onLoading?: () => void;
};

export class Queries {
  static getSelf = ({ onError, onLoading, onSuccess }: Options = {}) =>
    ({
      queryKey: ['self'],
      queryFn: async () => {
        onLoading?.();
        return await queryFn(`http://192.168.0.102:4000/v1/user/self`);
      },
      onError,
      onSuccess,
    } as UseQueryOptions);

  static getEmployees = ({ onError, onLoading, onSuccess }: Options = {}) =>
    ({
      queryKey: ['employees'],
      queryFn: async () => {
        onLoading?.();
        return await queryFn(`http://192.168.0.102:4000/v1/employees`);
      },
      onError,
      onSuccess,
    } as UseQueryOptions);

  static getActivityTemplates = ({
    onError,
    onLoading,
    onSuccess,
  }: Options = {}) =>
    ({
      queryKey: ['activity-templates'],
      queryFn: async () => {
        onLoading?.();
        return await queryFn(`http://192.168.0.102:4000/v1/activity-templates`);
      },
      onError,
      onSuccess,
    } as UseQueryOptions);

  static getProjects = ({ onError, onLoading, onSuccess }: Options = {}) =>
    ({
      queryKey: ['projects'],
      queryFn: async () => {
        onLoading?.();
        return await queryFn(`http://192.168.0.102:4000/v1/projects`);
      },
      onError,
      onSuccess,
    } as UseQueryOptions);
}
