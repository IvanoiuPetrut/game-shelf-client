// Shapes of the RAWG API responses, trimmed to the fields the app uses.

export interface NamedRef {
  id: number;
  name: string;
  slug: string;
}

export interface PlatformRef {
  platform: NamedRef;
}

export interface StoreRef {
  id: number;
  store: NamedRef & { domain?: string };
}

export interface ShortScreenshot {
  id: number;
  image: string;
}

export interface RatingBucket {
  id: number;
  title: "exceptional" | "recommended" | "meh" | "skip";
  count: number;
  percent: number;
}

export interface GameSummary {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  tba: boolean;
  background_image: string | null;
  rating: number;
  ratings_count: number;
  metacritic: number | null;
  playtime: number;
  genres: NamedRef[];
  platforms: PlatformRef[] | null;
  stores: StoreRef[] | null;
  short_screenshots?: ShortScreenshot[];
  ratings?: RatingBucket[];
  esrb_rating?: NamedRef | null;
}

export interface GameDetails extends GameSummary {
  description: string;
  background_image_additional: string | null;
  website: string;
  developers: NamedRef[];
  publishers: NamedRef[];
  tags: NamedRef[];
  ratings: RatingBucket[];
}

// The few fields a game card needs, so cards can render both RAWG results and
// games saved on the shelf.
export type GameBasics = Pick<
  GameSummary,
  "id" | "slug" | "name" | "background_image" | "metacritic" | "released"
> & {
  genres: NamedRef[];
  playtime?: number;
};

export interface Screenshot {
  id: number;
  image: string;
  width: number;
  height: number;
}

export interface Movie {
  id: number;
  name: string;
  preview: string;
  data: { "480": string; max: string };
}

export interface StoreLink {
  id: number;
  game_id: number;
  store_id: number;
  url: string;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string | null;
  description: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;
