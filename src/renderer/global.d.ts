export interface SearchShow {
  adult: boolean
  backdrop_path: string
  first_air_date: string
  genre_ids: number[]
  id: number
  name: string
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: string
  poster_path: string
  vote_average: number
  vote_count: number
}

export interface SearchShowResponse {
  page: number
  total_pages: number
  total_results: number
  results: SearchShow[]
}

export interface Episode {
  name: string
  air_date: string
  episode_number: string
  season: number
}

export interface MissingEpisodesResponse {
  status: string
  result: Episode[]
  showName: string
}

export interface Missing {
  showName: string
  missing: Episode[]
}

export interface GenericObject {
  [key: string]: unknown;
}

export interface Show extends GenericObject {
  image: string;
  id: string;
}

export interface Shows {
  [key: string]: Show;
}