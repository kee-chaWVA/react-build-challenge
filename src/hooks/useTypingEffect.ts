// src/hooks/useTypingEffect.ts
import { useEffect, useRef, useState } from "react";

type TypingState = {
  /** Completed lines that are fully typed */
  visibleLines: string[];
  /** The line currently being typed (partial text) */
  currentLine: string;
  /** True when all lines are fully typed */
  isDone: boolean;
};

/**
 * Types out an array of lines, one character at a time.
 * Resets automatically when `lines` changes.
 */
export function useTypingEffect(
  lines: string[],
  options?: {
    charDelayMs?: number;   // speed per character
    lineDelayMs?: number;   // pause between lines
    start?: boolean;        // allow caller to start/stop typing
  }
): TypingState {
  const charDelayMs = options?.charDelayMs ?? 35;
  const lineDelayMs = options?.lineDelayMs ?? 250;
  const start = options?.start ?? true;

  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [isDone, setIsDone] = useState(false);

  // internal indexes that don't cause re-renders
  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  // Reset whenever the content changes
  useEffect(() => {
    setVisibleLines([]);
    setCurrentLine("");
    setIsDone(false);
    lineIndexRef.current = 0;
    charIndexRef.current = 0;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [lines]);

  useEffect(() => {
    if (!start) return;
    if (lines.length === 0) return;

    const tick = () => {
      const lineIndex = lineIndexRef.current;

      // finished all lines
      if (lineIndex >= lines.length) {
        setIsDone(true);
        return;
      }

      const fullLine = lines[lineIndex];
      const charIndex = charIndexRef.current;

      // type next character
      if (charIndex < fullLine.length) {
        const nextText = fullLine.slice(0, charIndex + 1);
        setCurrentLine(nextText);
        charIndexRef.current = charIndex + 1;

        timeoutRef.current = window.setTimeout(tick, charDelayMs);
        return;
      }

      // line complete → commit it and move to next
      setVisibleLines((prev) => [...prev, fullLine]);
      setCurrentLine("");
      lineIndexRef.current = lineIndex + 1;
      charIndexRef.current = 0;

      timeoutRef.current = window.setTimeout(tick, lineDelayMs);
    };

    // start typing loop
    timeoutRef.current = window.setTimeout(tick, charDelayMs);

    // cleanup on unmount or when start/lines change
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [start, lines, charDelayMs, lineDelayMs]);

  return { visibleLines, currentLine, isDone };
}