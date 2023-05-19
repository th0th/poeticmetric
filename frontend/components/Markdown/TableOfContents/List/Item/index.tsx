import classNames from "classnames";
import React, { useMemo } from "react";
import { List } from "..";

export type TableOfContentsItem = {
  id: string;
  level: number;
  parentId: ItemProps["id"] | null;
  title: React.ReactNode;
};

export type ItemProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements["li"]>, Overwrite<TableOfContentsItem, {
  allItems: Array<TableOfContentsItem>;
}>>;

export function Item({ allItems, className, id, parentId: _, title, ...props }: ItemProps) {
  const childItems = useMemo<Array<TableOfContentsItem>>(() => allItems.filter((item) => item.parentId === id), [allItems, id]);

  return (
    <li {...props} className={classNames("py-1", className)}>
      <a href={`#${id}`}>{title}</a>

      {childItems.length > 0 ? (
        <List allItems={allItems} items={childItems} />
      ) : null}
    </li>
  );
}
