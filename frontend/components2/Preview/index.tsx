import React from "react";
import MockWindow from "~components/MockWindow";
import screenshot from "./screenshot.png";

export type PreviewProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["section"]>, "children">;

export default function Preview(props: PreviewProps) {
  return (
    <section {...props}>
      <div className="container">
        <MockWindow className="mx-auto mw-50rem">
          <img alt="Screenshot" className="d-block w-100" src={screenshot.src} />
        </MockWindow>
      </div>
    </section>
  );
}
