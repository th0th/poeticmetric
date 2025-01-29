import matter from "gray-matter";
import Breadcrumb from "~/components/Breadcrumb";
import CanonicalLink from "~/components/CanonicalLink";
import Markdown from "~/components/Markdown";
import Title from "~/components/Title";
import markdown from "./terms-of-service.md?raw";

const md = matter(markdown);

export default function TermsOfService() {
  return (
    <>
      <Title>Terms of service</Title>
      <CanonicalLink path="/terms-of-service" />

      <div className="bg-body">
        <div className="container mw-50rem py-16">
          <Breadcrumb>
            <Breadcrumb.Title>Terms of service</Breadcrumb.Title>
          </Breadcrumb>

          <div className="fw-semi-bold mt-2 text-body-tertiary">Last updated on Jan 2, 2023</div>

          <Markdown className="mt-3">{md.content}</Markdown>
        </div>
      </div>
    </>
  );
}
