import React from "react";
import { Container } from "react-bootstrap";
import { MockWindow } from "../../MockWindow";
import screenshot from "./screenshot.png";

export type PreviewProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["section"]>, "children">;

export function Preview(props: PreviewProps) {
  return (
    <section {...props}>
      <Container>
        <MockWindow className="mx-auto mw-50rem">
          <img alt="Screenshot" className="d-block w-100" src={screenshot.src} />
        </MockWindow>
      </Container>
    </section>
  );
}
