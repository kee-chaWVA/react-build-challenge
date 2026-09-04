import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useState } from "react"
import type { KeyboardEvent } from "react"
import { useKeyboardNavigation } from "./useKeyboardNavigation"

const items = ["Alpha", "Bravo", "Charlie"];

function keyEvent(key: string) {
  return { key, preventDefault: vi.fn() } as unknown as KeyboardEvent<HTMLElement>;
}

// The hook itself is state-agnostic — activeIndex/setActiveIndex are handed
// in by the caller — so the harness owns that state, the same way
// SearchPage/PokemonPage do.
function useHarness<T>(list: T[], onSelect: (item: T) => void, initialActiveIndex = -1) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const handleKeyDown = useKeyboardNavigation({
    items: list,
    activeIndex,
    setActiveIndex,
    onSelect,
  });
  return { activeIndex, handleKeyDown };
}

describe("useKeyboardNavigation", () => {
  it("selects the active item on Enter and prevents default", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, 1));
    const event = keyEvent("Enter");

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(onSelect).toHaveBeenCalledWith(items[1]);
    expect(event.preventDefault).toHaveBeenCalled();
  })

  it("does nothing on Enter when nothing is active", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, -1));

    act(() => {
      result.current.handleKeyDown(keyEvent("Enter"));
    });

    expect(onSelect).not.toHaveBeenCalled();
  })

  it("does nothing on Enter when activeIndex is out of bounds", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, items.length));

    act(() => {
      result.current.handleKeyDown(keyEvent("Enter"));
    });

    expect(onSelect).not.toHaveBeenCalled();
  })

  it("selects a falsy-but-valid item on Enter", () => {
    const falsyItems = ["", "Bravo"];
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(falsyItems, onSelect, 0));

    act(() => {
      result.current.handleKeyDown(keyEvent("Enter"));
    });

    expect(onSelect).toHaveBeenCalledWith("");
  })

  it("clears the active index on Escape", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, 2));

    act(() => {
      result.current.handleKeyDown(keyEvent("Escape"));
    });

    expect(result.current.activeIndex).toBe(-1);
  })

  it("jumps to the first item on Home", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, 2));
    const event = keyEvent("Home");

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(result.current.activeIndex).toBe(0);
    expect(event.preventDefault).toHaveBeenCalled();
  })

  it("jumps to the last item on End", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, 0));
    const event = keyEvent("End");

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(result.current.activeIndex).toBe(items.length - 1);
    expect(event.preventDefault).toHaveBeenCalled();
  })

  it("does not hijack Home/End when there are no items", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness<string>([], onSelect, -1));
    const homeEvent = keyEvent("Home");
    const endEvent = keyEvent("End");

    act(() => {
      result.current.handleKeyDown(homeEvent);
      result.current.handleKeyDown(endEvent);
    });

    expect(homeEvent.preventDefault).not.toHaveBeenCalled();
    expect(endEvent.preventDefault).not.toHaveBeenCalled();
    expect(result.current.activeIndex).toBe(-1);
  })

  it("moves down to the next item", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, 0));
    const event = keyEvent("ArrowDown");

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(result.current.activeIndex).toBe(1);
    expect(event.preventDefault).toHaveBeenCalled();
  })

  it("wraps to the first item when ArrowDown is pressed past the end", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, items.length - 1));

    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
    });

    expect(result.current.activeIndex).toBe(0);
  })

  it("moves up to the previous item", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, 2));
    const event = keyEvent("ArrowUp");

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(result.current.activeIndex).toBe(1);
    expect(event.preventDefault).toHaveBeenCalled();
  })

  it("wraps to the last item when ArrowUp is pressed before the start", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, 0));

    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowUp"));
    });

    expect(result.current.activeIndex).toBe(items.length - 1);
  })

  it("ignores arrow keys when there are no items", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness<string>([], onSelect, -1));

    act(() => {
      result.current.handleKeyDown(keyEvent("ArrowDown"));
      result.current.handleKeyDown(keyEvent("ArrowUp"));
    });

    expect(result.current.activeIndex).toBe(-1);
  })

  it("ignores unrelated keys", () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useHarness(items, onSelect, 1));
    const event = keyEvent("a");

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(result.current.activeIndex).toBe(1);
    expect(onSelect).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  })
})
