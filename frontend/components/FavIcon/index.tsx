import React from "react";

type FavIconProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["img"]>, "src">, {
  domain: string;
  size: number;
}>;

export function FavIcon({ alt, domain, size, ...props }: FavIconProps) {
  return (
    <img
      {...props}
      alt={alt}
      height={size}
      loading="lazy"
      src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
      width={size}
    />
  );
}
