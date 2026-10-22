/** Renders `text` with `word` in <em> (italic orange), following the title style of the site. */
export function Highlight({ text, word }: { text: string; word?: string }) {
  if (!word || !text.includes(word)) return text;
  const at = text.indexOf(word);
  return (
    <>
      {text.slice(0, at)}
      <em>{word}</em>
      {text.slice(at + word.length)}
    </>
  );
}
