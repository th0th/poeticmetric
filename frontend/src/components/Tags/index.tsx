import { Parser } from "html-to-react";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";

type State = {
  tags: Tags | null;
};

type Tags = {
  body: string;
  head: string;
};

const parser = Parser();
const tagsEnvironment = import.meta.env.VITE_FRONTEND_TAGS_ENVIRONMENT;
console.log({ tagsEnvironment });

export default function Tags() {
  const { showBoundary } = useErrorBoundary();
  const [state, setState] = useState<State>({ tags: null });

  useEffect(() => {
    async function run() {
      let url = "https://webhook.webgazer.io/webhook/poeticmetric-tags";

      console.log({ inEffect: tagsEnvironment });
      if (tagsEnvironment !== undefined && tagsEnvironment !== "") {
        url += `?environment=${tagsEnvironment}`;
      }

      const response = await fetch(url);
      const responseJson: Tags = await response.json();

      setState((s) => ({ ...s, tags: responseJson }));
    }

    run().catch((e) => showBoundary(e));
  }, [showBoundary]);

  return (
    <>
      <>
        {state.tags !== null && state.tags.head !== "" ? parser.parse(state.tags.head) : null}
      </>

      {state.tags !== null && state.tags.body !== "" ? parser.parse(state.tags.body) : null}
    </>
  );
}
