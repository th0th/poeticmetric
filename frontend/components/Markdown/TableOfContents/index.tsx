import { compiler } from "markdown-to-jsx";
import React, { useEffect, useState } from "react";
import { List } from "./List";
import { TableOfContentsItem } from "./List/Item";

export type TableOfContentsProps = {
  children: string;
};

type Heading = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const levels: Record<Heading, number> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
};

function isHeading(tag: any): tag is Heading {
  return typeof tag === "string" && ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag);
}

function getHeadingId(props: JSX.IntrinsicAttributes): string | null {
  const { id } = (props as { id?: string });

  return id === undefined ? null : id;
}

export function TableOfContents({ children }: TableOfContentsProps) {
  const [items, setItems] = useState<Array<TableOfContentsItem>>([]);

  useEffect(() => {
    const newItems: Array<TableOfContentsItem> = [];

    let previousItem: TableOfContentsItem | null = null;
    let previousLevel: number = 7;

    compiler(children, {
      createElement: (tag, props, children) => {
        if (isHeading(tag)) {
          const id = getHeadingId(props);

          if (id !== null) {
            const level = levels[tag];

            const item: TableOfContentsItem = { id, parentId: null, title: children };

            if (level === previousLevel) {
              item.parentId = previousItem?.parentId || null;
            } else if (level > previousLevel) {
              item.parentId = previousItem?.id || null;
            }

            newItems.push(item);

            previousLevel = level;
            previousItem = item;
          }
        }

        return React.createElement(tag, props, children);
      },
    });

    setItems(newItems);
  }, [children]);

  return items.length > 0 ? (
    <div className="border d-inline-flex flex-column mb-3 rounded pb-2 px-3 pt-3">
      <div className="fw-bold mb-2">Table of contents</div>

      <List allItems={items} items={items.filter((item) => item.parentId === null)} />
    </div>
  ) : null;
}
