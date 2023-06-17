import classNames from "classnames";
import React from "react";
import styles from "./Faq.module.scss";

export type FaqProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["section"]>, "children">;

const accordionId = "faq-accordion";

export default function Faq({ className, ...props }: FaqProps) {
  return (
    <section {...props} className={classNames("py-5", className)}>
      <h2 className="mw-32rem">Frequently asked questions</h2>

      <div className={`pb-5 pt-3 ${styles.accordionWrapper}`}>
        <div className="accordion mw-32rem" id={accordionId}>
          <div className="accordion-item">
            <div className="accordion-header">
              <button className="accordion-button collapsed" data-bs-target="#faq-accordion-1" data-bs-toggle="collapse" type="button">
                <span className="fw-semibold">What happens when I reach my plan&apos;s page view limit?</span>
              </button>
            </div>

            <div className="accordion-collapse collapse" data-bs-parent={`#${accordionId}`} id="faq-accordion-1">
              <div className="accordion-body">
                We never stop registering page views, even if you reach your plan&apos;s limit. Instead, we let you know so you can upgrade
                your subscription.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <div className="accordion-header">
              <button className="accordion-button collapsed" data-bs-target="#faq-accordion-2" data-bs-toggle="collapse" type="button">
                <span className="fw-semibold">Is this a secure site for purchases?</span>
              </button>
            </div>

            <div className="accordion-collapse collapse" data-bs-parent={`#${accordionId}`} id="faq-accordion-2">
              <div className="accordion-body">
                {"Absolutely! We work with "}
                <a href="https://www.stripe.com" target="_blank">Stripe</a>
                {" which guarantees your safety and security. All site communication and data transfer are secured and encrypted."}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <div className="accordion-header">
              <button className="accordion-button collapsed" data-bs-target="#faq-accordion-3" data-bs-toggle="collapse" type="button">
                <span className="fw-semibold">Can I get a refund?</span>
              </button>
            </div>

            <div className="accordion-collapse collapse" data-bs-parent={`#${accordionId}`} id="faq-accordion-3">
              <div className="accordion-body">
                Unfortunately, not at this time. We offer free 7-day trial in order to help you make sure PoeticMetric meets your
                requirements before subscribing.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <div className="accordion-header">
              <button className="accordion-button collapsed" data-bs-target="#faq-accordion-4" data-bs-toggle="collapse" type="button">
                <span className="fw-semibold">I have another question...</span>
              </button>
            </div>

            <div className="accordion-collapse collapse" data-bs-parent={`#${accordionId}`} id="faq-accordion-4">
              <div className="accordion-body">
                {"Is there something else you want to know? We are always available at "}
                <a href="mailto:support@poeticmetric.com?subject=I%20have%20a%20question">support@poeticmetric.com</a>
                .
              </div>
            </div>
          </div>

          {/*<Accordion.Item eventKey="2">*/}
          {/*  <Accordion.Header>*/}
          {/*    <span className="fw-semibold">Can I get a refund?</span>*/}
          {/*  </Accordion.Header>*/}

          {/*  <Accordion.Body>*/}
          {/*    Unfortunately, not at this time. We offer free 7-day trial in order to help you make sure PoeticMetric meets your*/}
          {/*    requirements before subscribing.*/}
          {/*  </Accordion.Body>*/}
          {/*</Accordion.Item>*/}

          {/*<Accordion.Item eventKey="3">*/}
          {/*  <Accordion.Header>*/}
          {/*    <span className="fw-semibold">I have another question...</span>*/}
          {/*  </Accordion.Header>*/}

          {/*  <Accordion.Body>*/}
          {/*    {"Is there something else you want to know? We are always available at "}*/}
          {/*    <a href="mailto:support@poeticmetric.com?subject=I%20have%20a%20question">support@poeticmetric.com</a>*/}
          {/*    .*/}
          {/*  </Accordion.Body>*/}
          {/*</Accordion.Item>*/}
        </div>
      </div>
    </section>
  );
}
