import type { ReactNode } from "react";
import "../styles/SearchControl.css";

type SearchControlProps<T> = {
  /** Visible label text (used by screen readers if label is visually hidden) */
  label: string;

  /** Input + listbox IDs for ARIA linking */
  inputId: string;
  listboxId: string;

  /** Controlled input value + handlers */
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;

  /** Suggestion items + active index */
  items: T[];
  activeIndex: number;

  /** Must return a unique DOM id for each option (used for aria-activedescendant) */
  getOptionId: (item: T) => string;

  /** Render the visible option content */
  renderOption: (item: T) => ReactNode;

  /** Called when user selects an option (mouse down) */
  onSelect: (item: T) => void;

  /** Right-side action, usually your <Button> */
  action: ReactNode;

  /** Optional */
  placeholder?: string;
  autoComplete?: string;
  className?: string;
};

export default function SearchControl<T>({
  label,
  inputId,
  listboxId,
  value,
  onChange,
  onKeyDown,
  items,
  activeIndex,
  getOptionId,
  renderOption,
  onSelect,
  action,
  placeholder,
  autoComplete = "off",
  className,
}: SearchControlProps<T>) {
  const isOpen = Boolean(value.trim() && items.length > 0);

  return (
    <section className={`search-control ${isOpen ? "has-suggestions" : ""} ${className ?? ""}`}>
      <div className="search-input-group">
        <label htmlFor={inputId} className="visually-hidden">
          {label}
        </label>

        <div className="search-input-wrapper">
          <input
            id={inputId}
            className="search-input"
            type="search"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoComplete={autoComplete}
            placeholder={placeholder}
            aria-controls={listboxId}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-activedescendant={
              activeIndex >= 0 && items[activeIndex]
                ? getOptionId(items[activeIndex])
                : undefined
            }
          />

          <ul
            id={listboxId}
            className={`search-suggestions ${isOpen ? "is-open" : ""}`}
            role="listbox"
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const optionId = getOptionId(item);

              return (
                <li
                  key={optionId}
                  id={optionId}
                  role="option"
                  aria-selected={isActive}
                  className={isActive ? "active" : undefined}
                  onMouseDown={() => onSelect(item)}
                >
                  {renderOption(item)}
                </li>
              );
            })}
          </ul>
        </div>

        {action}
      </div>
    </section>
  );
}