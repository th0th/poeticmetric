import classNames from "classnames";
import React from "react";
import { Item, TableOfContentsItem } from "./Item";
import styles from "./List.module.scss";

export type ListProps = {
  allItems: Array<TableOfContentsItem>;
  items: Array<TableOfContentsItem>;
};

export function List({ allItems, items }: ListProps) {
  return (
    <ol className={classNames("fs-sm fw-medium ps-3", styles.list)}>
      {items.map((item) => (
        <Item allItems={allItems} key={`${item.parentId}-${item.id}`} {...item} />
      ))}
    </ol>
  );
}
