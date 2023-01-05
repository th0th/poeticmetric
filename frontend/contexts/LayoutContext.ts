import { createContext } from "react";

export type LayoutContextValue = {
  kind: "app" | "website";
};

export const LayoutContext = createContext<LayoutContextValue>({
  kind: "website",
});
