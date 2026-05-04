import { useEffect, useState } from "react";

type TypingTextProps = {
  lines: string[];
  speed?: number;
};

export function TypingText({ lines, speed = 35 }: TypingTextProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let interval: number;

    function type() {
      if (lineIndex >= lines.length) return;

      const line = lines[lineIndex];
      setCurrentText(line.slice(0, charIndex + 1));
      charIndex++;

      if (charIndex === line.length) {
        setVisibleLines(prev => [...prev, line]);
        setCurrentText("");
        charIndex = 0;
        lineIndex++;
      }
    }

    interval = window.setInterval(type, speed);
    return () => clearInterval(interval);
  }, [lines, speed]);

  return (
    <pre className="typing-text">
      {visibleLines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      {currentText && <div>{currentText}</div>}
    </pre>
  );
}