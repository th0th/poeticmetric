type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container mx-auto mw-45rem py-5">
      {children}
    </div>
  );
}
