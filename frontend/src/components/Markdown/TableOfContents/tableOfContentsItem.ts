import { ReactNode } from "react";

export type TableOfContentsItem = {
  id: string;
  level: number;
  parentId: string | null;
  title: ReactNode;
};
