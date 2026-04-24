import type { ReactNode } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type ListProps<T> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
} & ComponentPropsWithoutRef<'ul'>

export default function List<T>({ items, renderItem, className, ...rest  }: ListProps<T>) {
  return (
    <ul className={className} {...rest}>
      {items.map(renderItem)}
    </ul>
  )
}