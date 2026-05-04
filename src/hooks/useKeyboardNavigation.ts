import { useCallback } from "react";

type KeyboardNavigationParams<T> = {
  items: T[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onSelect: (item: T) => void;
};

export function useKeyboardNavigation<T>({
  items,
  activeIndex,
  setActiveIndex,
  onSelect
}: KeyboardNavigationParams<T>) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter") {
        if (activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          onSelect(items[activeIndex]);
        }
        return;
      }
      
      if (e.key === "Escape") {
        setActiveIndex(-1);
        return;
      }
      
      if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
      }
      
      if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(items.length - 1);
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
    [items, activeIndex, setActiveIndex, onSelect]
  );
}
