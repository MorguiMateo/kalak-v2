/** Minimal rich text for page content: plain strings plus bold/accent runs. */
export type Inline = string | { b: string } | { accent: string };
export type Block =
  | { p: Inline[] }
  | { ul: Inline[][] }
  | { ol: { title: string; items: string[] }[] };
