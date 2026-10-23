export function Badges({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-pill bg-sand-100 px-4 py-2 text-sm font-semibold">
          {item}
        </li>
      ))}
    </ul>
  );
}
