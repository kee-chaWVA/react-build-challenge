import type { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}