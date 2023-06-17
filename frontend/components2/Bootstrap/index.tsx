"use client";

import { useEffect } from "react";

export default function Bootstrap() {
  useEffect(() => {
    // @ts-ignore
    import("bootstrap/dist/js/bootstrap");
  }, []);

  return null;
}
