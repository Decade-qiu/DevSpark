import { render, screen } from "@testing-library/react";

import FeedCard from "../FeedCard";

describe("FeedCard", () => {
  it("renders summary and open action", () => {
    render(
      <FeedCard
        article={{
          title: "Post One",
          summary: "Short summary",
          source: "Example",
          time: "2h",
        }}
      />
    );

    expect(screen.getByText("Short summary")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open/i })).toBeInTheDocument();
  });
});
