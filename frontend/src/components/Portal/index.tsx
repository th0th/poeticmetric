import { ReactNode } from "react";
import { createPortal } from "react-dom";

export type PortalProps = {
  children: ReactNode;
};

export default function Portal({ children }: PortalProps) {
  const rootElement = document.getElementById("root");

  return rootElement !== null ? createPortal(children, rootElement) : null;
}
