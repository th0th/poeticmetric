import classNames from "classnames";
import md5 from "md5";
import React, { useMemo } from "react";

export type AvatarProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["img"]>, "src">, {
  alt: string;
  email: string;
  size?: number;
}>;

function BaseAvatar({ alt, className, email, size = 32, ...props }: AvatarProps, ref: React.Ref<HTMLImageElement>) {
  const src = useMemo<string>(() => {
    const hash = md5(email);

    return `https://www.gravatar.com/avatar/${hash}?d=mysteryman&s=${size * 2}`;
  }, [email, size]);

  return (
    <img
      {...props}
      alt={alt}
      className={classNames("d-block rounded-circle", className)}
      height={size}
      loading="lazy"
      ref={ref}
      src={src}
      width={size}
    />
  );
}

export const Avatar = React.forwardRef(BaseAvatar);
