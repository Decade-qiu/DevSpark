import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ReaderEditor from "../ReaderEditor";

describe("ReaderEditor", () => {
  it("inserts citation into editor", async () => {
    const user = userEvent.setup();
    render(
      <ReaderEditor
        article={{
          title: "Post One",
          content: "Line one",
          sourceUrl: "https://example.com/post-1",
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: /insert citation/i }));

    expect(screen.getByDisplayValue(/\[source\]\(https:\/\/example.com\/post-1\)/i)).toBeInTheDocument();
  });
});
