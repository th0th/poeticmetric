export type CanonicalLinkProps = {
  path: string;
};

export default function CanonicalLink({ path }: CanonicalLinkProps) {
  return (
    <>
      <link href={`${import.meta.env.VITE_FRONTEND_BASE_URL}${path}`} rel="canonical" />
      <meta content={`${import.meta.env.VITE_FRONTEND_BASE_URL}${path}`} property="og:url" />
    </>
  );
}
