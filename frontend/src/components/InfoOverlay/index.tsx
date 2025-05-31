import classNames from "classnames";
import { ReactNode } from "react";
import { OverlayTrigger, OverlayTriggerProps, Popover } from "react-bootstrap";

export type InfoOverlayProps = Overwrite<Omit<OverlayTriggerProps, "overlay" | "rootClose" | "trigger">, {
  body: ReactNode;
  children: ReactNode;
  className?: string;
  header?: ReactNode;
}>;

export default function InfoOverlay({ body, children, className, header, ...props }: InfoOverlayProps) {
  return (
    <OverlayTrigger
      {...props}
      overlay={(
        <Popover className="shadow">
          {header !== undefined ? (
            <Popover.Header>{header}</Popover.Header>
          ) : null}

          <Popover.Body>{body}</Popover.Body>
        </Popover>
      )}
      rootClose
      trigger="click"
    >
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        className={classNames("btn-unstyled text-decoration-underline text-decoration-style-dashed text-reset", className)}
        href="#"
        onClick={(event) => event.preventDefault()}
        role="button"
        style={{
          textDecorationSkip: "none",
        }}
        tabIndex={0}
      >
        {children}
      </a>
    </OverlayTrigger>
  );
}
