import DOMPurify from "dompurify";

// RAWG descriptions are HTML written by its community, so they're cleaned of
// scripts, event handlers and the like before being rendered with v-html.
export const sanitizeHtml = (html: string | null | undefined) =>
  DOMPurify.sanitize(html ?? "");
