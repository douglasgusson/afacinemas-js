import * as cheerio from 'cheerio';
import { AfaScraper } from './afa-scraper';
import { MovieScraper } from './movie-scraper';
import { Release } from './types';

export class ReleasesScraper extends AfaScraper<Release> {
  constructor() {
    super();
    this.url = `${this.baseUrl}breve_filmes.php`;
  }

  async extract (): Promise<Release[]> {
    await this.loadContent();

    let ids: number[] = [];
    const sections = this.$('section.cartazbreve');

    sections.each((_index, element) => {
      const $element = this.$(element);
      const id = this.getReleaseId($element);
      ids.push(id);
    });

    const releases = await Promise.all(ids.map(id => {
      const movieScraper = new MovieScraper(id);
      const movie = movieScraper.extract()
      return movie
    }));
    
    return releases;
  }

  private getReleaseId (item: cheerio.Cheerio<cheerio.Element>) {
    const id = this.$(item).attr('property');
    return Number(id!);
  }
}