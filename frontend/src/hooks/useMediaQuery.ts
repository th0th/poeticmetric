import { useEffect, useState } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };

  }, [matches, query]);

  return matches;
}

export function useIsLg() {
  const [lg, setLg] = useState<number>(1200);
  const [xl, setXl] = useState<number>(1200);

  useEffect(() => {
    if (window) {
      const cssVariableLg = window.getComputedStyle(document.body).getPropertyValue("--breakpoint-lg");
      const cssVariableXl = window.getComputedStyle(document.body).getPropertyValue("--breakpoint-xl");

      if (typeof parseInt(cssVariableXl) === "number" && typeof parseInt(cssVariableLg) === "number") {
        setXl(parseInt(cssVariableXl));
        setLg(parseInt(cssVariableLg));
      }
    }
  }, []);

  return {
    isLg: useMediaQuery(`(min-width: ${lg}px) and (max-width: ${xl - 0.1}px)`),
    maxLg: useMediaQuery(`(max-width: ${xl - 0.1}px)`),
    minLg: useMediaQuery(`(min-width: ${lg}px)`),
  };
}
