import { IconAt } from "@tabler/icons-react";
import { Link } from "react-router";
import Title from "~/components/Title";

export default function Contact() {
  return (
    <>
      <Title>Contact us for support and inquiries</Title>

      <section className="py-64">
        <div className="container">
          <div className="text-center">
            <h2 className="fs-6 fw-bold text-primary">WE ARE HERE TO HELP</h2>

            <h1 className="display-5 fw-bold">Contact us</h1>
          </div>

          <div className="fs-5 mt-24 mw-50rem mx-auto">
            <p>If you&apos;re new to PoeticMetric or need a hand with something, check out these resources:</p>

            <ul className="lh-lg">
              <li>
                <Link className="fw-semi-bold" to="/docs">Docs</Link>
                {" "}
                - Guides and troubleshooting
              </li>

              <li>
                <Link className="fw-semi-bold" to="/blog">Blog</Link>
                {" "}
                - Insights, updates, and how-tos
              </li>

              <li>
                <a className="fw-semi-bold" href="https://status.poeticmetric.com" rel="noreferrer" target="_blank">Status page</a>
                {" "}
                - System status and uptime
              </li>

              <li>
                <Link className="fw-semi-bold" to="/pricing#faqs">FAQs</Link>
                {" "}
                - Most common questions
              </li>
            </ul>

            <p>Didn&apos;t find what you need?</p>

            <p>
              Email us at
              {" "}

              <span>
                info
                <IconAt size="1em" />
                poeticmetric.com
              </span>

              . We usually reply within one business day.
            </p>

            <p>For privacy, press, or partnerships, reach out to the same address and just let us know what you&apos;re interested in.</p>

            <p>Thanks again for getting in touch, we&apos;re always glad to help!</p>
          </div>
        </div>

      </section>
    </>
  );
}

export const Component = Contact;
