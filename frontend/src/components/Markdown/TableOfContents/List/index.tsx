import classNames from "classnames";
import React, { JSX } from "react";
import Item from "../Item"; // eslint-disable-line @typescript-eslint/no-restricted-imports
import { TableOfContentsItem } from "../tableOfContentsItem"; // eslint-disable-line @typescript-eslint/no-restricted-imports

export type ListProps = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements["ol"]>, {
  allItems: Array<TableOfContentsItem>;
  items: Array<TableOfContentsItem>;
}>;

export default function List({ allItems, className, items, ...props }: ListProps) {
  return (
    <ol {...props} className={classNames("fw-medium m-0", className)}>
      {items.map((item) => (
        <Item allItems={allItems} key={`${item.parentId}-${item.id}`} {...item} />
      ))}
    </ol>
  );
}
