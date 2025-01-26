import { createContext } from "react";

export type MarkdownContextValue = Pick<Markdown, "content" | "path" | "type">;

export default createContext<MarkdownContextValue>({
  content: "",
});
