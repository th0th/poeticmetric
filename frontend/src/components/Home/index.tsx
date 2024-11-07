import Layout from "~/components/Layout";
import Title from "~/components/Title";

export default function Home() {
  return (
    <>
      <Title>Homepage</Title>

      <Layout>
        <div className="container">
          <div>
            Something beautiful is about to happen here &lt;3
          </div>
        </div>
      </Layout>
    </>
  );
}
