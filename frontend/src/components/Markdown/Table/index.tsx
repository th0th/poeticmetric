import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";

export type TableProps = PropsWithoutRef<JSX.IntrinsicElements["table"]>;

export default function Table({ className, ...props }: TableProps) {
  return (
    <table {...props} className={classNames("table table-bordered table-striped", className)} />
  );
}
