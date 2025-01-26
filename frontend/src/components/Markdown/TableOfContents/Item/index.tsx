import React, { JSX, useMemo } from "react";
import { Link } from "wouter";
import List from "../List";
import { TableOfContentsItem } from "../tableOfContentsItem";

export type ItemProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements["li"]>, Overwrite<TableOfContentsItem, {
  allItems: Array<TableOfContentsItem>;
}>>;

export default function Item({ allItems, className, id, level: _, parentId: __, title, ...props }: ItemProps) {
  const childItems = useMemo<Array<TableOfContentsItem>>(() => allItems.filter((item) => item.parentId === id), [allItems, id]);

  return (
    <li {...props} className={className}>
      <Link to={`#${id}`}>{title}</Link>

      {childItems.length > 0 ? (
        <List allItems={allItems} items={childItems} />
      ) : null}
    </li>
  );
}
