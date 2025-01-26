import { ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export type PortalProps = {
  children: ReactNode;
};

type State = {
  isReady: boolean;
};

export default function Portal({ children }: PortalProps) {
  const [state, setState] = useState<State>({ isReady: false });
  const rootElement = useMemo(() => state.isReady ? document.getElementById("root") : null, [state.isReady]);

  useEffect(() => {
    setState((s) => ({ ...s, isReady: true }));
  }, []);

  return rootElement !== null ? createPortal(children, rootElement) : null;
}
