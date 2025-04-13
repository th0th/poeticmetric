import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Error from "~/components/Error";

type AppErrorBoundaryProps = {
  children?: ReactNode;
};

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Error error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onError={(e) => {
        console.error(e); // eslint-disable-line no-console
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
