import { useCallback } from "react";

type KeyboardNavigationParams<T> = {
  items: T[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onSelect: (item: T) => void;
  onEnter?: () => void;
};

export function useKeyboardNavigation<T>({
  items,
  activeIndex,
  setActiveIndex,
  onSelect,
  onEnter,
}: KeyboardNavigationParams<T>) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (activeIndex >= 0 && items[activeIndex]) {
          onSelect(items[activeIndex]);
        } else {
          onEnter?.();
        }

        return;
      }

      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev =>
          prev < items.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev =>
          prev > 0 ? prev - 1 : items.length - 1
        );
      }
    },
    [items, activeIndex, setActiveIndex, onSelect, onEnter]
  );
}
