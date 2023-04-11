import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import React from "react";
import { getIsHosted } from "../helpers";

export default function Document() {
  return (
    <Html lang="en">
      <Head />

      <body>
        <Main />

        <NextScript />

        {!getIsHosted() ? (
          <Script src="/config.js" strategy="beforeInteractive" />
        ) : null}
      </body>
    </Html>
  );
}
