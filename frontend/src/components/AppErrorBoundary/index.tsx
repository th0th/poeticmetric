import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Error from "~/components/Error";

type AppErrorBoundaryProps = {
  children?: ReactNode;
};

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(
        <Error />
      )}
      onError={(e) => {
        console.error(e);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
