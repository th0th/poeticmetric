import matter from "gray-matter";
import Breadcrumb from "~/components/Breadcrumb";
import CanonicalLink from "~/components/CanonicalLink";
import Markdown from "~/components/Markdown";
import Title from "~/components/Title";
import markdown from "./privacy-policy.md?raw";

const md = matter(markdown);

export default function PrivacyPolicy() {
  return (
    <>
      <Title>Privacy policy</Title>
      <CanonicalLink path="/privacy-policy" />

      <div className="bg-body">
        <div className="container mw-50rem py-16">
          <div className="mw-50rem mx-auto">
            <Breadcrumb>
              <Breadcrumb.Title>Privacy policy</Breadcrumb.Title>
            </Breadcrumb>

            <div className="fw-semi-bold mt-2 text-body-tertiary">Last updated on Apr 9, 2023</div>

            <Markdown className="mt-3">{md.content}</Markdown>
          </div>
        </div>
      </div>
    </>
  );
}

export const Component = PrivacyPolicy;
