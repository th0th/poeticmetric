import classNames from "classnames";
import React, { useMemo } from "react";
import { Alert as BsAlert, AlertProps as BsAlertProps } from "react-bootstrap";

export type AlertProps = BsAlertProps;

export function Alert({ children: childrenOrig, variant, ...props }: AlertProps) {
  const iconNode = useMemo<React.ReactNode>(() => {
    let iconClassName = "";

    if (variant === "primary") {
      iconClassName = "bi-lightbulb";
    }

    return (<i className={`bi ${iconClassName} flex-shrink-0 me-3`} />);
  }, [variant]);

  const children = useMemo(() => {
    return React.Children.map(childrenOrig, (child) => {
      if (React.isValidElement(child) && typeof child.type !== "string" && child.type.name === "Anchor") {
        return React.cloneElement(child, { ...child.props, className: classNames(child.props.className, "alert-link") });
      }

      return child;
    });
  }, [childrenOrig]);

  return (
    <BsAlert {...props} className="align-items-center d-flex flex-row" variant={variant}>
      {iconNode}

      <div>
        {children}
      </div>
    </BsAlert>
  );
}
