import classNames from "classnames";
import React from "react";
import { Item, TableOfContentsItem } from "./Item";
import styles from "./List.module.scss";

export type ListProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements["ol"]>, {
  allItems: Array<TableOfContentsItem>;
  items: Array<TableOfContentsItem>;
}>;

export function List({ allItems, className, items, ...props }: ListProps) {
  return (
    <ol {...props} className={classNames("fs-sm fw-medium ps-3", styles.list, className)}>
      {items.map((item) => (
        <Item allItems={allItems} key={`${item.parentId}-${item.id}`} {...item} />
      ))}
    </ol>
  );
}
