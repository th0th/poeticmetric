import { ReactNode, useEffect, useState } from "react";
import ColorModeContext, { ColorModeContextColorMode, ColorModeContextPreferredColorMode } from "~/contexts/ColorModeContext";

type ColorModeProviderProps = {
  children: ReactNode;
};

type State = {
  preferredColorMode: ColorModeContextPreferredColorMode;
  systemColorMode: ColorModeContextColorMode;
};

export default function ColorModeProvider({ children }: ColorModeProviderProps) {
  const [state, setState] = useState<State>({ preferredColorMode: null, systemColorMode: "light" });

  useEffect(() => {
    const colorMode = state.preferredColorMode || state.systemColorMode;

    if (colorMode === "dark") {
      document.body.setAttribute("data-bs-theme", "dark");
    } else {
      document.body.removeAttribute("data-bs-theme");
    }
  }, [state.preferredColorMode, state.systemColorMode]);

  useEffect(() => {
    function setSystemColorMode(matches: boolean) {
      setState((s) => ({ ...s, systemColorMode: matches ? "dark" : "light" }));
    }

    function handleEvent(event: MediaQueryListEvent) {
      setSystemColorMode(event.matches);
    }

    const query = window.matchMedia("(prefers-color-scheme: dark)");

    setSystemColorMode(query.matches);

    query.addEventListener("change", handleEvent);

    return () => query.removeEventListener("change", handleEvent);
  }, []);

  return (
    <ColorModeContext.Provider value={{ preferredColorMode: state.preferredColorMode }}>{children}</ColorModeContext.Provider>
  );
}
