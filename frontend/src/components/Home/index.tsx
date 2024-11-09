import Layout from "~/components/Layout";
import Title from "~/components/Title";

export default function Home() {
  return (
    <>
      <Title>Homepage</Title>

      <Layout>
        <div className="container">
          <h1>I am a h1 title</h1>

          <h2>I am a h2 title</h2>

          <h3>I am a h3 title</h3>

          <h4>I am a h4 title</h4>

          <p>I am a paragraph</p>

          <small>I am small</small>
        </div>
      </Layout>
    </>
  );
}
