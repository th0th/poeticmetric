import Layout from "~/components/Layout";
import Markdown from "~/components/Markdown";
import content from "./manifesto.md?raw";
import styles from "./Manifesto.module.css";

export default function Manifesto() {
  return (
    <Layout>
      <div className="container">
        <div className={styles.readingContainer}>
          <Markdown content={content} />
        </div>
      </div>
    </Layout>
  );
}
