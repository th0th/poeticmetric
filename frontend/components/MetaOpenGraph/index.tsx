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
  image?: Image;
  siteName?: string;
  title: string;
};

export function MetaOpenGraph({ description, image: imageFromProps, siteName: siteNameFromProps, title }: MetaOpenGraphProps) {
  const router = useRouter();

  const image = useMemo<Image>(() => imageFromProps || {
    height: 902,
    url: `${process.env.NEXT_PUBLIC_POETICMETRIC_FRONTEND_BASE_URL}/poeticmetric-og-image.jpg`,
    width: 2261,
  }, [imageFromProps]);

  const url = useMemo<string>(() => `${process.env.NEXT_PUBLIC_POETICMETRIC_FRONTEND_BASE_URL}${router.asPath}`, [router.asPath]);

  const siteName = useMemo<string>(() => siteNameFromProps || "PoeticMetric", [siteNameFromProps]);

  return (
    <Head>
      <meta content={url} property="og:url" />
      <meta content={title} property="og:title" />
      <meta content={image.url} property="og:image" />
      <meta content={image.width.toString()} property="og:image:width" />
      <meta content={image.height.toString()} property="og:image:height" />
      <meta content={description} property="og:description" />
      <meta content={siteName} property="og:site_name" />

      <meta content="summary_large_image" property="twitter:card" />
      <meta content={url} name="twitter:url" />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={image.url} name="twitter:image" />
      <meta content={siteName} name="twitter:site" />
    </Head>
  );
}
