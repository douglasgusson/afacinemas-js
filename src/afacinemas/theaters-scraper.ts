import * as cheerio from 'cheerio';
import { AfaScraper } from './afa-scraper';
import { Theater } from './types';


export class TheatersScraper extends AfaScraper<Theater> {
  constructor() {
    super();
    this.url = `${this.baseUrl}cinemas.php`;
  }

  async extract (): Promise<Theater[]> {
    await this.loadContent();

    let theaters: Theater[] = [];
    const sections = this.$('section.cartazbreve');

    sections.each((_index, element) => {
      const $element = this.$(element);
      const id = this.getTheaterId($element);
      const name = this.getTheaterName($element);
      const imageLink = this.getImageLink($element);
      const city = this.getTheaterCity($element);

      theaters.push({ id, name, imageLink, city });
    });

    return theaters;
  }

  private getTheaterId (item: cheerio.Cheerio<cheerio.Element>) {
    const id = this.$(item).attr('property');
    return Number(id!);
  }

  private getTheaterName (item: cheerio.Cheerio<cheerio.Element>) {
    const name = this.$(item).attr('title');
    return name!;
  }

  private getImageLink (item: cheerio.Cheerio<cheerio.Element>) {
    const src = this.$(item)
      .find('img')
      .attr('src');
    return `${this.baseUrl}${src!}`
  }

  private getTheaterCity (item: cheerio.Cheerio<cheerio.Element>) {
    const city = this.$(item)
      .find('section.databreve p')
      .last()
      .text()
      .trim();
    return city;
  }
}
