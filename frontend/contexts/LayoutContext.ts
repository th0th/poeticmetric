import React, { createContext } from "react";

export type LayoutContextState = {
  headerHeight: number;
};

export type LayoutContextValue = Overwrite<LayoutContextState, {
  kind: "app" | "website";
  set: React.Dispatch<React.SetStateAction<LayoutContextState>>;
}>;

export const LayoutContext = createContext<LayoutContextValue>({
  headerHeight: 0,
  kind: "website",
  set: () => {},
});
