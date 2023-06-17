import Header from "~components/Header";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />

      <div className="container d-flex flex-column flex-grow-1 py-5">
        {children}
      </div>
    </>
  );
}
