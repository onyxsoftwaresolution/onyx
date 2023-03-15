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

export type FetchResponse<T> = {
  data: T;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
};

export type FetchError = FetchResponse<{
  code: string;
  message: string[];
}>;

const getPayload = async <T>(response: Response): Promise<FetchResponse<T>> => {
  const contentType = getContentType(response.headers);
  switch (contentType) {
    case 'application/json': {
      const rv = {
        data: await response.json(),
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      } as FetchResponse<T>
      if (response.ok) {
        return rv;
      }
      throw rv;
    }
    case 'text/plain': {
      const rv = {
        data: await response.text(),
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      } as FetchResponse<T>;
      if (response.ok) {
        return rv;
      }
      throw rv;
    }
    default:
      return {} as FetchResponse<T>;
  }
};

export const request = async <T>(input: RequestInfo, init?: RequestInit): Promise<FetchResponse<T>> => {
  const response = await fetch(input, init);
  return await getPayload<T>(response);
};
