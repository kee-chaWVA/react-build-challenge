import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useTypingEffect } from "./useTypingEffect"
import type { UseTypingEffectOptions } from "./useTypingEffect"

const lines = [
  "This",
  "is",
  "Kee's",
  "React",
  "Build",
  "Challenge"
]

const charDelayMs = 10;

type Props = { lines: string[]; options?: UseTypingEffectOptions };

function renderTyping(initialLines: string[] = lines, options?: UseTypingEffectOptions) {
  return renderHook(
    ({ lines, options }: Props) => useTypingEffect(lines, options),
    { initialProps: { lines: initialLines, options: { charDelayMs, ...options } } }
  );
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function expectIdle(result: { current: ReturnType<typeof useTypingEffect> }) {
  expect(result.current.visibleLines).toEqual([]);
  expect(result.current.currentLine).toBe("");
  expect(result.current.isDone).toBe(false);
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useTypingEffect", () => {
  it("is empty before any time has passed", () => {
    const { result } = renderTyping();

    expectIdle(result);
  })

  it("types the first character after charDelayMs", () => {
    const { result } = renderTyping();
    advance(charDelayMs);

    expect(result.current.currentLine).toBe(lines[0][0]);
    expect(result.current.visibleLines).toEqual([]);
    expect(result.current.isDone).toBe(false);
  })

  it("commits the first line to visibleLines once it's fully typed", () => {
    const { result } = renderTyping();
    advance((lines[0].length * charDelayMs) + charDelayMs);

    expect(result.current.visibleLines).toEqual([lines[0]]);
    expect(result.current.currentLine).toBe("");
    expect(result.current.isDone).toBe(false);
  })

  it("marks isDone once every line has been typed", () => {
    const { result } = renderTyping();
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.visibleLines).toEqual(lines);
    expect(result.current.currentLine).toBe("");
    expect(result.current.isDone).toBe(true);
  })

  it("does not type when start is false", () => {
    const { result } = renderTyping(lines, { start: false });
    act(() => {
      vi.runAllTimers();
    });

    expectIdle(result);
  })

  it("does not type when there are no lines", () => {
    const { result } = renderTyping([]);
    act(() => {
      vi.runAllTimers();
    });

    expectIdle(result);
  })

  it("pauses and resumes without losing progress", () => {
    const { result, rerender } = renderTyping(lines, { start: true });
    advance(charDelayMs); // types "T"

    rerender({ lines, options: { charDelayMs, start: false } });
    advance(charDelayMs * 5); // paused: nothing should happen

    expect(result.current.currentLine).toBe(lines[0][0]);

    rerender({ lines, options: { charDelayMs, start: true } });
    advance(charDelayMs); // resumes from where it left off, doesn't restart

    expect(result.current.currentLine).toBe(lines[0].slice(0, 2));
  })

  it("keeps typing progress when `lines` is a new array with the same contents", () => {
    const { result, rerender } = renderTyping([...lines]);
    advance(charDelayMs);
    expect(result.current.currentLine).toBe(lines[0][0]);

    // A fresh array, same contents — mirrors callers that rebuild `lines`
    // inline every render (e.g. PokedexDisplay). Should not reset.
    rerender({ lines: [...lines], options: { charDelayMs } });
    advance(charDelayMs);

    expect(result.current.currentLine).toBe(lines[0].slice(0, 2));
  })

  it("resets progress when line content actually changes", () => {
    const { result, rerender } = renderTyping(lines);
    advance(charDelayMs);
    expect(result.current.currentLine).toBe(lines[0][0]);

    rerender({ lines: ["Different"], options: { charDelayMs } });

    expectIdle(result);
  })
})
