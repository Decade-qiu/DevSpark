type FeedArticle = {
  title: string;
  summary: string;
  source: string;
  time: string;
};

export default function FeedCard({ article }: { article: FeedArticle }) {
  return (
    <article aria-label={article.title} className="card">
      <div className="card__meta">
        <span>{article.source}</span>
        <span>{article.time}</span>
      </div>
      <h3 className="card__title">{article.title}</h3>
      <p className="card__summary">{article.summary}</p>
      <div className="card__actions">
        <button className="button button--primary" type="button">
          Open
        </button>
        <button className="button button--ghost" type="button">
          Save
        </button>
      </div>
    </article>
  );
}
