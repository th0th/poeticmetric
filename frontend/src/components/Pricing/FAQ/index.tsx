import { JSX, PropsWithoutRef, ReactNode } from "react";
import { Accordion } from "react-bootstrap";
import imageFAQ from "./FAQ.svg";

export type FAQItem = {
  answer: ReactNode;
  question: Exclude<ReactNode, null | undefined>;
};

const defaultItems: Array<FAQItem> = [
  {
    answer: (
      <p>
        We never stop registering page views, even if you reach your plan&apos;s limit. Instead, we let you know so you can upgrade your
        subscription.
      </p>
    ),
    question: "What happens when I reach my plan's page view limit?",
  },
  {
    answer: (
      <p>
        Each user (also called as team member) has an individual account on your PoeticMetric,
        giving them access to the service by authenticating with their e-mail address and password.
      </p>
    ),
    question: `What is a "user" or "team member"?`,
  },
  {
    answer: (
      <>
        <p>
          Currently, we provide service by monthly and yearly subscriptions. You can upgrade or cancel your subscription anytime with no
          further obligation.
        </p>

        <p>
          If you need longer subscriptions with a one-time payment, please contact us at
          {" "}
          <a href="mailto:support@poeticmetric.com">support@poeticmetric.com</a>
          .
        </p>
      </>
    ),
    question: "How long are your contracts?",
  },
  {
    answer: (
      <p>
        Absolutely! We work with
        {" "}
        <a href="https://www.stripe.com" target="_blank">Stripe</a>
        {", "}
        which ensures your safety and security. All site communication and data transfer are secured and encrypted.
      </p>
    ),
    question: "Is this a secure site for purchases?",
  },
  {
    answer: (
      <p>
        Need to update the credit card for your subscription payments? No problem. You can easily do this in the Billing section of the
        application.
      </p>
    ),
    question: "Can I update my credit card details?",
  },
  {
    answer: (
      <>
        <p>
          Decided to cancel your subscription? No worries. You can do this at any time in the Billing section of the application, with just
          a few clicks.
        </p>

        <p>
          When you select to cancel your subscription, it will be canceled at the end of the current billing period (month or year,
          according to your subscription). You can keep using the features offered with your subscription plan until the billing period
          ends.
        </p>
      </>
    ),
    question: "Can I cancel my subscription?",
  },
  {
    answer: (
      <p>
        Yes! After you sign up the 14-day free trial starts immediately, no credit card required. Explore PoeticMetric and decide if
        it&apos;s right for you.
      </p>
    ),
    question: "Can I try PoeticMetric for free?",
  },
  {
    answer: (
      <p>
        Unfortunately, not at this time. We offer a free 14-day trial, and a free plan to help you make sure PoeticMetric meets your
        requirements before subscribing.
      </p>
    ),
    question: "Can I get a refund?",
  },
  {
    answer: (
      <p>
        Is there something else you want to know? We are always available at
        {" "}
        <a href="mailto:support@poeticmetric.com">
          support@poeticmetric.com
        </a>
        .
      </p>
    ),
    question: "Hmmm... How about ...?",
  },
];

export type FAQProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["section"]>, {
  items?: Array<FAQItem>;
}>;

export default function FAQ({ items = defaultItems, ...props }: FAQProps) {
  return (
    <section {...props}>
      <div className="container py-16">
        <h1>Frequently asked questions</h1>

        <div className="row row-cols-1 row-cols-lg-2">
          <div className="col">
            <Accordion className="mt-20">
              {items.map((item) => (
                <Accordion.Item eventKey={item.question.toString()} key={item.question.toString()}>
                  <Accordion.Header>
                    <span className="fw-semi-bold">{item.question}</span>
                  </Accordion.Header>

                  <Accordion.Body>
                    {item.answer}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>

          <div className="col d-none d-lg-block">
            <img alt="Frequently asked questions" className="d-block h-32rem w-100" src={imageFAQ} />
          </div>
        </div>
      </div>
    </section>
  );
}
