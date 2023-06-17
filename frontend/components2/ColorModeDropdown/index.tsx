"use client";

import classNames from "classnames";
import Cookies from "js-cookie";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ColorModeDropdownProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

type ColorMode = "dark" | "light";
type ColorModeOption = ColorMode | "auto";

type State = {
  selectedColorMode: ColorMode | null;
  systemColorMode: ColorMode;
};

type ColorModeChoice = {
  icon: string;
  name: ColorModeOption;
  title: string;
};

const colorModes: Array<ColorModeChoice> = [
  { icon: "bi-circle-half", name: "auto", title: "Auto" },
  { icon: "bi-sun-fill", name: "light", title: "Light" },
  { icon: "bi-moon-stars-fill", name: "dark", title: "Dark" },
];

const colorModeAttributeName = "data-color-mode-name";
const colorModeCookieName = "color-mode";

export default function ColorModeDropdown({ className, ...props }: ColorModeDropdownProps) {
  const appliedColorMode = useRef<ColorMode>("light");
  const [state, setState] = useState<State>({ selectedColorMode: null, systemColorMode: "light" });

  const buttonIcon = useMemo<string>(
    () => colorModes.find((c) => c.name === (state.selectedColorMode || "auto"))?.icon || "",
    [state.selectedColorMode],
  );

  const handleButtonClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
    const selectedColorMode = event.currentTarget.getAttribute(colorModeAttributeName);

    if (selectedColorMode === null || (selectedColorMode !== "dark" && selectedColorMode !== "light")) {
      setState((s) => ({ ...s, selectedColorMode: null }));
      Cookies.remove(colorModeCookieName);
    } else {
      setState((s) => ({ ...s, selectedColorMode }));
      Cookies.set(colorModeCookieName, selectedColorMode);
    }
  }, []);

  useEffect(() => {
    const colorMode = Cookies.get(colorModeCookieName);

    if (colorMode !== undefined && (colorMode === "dark" || colorMode === "light")) {
      setState((s) => ({ ...s, selectedColorMode: colorMode }));
    }
  }, []);

  useEffect(() => {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      setState((s) => ({ ...s, systemColorMode: event.matches ? "dark" : "light" }));
    });
  }, []);

  useEffect(() => {
    const colorMode = state.selectedColorMode || state.systemColorMode;

    if (colorMode !== appliedColorMode.current) {
      appliedColorMode.current = colorMode;

      if (colorMode === "dark") {
        document.body.setAttribute("data-bs-theme", "dark");
      } else {
        document.body.removeAttribute("data-bs-theme");
      }
    }
  }, [state.selectedColorMode, state.systemColorMode]);

  return (
    <div {...props} className={classNames("d-inline-flex dropdown", className)}>
      <button className="align-items-center btn btn-link d-flex dropdown-toggle flex-row" data-bs-toggle="dropdown" type="button">
        <i className={classNames("bi", buttonIcon)} />

        <span className="d-md-none ms-1">Change theme</span>
      </button>

      <ul className="dropdown-menu">
        {colorModes.map((c, i) => c === null ? (
          <li key={`divider-${i}`}>
            <hr className="dropdown-divider" />
          </li>
        ) : (
          <li key={c.title}>
            <button
              {...{ [colorModeAttributeName]: c.name }}
              className={classNames(
                "dropdown-item d-flex align-items-center",
                ((state.selectedColorMode === null && c.name === "auto") || state.selectedColorMode === c.name) && "active")
              }
              onClick={handleButtonClick}
              type="button"
            >
              <i className={classNames("bi me-2 opacity-50 theme-icon", c.icon)} />

              {c.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
