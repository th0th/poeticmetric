import { JSX, PropsWithoutRef } from "react";
import { Link } from "wouter";

export type AnchorProps = PropsWithoutRef<JSX.IntrinsicElements["a"]>;

export default function Anchor({ href, ...props }: AnchorProps) {
  return (
    <Link target={href?.startsWith("http") ? "_blank" : undefined} to={href || ""} {...props} />
  );
}
