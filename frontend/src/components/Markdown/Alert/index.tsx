import { IconAlertTriangle, IconBulb, TablerIcon } from "@tabler/icons-react";
import classNames from "classnames";
import { Children, cloneElement, createElement, isValidElement, JSX, PropsWithoutRef, ReactElement, ReactNode, useMemo } from "react";
import Anchor, { AnchorProps } from "~/components/Markdown/Anchor";

export type AlertProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  variant: "primary" | "warning";
}>;

const VariantIcons: Record<AlertProps["variant"], TablerIcon> = {
  primary: IconBulb,
  warning: IconAlertTriangle,
};

export default function Alert({ children: childrenFromProps, className, variant = "primary", ...props }: AlertProps) {
  const children = useMemo<ReactNode>(() => {
    return Children.map(childrenFromProps, (child) => {
      if (isAnchor(child)) {
        return cloneElement(child, { ...child.props, className: classNames(child.props.className, "alert-link") });
      }

      return child;
    });
  }, [childrenFromProps]);

  return (
    <div {...props} className={classNames("align-items-center alert d-flex flex-row gap-6 lh-base", `alert-${variant}`, className)}>
      {createElement(VariantIcons[variant], { className: "flex-shrink-0" })}

      <div>{Children.map(children, (child) => child)}</div>
    </div>
  );
}

function isAnchor(child: ReactNode): child is ReactElement<AnchorProps> {
  return isValidElement(child) && child.type === Anchor;
}
