import classNames from "classnames";
import React from "react";
import { Accordion } from "react-bootstrap";
import styles from "./Faq.module.scss";

export type FaqProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["section"]>, "children">;

export function Faq({ className, ...props }: FaqProps) {
  return (
    <section {...props} className={classNames("py-5", className)}>
      <h2 className="mw-32rem">Frequently asked questions</h2>

      <div className={`pb-5 pt-3 ${styles.accordionWrapper}`}>
        <Accordion className="mw-32rem">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <span className="fw-semibold">What happens when I reach my plan&apos;s page view limit?</span>
            </Accordion.Header>

            <Accordion.Body>
              We never stop registering page views, even if you reach your plan&apos;s limit. Instead, we let you know so you can upgrade
              your subscription.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <span className="fw-semibold">Is this a secure site for purchases?</span>
            </Accordion.Header>

            <Accordion.Body>
              {"Absolutely! We work with "}
              <a href="https://www.stripe.com" rel="noreferrer" target="_blank">Stripe</a>
              {" which guarantees your safety and security. All site communication and data transfer are secured and encrypted."}
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <span className="fw-semibold">Can I get a refund?</span>
            </Accordion.Header>

            <Accordion.Body>
              Unfortunately, not at this time. We offer free 7-day trial in order to help you make sure PoeticMetric meets your
              requirements before subscribing.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <span className="fw-semibold">I have another question...</span>
            </Accordion.Header>

            <Accordion.Body>
              Is there something else you want to know? We are always available at
              <a href="mailto:support@poeticmetric.com?subject=I%20have%20a%20question">support@poeticmetric.com</a>
              .
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </section>
  );
}
