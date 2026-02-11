"use client";

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
    <section className="panel">
      <div className="reader">
        <div className="reader__content">
          <h2>{article.title}</h2>
          <p className="muted">{article.content}</p>
        </div>
        <div className="reader__editor">
          <div className="reader__toolbar">
            <h3>Draft</h3>
            <button className="button button--primary" type="button" onClick={insertCitation}>
              Insert citation
            </button>
          </div>
          <textarea
            className="textarea"
            aria-label="editor"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
