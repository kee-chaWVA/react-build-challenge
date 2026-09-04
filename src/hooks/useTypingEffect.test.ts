import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import { useTypingEffect } from "./useTypingEffect"

afterEach(() => {
  vi.useRealTimers();
});

const lines = [
  "This",
  "is",
  "Kee's",
  "React",
  "Build",
  "Challenge"
]

const charDelayTimer = 10;

describe("useTypingEffect", () => {
  it("should be empty on initial call", () => {
    const { result } = renderHook(() =>
      useTypingEffect(lines)
    )

    expect(result.current.visibleLines).toEqual([]);
    expect(result.current.currentLine).toBe("");
    expect(result.current.isDone).toBe(false);
  })

  it("returns the first char when typing has started", () => {
    const firstChar = lines[0][0]
    vi.useFakeTimers()
    const { result } = renderHook( () =>
      useTypingEffect(
        lines,
        {charDelayMs: 25}
      )
    );
    act(() => {
      vi.advanceTimersByTime(25)
    });

    expect(result.current.currentLine).toBe(firstChar);
    expect(result.current.visibleLines).toEqual([]);
    expect(result.current.isDone).toBe(false);
  })

  it("returns the first line to be vistible", () => {
    const firstWord = [lines[0]];
    vi.useFakeTimers();
    const { result } = renderHook(() => 
      useTypingEffect(
        lines,
        {charDelayMs: charDelayTimer}
      )
    )
    act(() => {
      vi.advanceTimersByTime(
        (lines[0].length * charDelayTimer) + charDelayTimer
      )
    });
    expect(result.current.visibleLines).toEqual(firstWord);
    expect(result.current.currentLine).toBe("");
    expect(result.current.isDone).toBe(false);
  })

  it("should clear timer and set isDone to true", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useTypingEffect(
        lines,
        {charDelayMs: charDelayTimer}
      )
    );
    act(() => {
      vi.runAllTimers()
    });

    expect(result.current.visibleLines.length).toEqual(lines.length)
    expect(result.current.currentLine).toBe("");
    expect(result.current.isDone).toBe(true);
  })

  it("does not start typing when start is false", () => {
    vi.useFakeTimers()
    const { result } = renderHook(() =>
      useTypingEffect(
        lines,
        {
          start: false,
          charDelayMs: 10
        }
      )
    );
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.visibleLines).toEqual([]);
    expect(result.current.currentLine).toBe("");
    expect(result.current.isDone).toBe(false);
  })

  it("does not start if no lines present", () => {
    vi.useFakeTimers();
    const emptyLines: string[] = [];
    const { result } = renderHook(() =>
      useTypingEffect(
        emptyLines,
        {
          start: true,
          charDelayMs: 10
        }
      )
    );
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.visibleLines).toEqual([]);
    expect(result.current.currentLine).toBe("");
    expect(result.current.isDone).toBe(false);
  })
})