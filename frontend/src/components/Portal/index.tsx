import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type PortalProps = {
  children: ReactNode;
};

export default function Portal({ children }: PortalProps) {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return isReady ? createPortal(children, document.body) : null;
}
