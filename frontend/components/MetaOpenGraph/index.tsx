import { omit } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

type Image = {
  height: number;
  url: string;
  width: number;
};

export type MetaOpenGraphProps = {
  description: string;
  image?: Overwrite<Omit<Image, "url">, { path: string }>;
  siteName?: string;
  title: string;
};

export function MetaOpenGraph({ description, image: imageFromProps, siteName: siteNameFromProps, title }: MetaOpenGraphProps) {
  const router = useRouter();

  const image = useMemo<Image | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    if (imageFromProps !== undefined) {
      return {
        ...omit(imageFromProps, ["path"]),
        url: `${window.poeticMetric?.frontendBaseUrl}/${imageFromProps.path}`,
      };
    }

    return {
      height: 902,
      url: `${window.poeticMetric?.frontendBaseUrl}/poeticmetric-og-image.jpg`,
      width: 2261,
    };
  }, [imageFromProps]);

  const url = useMemo<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return `${window.poeticMetric?.frontendBaseUrl}${router.asPath}`;
  }, [router.asPath]);

  const siteName = useMemo<string>(() => siteNameFromProps || "PoeticMetric", [siteNameFromProps]);

  return (
    <Head>
      <meta content={title} property="og:title" />

      {url !== null ? (
        <>
          <meta content={url} property="og:url" />

          <meta content={url} name="twitter:url" />
        </>
      ) : null}

      {image !== null ? (
        <>
          <meta content={image.url} property="og:image" />
          <meta content={image.width.toString()} property="og:image:width" />
          <meta content={image.height.toString()} property="og:image:height" />

          <meta content={image.url} name="twitter:image" />
        </>
      ) : null}

      <meta content={description} property="og:description" />
      <meta content={siteName} property="og:site_name" />

      <meta content="summary_large_image" property="twitter:card" />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={siteName} name="twitter:site" />
    </Head>
  );
}
