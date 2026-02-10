type FeedArticle = {
  title: string;
  summary: string;
  source: string;
  time: string;
};

export default function FeedCard({ article }: { article: FeedArticle }) {
  return (
    <article aria-label={article.title}>
      <div>{article.source}</div>
      <div>{article.time}</div>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
      <button type="button">Open</button>
    </article>
  );
}
