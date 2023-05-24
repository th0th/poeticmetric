import Script from "next/script";
import React, { useMemo } from "react";
import { getRestApiUrl } from "../../helpers";

export function PoeticMetric() {
  const src = useMemo<string | null>(() => {
    return getRestApiUrl("/pm.js") || null;
  }, []);

  return (
    <>
      {src === null ? null : (
        <Script async src={src} />
      )}

      <Script
        async
        data-ackee-domain-id="83316f20-b779-4b7c-9a08-5e4dac261f1d"
        data-ackee-server="https://k.poeticmetric.com"
        src="https://k.poeticmetric.com/companion.js"
      />
    </>
  );
}
