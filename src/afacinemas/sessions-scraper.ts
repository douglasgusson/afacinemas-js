import * as cheerio from 'cheerio';
import { AfaScraper } from './afa-scraper';
import { MovieWithSessions, Session } from './types';

export class SessionsScraper extends AfaScraper<MovieWithSessions> {
  constructor(
    private readonly theaterId: number,
    private readonly sessionsDate: string
  ) {
    super();
    this.url = `${this.baseUrl}acess_painel.php?idc=${this.theaterId}&dt=${this.sessionsDate}`;
    console.debug(this.url);
  }

  async extract(): Promise<MovieWithSessions[]> {
    await this.loadContent();

    const movies: MovieWithSessions[] = [];

    const sections = this.$('section.colfilmes');

    sections.each((_index, element) => {
      const $element = this.$(element);

      const id = this.getMovieId($element);
      const title = this.getMovieTitle($element);
      const posterUrl = this.getMoviePosterUrl($element);
      const classification = this.getMovieClassification($element);
      const duration = this.getMovieDuration($element);
      const description = this.getMovieDescription($element);
      const genre = this.getMovieGenre($element);
      const sessions = this.getMovieSessions($element);

      movies.push({
        id,
        title,
        posterUrl,
        classification,
        duration,
        description,
        genre,
        sessions,
      });
    });

    return movies as MovieWithSessions[];
  }

  private getMovieId(item: cheerio.Cheerio<cheerio.Element>) {
    const id = this.$(item).find('button.bsessao').attr('property');
    return Number(id!);
  }

  private getMovieTitle(item: cheerio.Cheerio<cheerio.Element>) {
    const title = this.$(item).find('h1').text().trim().slice(0, -7);
    return title!;
  }

  private getMoviePosterUrl(item: cheerio.Cheerio<cheerio.Element>) {
    const src = this.$(item).find('img').attr('src');
    return `${this.baseUrl}${src!}`;
  }

  private getMovieClassification(item: cheerio.Cheerio<cheerio.Element>) {
    let classification = this.$(item).find('img.classificao').attr('src');

    // Remove the extension
    classification = classification!.split('.').slice(0, -1).join('.');

    // Remove the path
    classification = classification!.split('/').slice(-1)[0];

    // Check if the classification is a number
    if (classification!.match(/^\d+$/)) {
      classification = `${classification} ANOS`;
    }

    return classification!.toUpperCase();
  }

  private getMovieDuration(item: cheerio.Cheerio<cheerio.Element>) {
    const duration = this.$(item)
      .find('p')
      .first()
      .text()
      .split(' - ')[0]
      .trim();
    return duration;
  }

  private getMovieGenre(item: cheerio.Cheerio<cheerio.Element>) {
    const genre = this.$(item).find('p').first().text().split(' - ')[1].trim();
    return genre;
  }

  private getMovieDescription(item: cheerio.Cheerio<cheerio.Element>) {
    const genre = this.$(item).find('p').last().text().trim();
    return genre;
  }

  private getMovieSessions(item: cheerio.Cheerio<cheerio.Element>) {
    const sessions: Session[] = [];

    const buttons = this.$(item).find('div.sessoesfilme button');

    buttons.each((_index, element) => {
      const $element = this.$(element);

      const room = this.getRoom($element);
      const time = this.getTime($element);
      const audio = this.getAudio($element);
      const image = this.getImage($element);

      sessions.push({ room, time, audio, image });
    });

    return sessions;
  }

  private getRoom(item: cheerio.Cheerio<cheerio.Element>) {
    const [room, roomNumber] = this.$(item)
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');
    return `${room} ${roomNumber}`;
  }

  private getTime(item: cheerio.Cheerio<cheerio.Element>) {
    const [, , time = ''] = this.$(item)
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');
    return time;
  }

  private getAudio(item: cheerio.Cheerio<cheerio.Element>) {
    const [, , , , attrs] = this.$(item)
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');

    const [audio] = attrs.split('/');

    return audio;
  }

  private getImage(item: cheerio.Cheerio<cheerio.Element>) {
    const [, , , , attrs] = this.$(item)
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');

    const [, image] = attrs.split('/');

    return image;
  }
}
