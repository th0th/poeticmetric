import Head from "next/head";
import React from "react";
import { getUrl } from "../../helpers";

export type CanonicalLinkProps = {
  path: string;
};

export function CanonicalLink({ path }: CanonicalLinkProps) {
  return (
    <Head>
      <link href={getUrl(path)} rel="canonical" />
    </Head>
  );
}
