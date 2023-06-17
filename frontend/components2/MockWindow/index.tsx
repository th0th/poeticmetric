import classNames from "classnames";
import React from "react";

export type MockWindowProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export default function MockWindow({ children, className, ...props }: MockWindowProps) {
  return (
    <div {...props} className={classNames("bg-body shadow", className)}>
      <div className="align-items-center bg-black bg-opacity-10 border-end border-top border-start d-flex flex-row h-1rem px-2 rounded-top">
        <div className="hstack gap-1">
          <i className="bi bi-circle-fill fs-xxs text-danger" />

          <i className="bi bi-circle-fill fs-xxs text-warning" />

          <i className="bi bi-circle-fill fs-xxs text-success" />
        </div>
      </div>

      <div className="border-bottom border-end border-start">{children}</div>
    </div>
  );
}
