import { compiler } from "markdown-to-jsx";
import React, { useEffect, useState } from "react";

type Item = {
  children: React.ReactNode;
  id: string;
  items: Array<Item>;
};

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
  const [items, setItems] = useState<Array<Item>>([]);

  useEffect(() => {
    const newItems: Array<Item> = [];

    let previousLevel: number = 6;

    compiler(children, {
      createElement: (tag, props, children) => {
        if (isHeading(tag)) {
          const id = getHeadingId(props);

          if (id !== null) {
            const level = levels[tag];

            const item: Item = { children, id, items: [] };

            if (level === previousLevel) {
              newItems[newItems.length - 1].items.push(item);
            } else {
              newItems.push(item);
            }

            previousLevel = level;
          }
        }

        return (
          <></>
        );
      },
    });

    setItems(newItems);
  }, [children]);

  return items.length > 0 ? (
    <div className="border d-inline-flex flex-column mb-3 rounded pb-2 px-3 pt-3">
      <div className="fw-bold mb-2">Table of contents</div>

      <ol className="fs-sm fw-medium ps-3">
        {items.map((item) => (
          <li key={item.id}>
            <a className="d-block py-1" href={`#${item.id}`}>{item.children}</a>

            {item.items.length > 0 ? (
              <ol className="ps-3" style={{ listStyle: "lower-alpha" }}>
                {item.items.map((item2) => (
                  <li key={`${item.id}-${item2.id}`}>
                    <a className="d-block py-1" href={`#${item2.id}`}>{item2.children}</a>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  ) : null;
}
