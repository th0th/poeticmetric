import { ParentSize } from "@visx/responsive";
import React, { ComponentType } from "react";

type ChildrenProps = {
  parentHeight: number;
  parentWidth: number;
};

export type WithParentSizeProps = {
  className?: string;
};

export function withParentSize<Props extends {}>(
  Component: ComponentType<Props & ChildrenProps>,
  withParentSizeProps?: WithParentSizeProps,
) {
  function Wrapped(props: Omit<Props, keyof ChildrenProps>) {
    return (
      <ParentSize {...withParentSizeProps}>
        {(parent) => {
          return parent.height === 0 || parent.width === 0
            ? null
            : React.createElement(Component, { ...(props as Props), parentHeight: parent.height, parentWidth: parent.width });
        }}
      </ParentSize>
    );
  }

  return Wrapped;
}
