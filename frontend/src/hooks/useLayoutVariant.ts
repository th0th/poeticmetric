import { useMemo } from "react";
import { useMatches } from "react-router";

export default function useLayoutVariant(): LayoutVariant {
  const matches = useMatches();

  return useMemo<"application" | "site">(() => {
    for (const match of matches) {
      if (hasLayoutVariant(match)) {
        return match.handle.layoutVariant;
      }
    }

    throw Error("No header variant found");
  }, [matches]);
}

function hasLayoutVariant(match: unknown): match is { handle: { layoutVariant: "application" | "site" } } {
  return typeof match === "object"
    && match !== null
    && "handle" in match
    && typeof match.handle === "object"
    && match.handle !== null
    && "layoutVariant" in match.handle;
}
