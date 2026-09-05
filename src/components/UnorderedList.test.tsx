import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import UnorderedList from "./UnorderedList";

describe("UnorderedList", () => {
  it("renders an item for each entry in items", () => {
    const items = ["a", "b", "c"];

    render(
      <UnorderedList
        items={items}
        renderListItem={(item) => <li key={item}>{item}</li>}
      />
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems.map((li) => li.textContent)).toEqual(["a", "b", "c"]);
  });

  it("calls renderListItem once per item", () => {
    const items = ["a", "b", "c"];
    const renderListItem = vi.fn((item) => <li key={item}>{item}</li>);

    render(
      <UnorderedList items={items} renderListItem={renderListItem} />
    );

    expect(renderListItem).toHaveBeenCalledTimes(3);
    expect(renderListItem).toHaveBeenNthCalledWith(1, "a", 0, items);
    expect(renderListItem).toHaveBeenNthCalledWith(2, "b", 1, items);
    expect(renderListItem).toHaveBeenNthCalledWith(3, "c", 2, items);
  });

  it("renders an empty list when items is empty", () => {
    render(
      <UnorderedList items={[]} renderListItem={(item) => <li key={String(item)}>{String(item)}</li>} />
    );

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("forwards className to the ul", () => {
    render(
      <UnorderedList
        items={["a"]}
        renderListItem={(item) => <li key={item}>{item}</li>}
        className="test-list"
      />
    );

    expect(document.querySelector(".test-list")).toBeTruthy();
  });

  it("forwards other props to the ul", () => {
    render(
      <UnorderedList
        items={["a"]}
        renderListItem={(item) => <li key={item}>{item}</li>}
        data-testid="my-list"
      />
    );

    expect(screen.getByTestId("my-list")).toBeTruthy();
  });
});
