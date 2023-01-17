import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import React from "react";

export default function Document() {
  return (
    <Html lang="en">
      <Head />

      <body>
        <Main />

        <NextScript />

        <Script src="/config.js" strategy="beforeInteractive" />
      </body>
    </Html>
  );
}
