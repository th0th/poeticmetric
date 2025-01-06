import clsx from "clsx";
import md5 from "md5";
import { ForwardedRef, forwardRef, JSX, PropsWithoutRef, useMemo } from "react";

export type AvatarProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["img"]>, {
  alt: string;
  email: string;
  size?: number;
}>;

function Avatar({ alt, className, email, size = 32, ...props }: AvatarProps, ref: ForwardedRef<HTMLImageElement>) {
  const src = useMemo<string>(() => {
    const hash = md5(email);

    return `https://www.gravatar.com/avatar/${hash}?d=mysteryman&s=${size * 2}`;
  }, [email, size]);

  return (
    <img
      {...props}
      alt={alt}
      className={clsx("rounded-circle", className)}
      loading="lazy"
      ref={ref}
      src={src}
      style={{ height: size, width: size }}
    />
  );
}

export default forwardRef(Avatar);
