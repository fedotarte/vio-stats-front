import Axios from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Custom instance for orval - matches fetch signature (url, options)
// Returns { data, status, headers } structure expected by generated types
export const customInstance = <T>(url: string, options?: RequestInit): Promise<T> => {
  const controller = new AbortController();

  const promise = AXIOS_INSTANCE({
    url,
    method: options?.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    headers: options?.headers as Record<string, string>,
    data: options?.body,
    signal: controller.signal,
  }).then((response) => ({
    data: response.data,
    status: response.status,
    headers: response.headers,
  })) as Promise<T>;

  // @ts-expect-error - adding cancel method to promise
  promise.cancel = () => {
    controller.abort();
  };

  return promise;
};

export default customInstance;
