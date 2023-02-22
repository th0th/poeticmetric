import { ParentSize } from "@visx/responsive";
import React, { FunctionComponent } from "react";

type ChildrenProps = {
  parentHeight: number;
  parentWidth: number;
};

export type WithParentSizeProps = {
  className?: string;
};

export function withParentSize(Component: FunctionComponent<ChildrenProps>, props?: WithParentSizeProps) {
  function Wrapped() {
    return (
      <ParentSize {...props}>
        {(parent) => {
          return parent.height === 0 || parent.width === 0
            ? null
            : React.createElement(Component, { parentHeight: parent.height, parentWidth: parent.width });
        }}
      </ParentSize>
    );
  }

  return Wrapped;
}
