import Markdown from "~/components/Markdown";
import content from "./manifesto.md?raw";

export default function Manifesto() {
  return (
    <div className="container">
      <div className="mx-auto mw-50rem">
        <Markdown content={content} />
      </div>
    </div>
  );
}
