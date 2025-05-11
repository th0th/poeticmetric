import classNames from "classnames";
import Description from "~/components/Description";
import Markdown from "~/components/Markdown";
import Title from "~/components/Title";
import styles from "./Manifesto.module.scss";
import markdown from "./manifesto.md?raw";

export default function Manifesto() {
  return (
    <>
      <Title>Manifesto</Title>
      <Description>
        Discover the principles that guide PoeticMetric. Our privacy-first approach, commitment to transparency, dedication to
        sustainability, and focus on efficiency set us apart in the analytics industry. Read our manifesto now.
      </Description>

      <div className="container py-32">
        <div className="mx-auto mw-50rem">
          <Markdown className={classNames("fs-5 lh-lg", styles.manifesto)}>{markdown}</Markdown>
        </div>
      </div>
    </>
  );
}

export const Component = Manifesto;
