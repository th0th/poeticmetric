import { JSX, PropsWithoutRef } from "react";
import Detail from "./Detail";
import Item from "./Item";
import Items from "./Items";
import Title from "./Title";

export type BreadcrumbProps = PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export default function Breadcrumb({ ...props }: BreadcrumbProps) {
  return (
    <div {...props} />
  );
}

Breadcrumb.Detail = Detail;
Breadcrumb.Item = Item;
Breadcrumb.Items = Items;
Breadcrumb.Title = Title;
