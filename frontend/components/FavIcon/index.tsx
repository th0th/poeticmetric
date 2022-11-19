import Image, { ImageProps } from "next/image";
import React from "react";

type FavIconProps = Overwrite<Omit<ImageProps, "height" | "src" | "width">, {
  alt: string;
  domain: string;
  size: number;
}>;

export function FavIcon({ alt, domain, size, ...props }: FavIconProps) {
  // const domain = useMemo<string>(() => {
  //   const u = new URL(url);
  //
  //   return u.hostname;
  // }, [url]);

  return (
    <Image
      {...props}
      alt={alt}
      height={size}
      loading="lazy"
      src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
      unoptimized
      width={size}
    />
  );
}
