import type { ReactNode } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type UnorderedListProps<T> = {
  items: T[]
  /**
   * Must return an <li> as the top-level element.
   * This component does not wrap items in <li>.
   */
  renderListItem: (item: T, index: number) => ReactNode
} & ComponentPropsWithoutRef<'ul'>

export default function UnorderedList<T>({ items, renderListItem, className, ...rest  }: UnorderedListProps<T>) {
  return (
    <ul className={className} {...rest}>
      {items.map(renderListItem)}
    </ul>
  )
}