import { compiler } from "markdown-to-jsx";
import { createElement, JSX, useContext, useMemo } from "react";
import MarkdownContext from "~/contexts/MarkdownContext";
import List from "./List";
import { TableOfContentsItem } from "./tableOfContentsItem";

export type TableOfContentsProps = {
  maxLevel?: Level;
};

type Heading = "h2" | "h3" | "h4" | "h5" | "h6";
type Level = 2 | 3 | 4 | 5 | 6;

const levels: Record<Heading, Level> = {
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

export default function TableOfContents({ maxLevel }: TableOfContentsProps) {
  const { content } = useContext(MarkdownContext);

  const items = useMemo(() => {
    const items: Array<TableOfContentsItem> = [];

    let previousItem: TableOfContentsItem | null = null;
    let previousLevel: number = 7;

    compiler(content, {
      createElement: (tag, props, children) => {
        if (isHeading(tag)) {
          const id = getHeadingId(props);

          if (id !== null && id !== "table-of-contents") {
            const level = levels[tag];

            if (maxLevel === undefined || level <= maxLevel) {
              const item: TableOfContentsItem = { id, level, parentId: null, title: children };

              if (level === previousLevel) {
                item.parentId = previousItem?.parentId || null;
              } else if (level > previousLevel) {
                item.parentId = previousItem?.id || null;
              } else {
                item.parentId = items.findLast((i) => i.level === level)?.parentId || null;
              }

              items.push(item);

              previousLevel = level;
              previousItem = item;
            }
          }
        }

        return createElement(tag, props, children);
      },
    });

    return items;
  }, [content, maxLevel]);

  const topItems = useMemo(() => items.filter((item) => item.parentId === null), [items]);

  return items.length > 0 ? (
    <>
      <div className="h2">Table of contents</div>

      <List allItems={items} className="d-inline-block mb-8" items={topItems} />
    </>
  ) : null;
}
