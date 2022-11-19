import classNames from "classnames";
import md5 from "md5";
import Image, { ImageProps } from "next/image";
import React, { useMemo } from "react";

export type AvatarProps = Overwrite<Omit<ImageProps, "src">, {
  alt: string;
  email: string;
  size?: number;
}>;

export function Avatar({ alt, className, email, size = 32, ...props }: AvatarProps) {
  const src = useMemo<string>(() => {
    const hash = md5(email);

    return `https://www.gravatar.com/avatar/${hash}?d=mysteryman&s=${size * 2}`;
  }, [email, size]);

  return (
    <Image
      {...props}
      alt={alt}
      className={classNames("d-block rounded-circle", className)}
      height={size}
      loading="lazy"
      src={src}
      unoptimized
      width={size}
    />
  );
}
