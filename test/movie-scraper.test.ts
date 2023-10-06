import { MovieScraper } from '../src/afacinemas/movie-scraper';

describe('MovieScraper', () => {
  const movieId = 42; // The answer to life, the universe and everything
  const scraper = new MovieScraper(movieId);

  beforeEach(() => {
    scraper.httpClient = {
      get: jest.fn().mockResolvedValue(`
        <div class="brevehomefilmes">
          <section class="boxbrevefilme">
            <section class="cartazbreve2">
              <section>
                <img src="cartazSite/poster.jpg" />
              </section>
              <section class="databreve">
                <p class="icon-calendar">RELEASE_DATE</p>
              </section>
            </section>
            <section class="brevedadosfilme">
              <header class="filmeTitulo">
                <h1>MOVIE_TITLE</h1>
              </header>
              <img src="_img/16.png" itemprop="url" class="classificao" />
              <p><b>160 min </b></p>
              <p>
                <b>Sinopse:</b><br />
                MOVIE_DESCRIPTION
              </p>
              <p>
                <b>Trailer:</b><br />
                <iframe src="https://www.youtube.com/embed/WATCH_ID" class="frametrailer"></iframe>
              </p>
            </section>
          </section>
        </div>
      `),
    };
  });

  test('should extract movie data correctly', async () => {
    const release = await scraper.extract();

    expect(release.id).toBe(movieId);
    expect(release.posterUrl).toBe(
      'http://afacinemas.com.br/cartazSite/poster.jpg'
    );
    expect(release.title).toBe('MOVIE_TITLE');
    expect(release.releaseDate).toBe('RELEASE_DATE');
    expect(release.description).toBe('MOVIE_DESCRIPTION');
    expect(release.classification).toBe('16 ANOS');
    expect(release.duration).toBe('160 min');
    expect(release.trailerUrl).toBe('https://www.youtube.com/watch?v=WATCH_ID');
  });
});
