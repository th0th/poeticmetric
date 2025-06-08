import React, { JSX, useMemo } from "react";
import List from "../List"; // eslint-disable-line @typescript-eslint/no-restricted-imports
import { TableOfContentsItem } from "../tableOfContentsItem"; // eslint-disable-line @typescript-eslint/no-restricted-imports

export type ItemProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements["li"]>, Overwrite<TableOfContentsItem, {
  allItems: Array<TableOfContentsItem>;
}>>;

export default function Item({ allItems, className, id, level: _, parentId: __, title, ...props }: ItemProps) {
  const childItems = useMemo<Array<TableOfContentsItem>>(() => allItems.filter((item) => item.parentId === id), [allItems, id]);

  return (
    <li {...props} className={className}>
      <a href={`#${id}`}>{title}</a>

      {childItems.length > 0 ? (
        <List allItems={allItems} items={childItems} />
      ) : null}
    </li>
  );
}
