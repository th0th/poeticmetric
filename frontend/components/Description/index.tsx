import Head from "next/head";
import React from "react";

export type DescriptionProps = {
  children: string;
};

export function Description({ children }: DescriptionProps) {
  return (
    <Head>
      <meta content={children} name="description" />
    </Head>
  );
}
