import {
  ReleasesScraper,
  SessionsScraper,
  TheatersScraper,
  MovieScraper,
} from './afacinemas';
export type { Movie, Release, Theater } from './afacinemas/types';

export const getTheaters = async () => {
  const scraper = new TheatersScraper();
  const theaters = await scraper.extract();
  return theaters;
};

export const getReleases = async () => {
  const scraper = new ReleasesScraper();
  const releases = await scraper.extract();
  return releases;
};

/**
 * @param theaterId
 * @param sessionsDate format: YYYY-MM-DD
 */
export const getSessions = async (theaterId: number, sessionsDate: string) => {
  const scraper = new SessionsScraper(theaterId, sessionsDate);
  const sessions = await scraper.extract();
  return sessions;
};

/**
 * @param id Movie ID
 */
export const getMovie = async (id: number) => {
  const movieScraper = new MovieScraper(id);
  const movie = movieScraper.extract();
  return movie;
};
