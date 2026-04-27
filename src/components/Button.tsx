import type { ReactNode } from 'react'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  children: ReactNode;
  onClick?: () => void;
};

export default function Button({ type, children, onClick }: ButtonProps) {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
}