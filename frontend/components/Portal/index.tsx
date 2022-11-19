import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type PortalProps = {
  children: React.ReactNode;
};

export function Portal({ children }: PortalProps) {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return isReady ? createPortal(children, document.body) : null;
}
