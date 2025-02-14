import { createContext } from "react";

export type ColorModeContextColorMode = "dark" | "light";
export type ColorModeContextPreferredColorMode = ColorModeContextColorMode | null;

export type ColorModeContextValue = {
  preferredColorMode: ColorModeContextPreferredColorMode;
};

export default createContext<ColorModeContextValue>({
  preferredColorMode: null,
});
