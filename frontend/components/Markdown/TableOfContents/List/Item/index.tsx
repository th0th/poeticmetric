import React, { useMemo } from "react";
import { List } from "..";

export type TableOfContentsItem = {
  id: string;
  parentId: ItemProps["id"] | null;
  title: React.ReactNode;
};

export type ItemProps = Overwrite<TableOfContentsItem, {
  allItems: Array<TableOfContentsItem>;
}>;

export function Item({ allItems, id, title }: ItemProps) {
  const childItems = useMemo<Array<TableOfContentsItem>>(() => allItems.filter((item) => item.parentId === id), [allItems, id]);

  return (
    <li>
      <a className="d-block py-1" href={`#${id}`}>{title}</a>

      {childItems.length > 0 ? (
        <List allItems={allItems} items={childItems} />
      ) : null}
    </li>
  );
}
