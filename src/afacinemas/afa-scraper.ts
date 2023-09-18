import * as cheerio from 'cheerio';
import { BaseScraper } from '../base/base-scraper';
import { IHttpClient, httpClient } from './http-client';

export abstract class AfaScraper<T = unknown> extends BaseScraper<T> {
  protected url: string = '';
  protected httpClient: IHttpClient = httpClient;
  protected $: cheerio.CheerioAPI = cheerio.load('');

  constructor() {
    super('http://afacinemas.com.br/');
  }

  async loadContent () {
    const content = await this.httpClient.get<string>(this.url);
    this.$ = cheerio.load(content);
  }

  abstract extract (): Promise<T | T[]>;
}
