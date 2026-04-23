import {JSX, ReactNode, useState} from "react";
import Button from "./Button.tsx";
import type {Quote} from "../types/quote.ts";

type QuoteProps = {
  initialValue?: string;
  onSubmit: (quote: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function QuoteInput(props: {
  initialValue='',
  onSubmit,
  onCancel,
  submitLabel = 'Save'
}: QuoteProps): JSX.Element {
  const [value, setValue] = useState<Quote | null>(initialValue);
  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  }
  return (
    <div>

    </div>
  )
}