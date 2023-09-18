import * as cheerio from 'cheerio';
import { AfaScraper } from './afa-scraper';
import { Movie, Release } from './types';

export class MovieScraper extends AfaScraper<Movie> {
  constructor(private readonly movieId: number) {
    super();
    this.url = `${this.baseUrl}filmes.php?idf=${this.movieId}`;
    console.log(this.url);
  }

  async extract (): Promise<Release> {
    await this.loadContent();

    const section = this.$('section.boxbrevefilme');

    const id = this.movieId;
    const posterUrl = this.getMoviePosterUrl(section);
    const title = this.getMovieTitle(section);
    const releaseDate = this.getMovieReleaseDate(section);
    const description = this.getMovieDescription(section);
    const classification = this.getMovieClassification(section);
    const duration = this.getMovieDuration(section);
    const trailerUrl = this.getTrailerUrl(section);

    return { id, posterUrl, title, releaseDate, description, classification, duration, trailerUrl };
  }

  private getMoviePosterUrl (item: cheerio.Cheerio<cheerio.Element>) {
    const src = this.$(item)
      .find('img')
      .attr('src');
    return `${this.baseUrl}${src!}`
  }

  private getMovieTitle (item: cheerio.Cheerio<cheerio.Element>) {
    const title = this.$(item)
      .find('h1')
      .text();
    return title!;
  }

  private getMovieReleaseDate (item: cheerio.Cheerio<cheerio.Element>) {
    const releaseDate = this.$(item)
      .find('section.databreve')
      .text()
      .trim();
    return releaseDate;
  }

  private getMovieDescription (item: cheerio.Cheerio<cheerio.Element>) {
    // Sinopse is the second <p> element inside section.brevedadosfilme
    let description = this.$(item)
      .find('section.brevedadosfilme p')
      .eq(1)
      .text()
      .trim();

    // Remove extra spaces
    description = description
      .replace(/\s+/g, ' ')
      .replace("Sinopse: ", "");

    return description;
  }

  private getMovieClassification (item: cheerio.Cheerio<cheerio.Element>) {
    let classification = this.$(item)
      .find('img.classificao')
      .attr('src');

    // Remove the extension
    classification = classification!
      .split('.')
      .slice(0, -1)
      .join('.');
    
    // Remove the path
    classification = classification!
      .split('/')
      .slice(-1)[0];
    
    // Check if the classification is a number
    if (classification!.match(/^\d+$/)) {
      classification = `${classification} ANOS`;
    }
    
    return classification!.toUpperCase();
  }

  private getMovieDuration (item: cheerio.Cheerio<cheerio.Element>) {
    const duration = this.$(item)
      .find('section.brevedadosfilme p')
      .first()
      .text();
    return duration!;
  }

  private getTrailerUrl (item: cheerio.Cheerio<cheerio.Element>) {
    let trailerUrl = this.$(item)
      .find('iframe.frametrailer')
      .attr('src') || '';

    // convert from embed to watch
    trailerUrl = trailerUrl.replace('embed/', 'watch?v=');

    return trailerUrl;
  }
}