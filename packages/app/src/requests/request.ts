import { Store } from '../storage/Store';

const getContentType = (responseHeaders: Headers) => {
  const headers = Array.from(responseHeaders.entries());
  const header = headers
    .filter((h) => h[0].includes('content-type'))
    ?.at(0)
    ?.at(1);
  if (header?.includes('text/plain')) return 'text/plain';
  if (header?.includes('application/json')) return 'application/json';
  return 'application/octet-stream';
};

const getPayload = async <T>(response: Response): Promise<T> => {
  const contentType = getContentType(response.headers);
  switch (contentType) {
    case 'application/json':
      if (response.ok)
        return {
          data: await response.json(),
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        } as T;
      throw {
        data: await response.json(),
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      };
    case 'text/plain':
      if (response.ok)
        return {
          data: await response.json(),
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        } as T;
      throw {
        data: await response.text(),
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      };
    default:
      return '' as T;
  }
};

export const request = async <T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(input, init);
  return await getPayload<T>(response);
};

export const mutationFn = async (
  input: RequestInfo,
  init?: RequestInit,
  onSuccess?: (result: unknown) => void,
) => {
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

export const queryFn = async (
  input: RequestInfo,
  init?: RequestInit,
  onSuccess?: (result: unknown) => void,
) => {
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
