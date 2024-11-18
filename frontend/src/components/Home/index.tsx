import Layout from "~/components/Layout";
import Marquee from "../Marquee";
import Title from "~/components/Title";

export default function Home() {
  return (
    <>
      <Title>Homepage</Title>

      <Layout>
        <div className="container">
          <Marquee items={"merhaba gokhan seni cok seviyorum lol ve lel".split(" ")} />
        </div>
      </Layout>
    </>
  );
}
