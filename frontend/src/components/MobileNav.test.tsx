import { render, screen } from "@testing-library/react";
import React from "react";

import MobileNav from "./MobileNav";

test("menu button uses type=button", () => {
  render(
    <form onSubmit={(event) => event.preventDefault()}>
      <MobileNav isOpen={false} onToggle={() => {}} title="Menu" />
    </form>
  );

  const button = screen.getByRole("button", { name: /toggle menu/i });
  expect(button).toHaveAttribute("type", "button");
});

test("restores body overflow style when menu closes", () => {
  document.body.style.overflow = "clip";

  const { rerender } = render(
    <MobileNav isOpen={true} onToggle={() => {}} title="Menu" />
  );

  expect(document.body.style.overflow).toBe("hidden");

  rerender(<MobileNav isOpen={false} onToggle={() => {}} title="Menu" />);

  expect(document.body.style.overflow).toBe("clip");
});
