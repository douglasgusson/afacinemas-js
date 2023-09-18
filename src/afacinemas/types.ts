export type Theater = {
  id: number;
  name: string;
  imageLink: string;
  city: string;
};

export type Movie = {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  classification: string;
  duration: string;
}

export type Release = Movie & {
  releaseDate: string;
  trailerUrl: string;
}

export type Session = {
  room: string;
  time: string;
  audio: string;
  image: string;
}

export type MovieWithSessions = Movie & {
  genre: string;
  sessions: Session[];
}
