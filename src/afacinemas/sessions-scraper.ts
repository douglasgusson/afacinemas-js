// class ScraperProgramacao(ScraperBase):
//     def __init__(self):
//         super().__init__()
//         self.url = self.base_url.format("acess_painel.php?idc={}&dt={}")

//     def _get_itens_programacao(
//         self, soup: BeautifulSoup
//     ) -> List[BeautifulSoup]:
//         return soup.find_all("section", {"class": "colfilmes"})

//     def _get_codigo_filme(self, soup: BeautifulSoup) -> str:
//         return soup.find("button", {"class": "bsessao"})["property"]

//     def _get_titulo_filme(self, soup: BeautifulSoup) -> str:
//         return soup.find("h1").text

//     def _get_url_capa(self, soup: BeautifulSoup) -> str:
//         return soup.find("img", {"itemprop": "image"})["src"]

//     def _get_classificacao(self, soup: BeautifulSoup) -> str:
//         image_path = soup.find("img", {"class": "classificao"})["src"]
//         classificacao = os.path.basename(image_path).split(".")[0]
//         if classificacao.isdigit():
//             return f"{classificacao} ANOS"
//         return classificacao.upper()

//     def _get_genero(self, soup: BeautifulSoup) -> str:
//         return soup.find("p").text.split(" - ")[1].strip()

//     def _get_duracao(self, soup: BeautifulSoup) -> str:
//         return soup.find("p").text.split(" - ")[0].strip()

//     def _get_sinopse(self, soup: BeautifulSoup) -> str:
//         return soup.find("p", {"class": "sinopse"}).text

//     def _get_sessao(self, soup: BeautifulSoup) -> Dict:
//         sessao = {}
//         sessao_data = soup.text.split()
//         sessao["sala"] = f"{sessao_data[0]} {sessao_data[1]}"
//         sessao["horario"] = sessao_data[2]
//         sessao["audio"] = sessao_data[4].split("/")[0]
//         sessao["imagem"] = sessao_data[4].split("/")[1]

//         return sessao

//     def _get_sessoes(self, soup: BeautifulSoup) -> List[Dict]:
//         sessoes = []
//         div_sessoes = soup.find("div", {"class": "sessoesfilme"})
//         bottoes_sessoes = div_sessoes.find_all("button")

//         for botao in bottoes_sessoes:
//             sessoes.append(self._get_sessao(botao))

//         return sessoes

//     def extract(self, id_cinema: int, data_programacao: str) -> List[Dict]:
//         try:
//             self.url = self.url.format(id_cinema, data_programacao)
//             soup = self._get_soup()
//             itens = self._get_itens_programacao(soup)
//             programacoes = []

//             for item in itens:
//                 programacao_filme = {}
//                 programacao_filme["codigo"] = self._get_codigo_filme(item)
//                 programacao_filme["titulo"] = self._get_titulo_filme(item)
//                 programacao_filme["url_capa"] = self.base_url.format(
//                     self._get_url_capa(item)
//                 )
//                 programacao_filme["classificacao"] = self._get_classificacao(
//                     item
//                 )
//                 programacao_filme["genero"] = self._get_genero(item)
//                 programacao_filme["duracao"] = self._get_duracao(item)
//                 programacao_filme["sinopse"] = self._get_sinopse(item)
//                 programacao_filme["sessoes"] = self._get_sessoes(item)

//                 programacoes.append(programacao_filme)

//             return programacoes
//         except TypeError:
//             return []

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

  async extract (): Promise<MovieWithSessions[]> {
    await this.loadContent();

    let movies: unknown[] = [];

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
        sessions
      });
    });


    return movies as MovieWithSessions[];
  }

  private getMovieId (item: cheerio.Cheerio<cheerio.Element>) {
    const id = this.$(item).find('button.bsessao').attr('property');
    return Number(id!);
  }

  private getMovieTitle (item: cheerio.Cheerio<cheerio.Element>) {
    const title = this.$(item)
      .find('h1')
      .text()
      .trim()
      .slice(0, -7);
    return title!;
  }

  private getMoviePosterUrl (item: cheerio.Cheerio<cheerio.Element>) {
    const src = this.$(item).find('img').attr('src');
    return `${this.baseUrl}${src!}`
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
      .find('p')
      .first()
      .text()
      .split(' - ')[0]
      .trim();
    return duration;
  }

  private getMovieGenre (item: cheerio.Cheerio<cheerio.Element>) {
    const genre = this.$(item)
      .find('p')
      .first()
      .text()
      .split(' - ')[1]
      .trim();
    return genre;
  }

  private getMovieDescription (item: cheerio.Cheerio<cheerio.Element>) {
    const genre = this.$(item)
      .find('p')
      .last()
      .text()
      .trim();
    return genre;
  }

  private getMovieSessions (item: cheerio.Cheerio<cheerio.Element>) {
    let sessions: Session[] = [];

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

  private getRoom (item: cheerio.Cheerio<cheerio.Element>) {
    const [room, roomNumber] = this.$(item)
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');
    return `${room} ${roomNumber}`;
  }

  private getTime (item: cheerio.Cheerio<cheerio.Element>) {
    const [, , time = ""] = this.$(item)
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');
    return time;
  }

  private getAudio (item: cheerio.Cheerio<cheerio.Element>) {
    const [, , , , attrs] = this.$(item)
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');

    const [audio] = attrs.split('/');

    return audio;
  }

  private getImage (item: cheerio.Cheerio<cheerio.Element>) {
    const [, , , , attrs] = this.$(item)
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ');

    const [, image] = attrs.split('/');

    return image;
  }
}