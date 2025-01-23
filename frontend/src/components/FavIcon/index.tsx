import { JSX, PropsWithoutRef } from "react";

type FavIconProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["img"]>, "src">, {
  domain: string;
  size: number;
}>;

export default function FavIcon({ alt, domain, size, ...props }: FavIconProps) {
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
