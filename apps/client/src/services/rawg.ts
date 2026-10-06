import Api from "@/services/Api";
import type {
  Company,
  GameDetails,
  GameSummary,
  Genre,
  Movie,
  Paginated,
  QueryParams,
  Screenshot,
  StoreLink,
} from "@/types/rawg";

const api = Api();

const get = async <T>(
  url: string,
  params?: QueryParams,
  signal?: AbortSignal,
): Promise<T> => {
  const response = await api.get<T>(url, { params, signal });
  return response.data;
};

export const listGames = (params: QueryParams = {}, signal?: AbortSignal) =>
  get<Paginated<GameSummary>>("games", params, signal);

export const getGame = (id: number | string) => get<GameDetails>(`games/${id}`);

export const getScreenshots = (id: number | string) =>
  get<Paginated<Screenshot>>(`games/${id}/screenshots`);

export const getMovies = (id: number | string) =>
  get<Paginated<Movie>>(`games/${id}/movies`);

export const getStoreLinks = (id: number | string) =>
  get<Paginated<StoreLink>>(`games/${id}/stores`);

export const getGameSeries = (id: number | string) =>
  get<Paginated<GameSummary>>(`games/${id}/game-series`);

export const getAdditions = (id: number | string) =>
  get<Paginated<GameSummary>>(`games/${id}/additions`);

export const getDeveloper = (id: number | string) =>
  get<Company>(`developers/${id}`);

export const getPublisher = (id: number | string) =>
  get<Company>(`publishers/${id}`);

export const listGenres = () =>
  get<Paginated<Genre>>("genres", { page_size: 40 });
