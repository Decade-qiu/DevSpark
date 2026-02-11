import AppShell from "../../src/components/AppShell";
import ThemeToggle from "../../src/components/ThemeToggle";
import DraftList from "../../src/features/drafts/DraftList";

const drafts = [
  { id: "draft-1", title: "Weekly roundup", status: "DRAFT" as const },
  { id: "draft-2", title: "Design systems notes", status: "EXPORTED" as const },
];

export default function DraftsPage() {
  return (
    <AppShell
      toolbar={
        <>
          <div className="toolbar__brand">DevSpark</div>
          <div className="toolbar__actions">
            <input
              className="input toolbar__search"
              placeholder="Search drafts"
              aria-label="Search"
            />
            <ThemeToggle />
            <button className="button button--primary" type="button">
              New draft
            </button>
          </div>
        </>
      }
      sidebar={
        <>
          <h3 className="panel__title">Templates</h3>
          <div className="list">
            <div className="list__item">
              <span>Tweet thread</span>
              <span className="muted">3</span>
            </div>
            <div className="list__item">
              <span>Blog outline</span>
              <span className="muted">5</span>
            </div>
          </div>
        </>
      }
      main={<DraftList drafts={drafts} />}
      detail={
        <>
          <h3 className="panel__title">Export</h3>
          <p className="muted">
            Select a draft to preview and export Markdown with citations.
          </p>
          <button className="button button--primary" type="button">
            Export markdown
          </button>
        </>
      }
    />
  );
}
