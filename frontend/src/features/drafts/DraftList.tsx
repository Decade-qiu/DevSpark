type DraftItem = {
  id: string;
  title: string;
  status: "DRAFT" | "EXPORTED";
};

export default function DraftList({ drafts }: { drafts: DraftItem[] }) {
  return (
    <section>
      <h3 className="panel__title">Drafts</h3>
      <ul className="draft-list">
        {drafts.map((draft) => (
          <li key={draft.id} className="draft-item">
            <div className="draft-meta">
              <span>{draft.title}</span>
              <span className="draft-status">{draft.status}</span>
            </div>
            <button className="button button--primary" type="button">
              Export
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
