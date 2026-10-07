import DOMPurify from "dompurify";

// RAWG descriptions are HTML written by its community, so they're cleaned of
// scripts, event handlers and the like before being rendered with v-html.
export const sanitizeHtml = (html: string | null | undefined) =>
  DOMPurify.sanitize(html ?? "");

// Only lets http(s) links from RAWG data through, so a `javascript:` URL can't
// end up in an href.
export const safeUrl = (url: string | null | undefined) => {
  if (!url) return undefined;
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
};
