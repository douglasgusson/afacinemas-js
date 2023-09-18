interface IScraper<T = unknown> {
  loadContent (): Promise<void>;
  extract (): Promise<T[] | T>;
}

export abstract class BaseScraper<T = unknown> implements IScraper<T> {
  constructor(protected readonly baseUrl: string) { }
  abstract loadContent (): Promise<void>;
  abstract extract (): Promise<T | T[]>;
}
