import GitHubButton from "react-github-btn";
import CanonicalLink from "~/components/CanonicalLink";
import Description from "~/components/Description";
import Markdown from "~/components/Markdown";
import Title from "~/components/Title";
import markdown from "./open-source.md?raw";

export default function OpenSource() {
  return (
    <>
      <Title>The open source Google Analytics alternative</Title>
      <Description>Here you can find about the philosophy of PoeticMetric open source website analytics.</Description>
      <CanonicalLink path="/open-source" />

      <div className="bg-body-tertiary py-16">
        <div className="container text-center">
          <div className="mw-50rem mx-auto">
            <h1 className="fs-1">PoeticMetric is the open source Google Analytics alternative</h1>

            <div className="fs-4 mt-16">
              Unlock the power of data with PoeticMetric - the free and open source website analytics platform designed for transparency,
              security, and community-driven innovation.
            </div>

            <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center mt-10">
              <GitHubButton
                aria-label="Star th0th/poeticmetric on GitHub"
                data-icon="octicon-star"
                data-show-count="true"
                data-size="large"
                href="https://github.com/th0th/poeticmetric"
              >
                Star
              </GitHubButton>

              <GitHubButton
                aria-label="Fork th0th/poeticmetric on GitHub"
                data-icon="octicon-repo-forked"
                data-show-count="true"
                data-size="large"
                href="https://github.com/th0th/poeticmetric/fork"
              >
                Fork
              </GitHubButton>

              <GitHubButton
                aria-label="Sponsor @th0th on GitHub"
                data-icon="octicon-heart"
                data-size="large"
                href="https://github.com/sponsors/th0th"
              >
                Sponsor
              </GitHubButton>
            </div>
          </div>
        </div>
      </div>

      <article className="container py-16" id="article">
        <div className="mw-50rem mx-auto">
          <Markdown className="fs-5 lh-lg">{markdown}</Markdown>
        </div>
      </article>
    </>
  );
}

export const Component = OpenSource;
