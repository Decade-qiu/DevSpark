import { useState } from "react";

type ReaderArticle = {
  title: string;
  content: string;
  sourceUrl: string;
};

export default function ReaderEditor({ article }: { article: ReaderArticle }) {
  const [body, setBody] = useState("");

  const insertCitation = () => {
    setBody((current) =>
      current + `\n\n[source](${article.sourceUrl})`
    );
  };

  return (
    <section>
      <div>
        <h2>{article.title}</h2>
        <p>{article.content}</p>
      </div>
      <div>
        <button type="button" onClick={insertCitation}>
          Insert citation
        </button>
        <textarea
          aria-label="editor"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>
    </section>
  );
}
