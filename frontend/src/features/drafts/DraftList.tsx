type DraftItem = {
  id: string;
  title: string;
  status: "DRAFT" | "EXPORTED";
};

export default function DraftList({ drafts }: { drafts: DraftItem[] }) {
  return (
    <section>
      <ul>
        {drafts.map((draft) => (
          <li key={draft.id}>
            <span>{draft.title}</span>
            <span>{draft.status}</span>
            <button type="button">Export</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
