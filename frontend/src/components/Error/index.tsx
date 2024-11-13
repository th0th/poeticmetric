import Layout from "~/components/Layout";
import Title from "~/components/Title";

export default function Error() {
  return (
    <>
      <Title>An error has occurred</Title>

      <Layout>
        <div className="container">An error had occurred.</div>
      </Layout>
    </>
  );
}
