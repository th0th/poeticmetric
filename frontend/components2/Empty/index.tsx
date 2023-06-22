import classNames from "classnames";

export type EmptyProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  description: React.ReactNode;
  title: React.ReactNode;
}>;

export default function Empty({ className, description, title, ...props }: EmptyProps) {
  return (
    <div
      {...props}
      className={classNames("align-items-center d-flex flex-column flex-grow-1 justify-content-center text-center", className)}
    >
      <i className="bi bi-folder2-open bis-5rem small text-primary" />

      <h3>{title}</h3>

      <div className="fs-5 fw-medium text-muted">{description}</div>
    </div>
  );
}
