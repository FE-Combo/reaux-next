import axioslib, { Method, AxiosHeaders } from 'axios';
import { message } from 'antd';
import { isServer } from 'dist';

const DEFAULT_AXIOS_TIMEOUT = 15000;

export const axios = axioslib.create({
  timeout: DEFAULT_AXIOS_TIMEOUT
});

export interface BaseResult<T> {
  success: boolean;
  t: number;
  result: T;
  msg?: string;
}

function createFormData<F>(forData: F): FormData | null {
  if (!forData) {
    return null;
  }
  const data = new FormData();
  Object.entries(forData).forEach(([name, value]) => {
    data.append(name, value + '');
  });
  return data;
}

function pathReplace<P>(url: string, path: P): string {
  if (!path) {
    return url;
  }
  let nextApi = url;
  Object.entries(path).forEach(([name, value]) => {
    const encodedValue = encodeURIComponent(value + '');
    nextApi = nextApi.replace(`{${name}}`, encodedValue);
  });
  return nextApi;
}

export default async function ajax<P, Q, B, H extends AxiosHeaders | null, F, R>(
  method: Method,
  url: string,
  path: P,
  query: Q,
  body: B,
  headers: H,
  formData: F
): Promise<R> {
  const response = await (
    await axios({
      method,
      url: `/api${pathReplace(url, path)}`,
      params: query,
      data: body || createFormData(formData),
      headers: headers || undefined
    })
  ).data;
  if (!isServer && !response.success) {
    message.error("api异常");
  }
  return response;
}
