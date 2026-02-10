import { render, screen } from "@testing-library/react";

import DraftList from "../DraftList";

describe("DraftList", () => {
  it("shows export action", () => {
    render(
      <DraftList
        drafts={[{ id: "draft-1", title: "Hello", status: "DRAFT" }]}
      />
    );

    expect(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });
});
