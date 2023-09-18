import Axios, { AxiosInstance } from 'axios';
import { setupCache } from 'axios-cache-interceptor';

export interface IHttpClient {
  get: <T>(url: string) => Promise<T>;
}

export class HttpClient implements IHttpClient {
  constructor(
    private readonly httpClient: AxiosInstance
  ) {}

  async get<T = unknown>(url: string): Promise<T> {
    const { data } = await this.httpClient.get(url);
    return data as T;
  }
}

export const httpClient = new HttpClient(
  setupCache(Axios)
);
