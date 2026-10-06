const DAY_MS = 24 * 60 * 60 * 1000;

// RAWG's CDN can serve resized images, which are a fraction of the size of
// the originals used for card thumbnails.
export const resizedImage = (url: string | null | undefined, width = 640) => {
  if (!url) return undefined;
  return url.replace(
    /media\.rawg\.io\/media\/(games|screenshots)\//,
    `media.rawg.io/media/resize/${width}/-/$1/`,
  );
};

// Formats a date as YYYY-MM-DD, the format RAWG expects in `dates`.
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * DAY_MS);

export const formatDate = (value: string | null | undefined) => {
  if (!value) return "TBA";
  return new Date(value).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const daysUntil = (value: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round(
    (new Date(`${value}T00:00:00`).getTime() - today.getTime()) / DAY_MS,
  );
};

export const releaseCountdown = (value: string | null | undefined) => {
  if (!value) return "TBA";
  const days = daysUntil(value);
  if (days < 0) return "Out now";
  if (days === 0) return "Out today";
  if (days === 1) return "Tomorrow";
  if (days < 60) return `In ${days} days`;
  return `In ${Math.round(days / 30)} months`;
};

export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
