import Layout from "~/components/Layout";
import Title from "~/components/Title";

export default function Home() {
  return (
    <>
      <Title>Homepage</Title>

      <Layout>
        <div className="container">
          <div>Something beautiful</div>
        </div>
      </Layout>
    </>
  );
}
