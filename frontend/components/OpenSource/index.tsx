import classNames from "classnames";
import { Container } from "react-bootstrap";
import GitHubButton from "react-github-btn";
import { CanonicalLink, Description, Layout, Markdown, Title } from "..";
import styles from "./OpenSource.module.scss";

type OpenSourceProps = {
  content: string;
};

export function OpenSource({ content }: OpenSourceProps) {
  return (
    <Layout kind="website">
      <CanonicalLink path="/open-source" />

      <Title>The open source Google Analytics alternative</Title>

      <Description>Here you can find about the philosophy of PoeticMetric open source website analytics.</Description>

      <div className="position-relative overflow-hidden">
        <div className={styles.head}>
          <div className={classNames("bg-black bg-opacity-50 fs-5 py-5 text-center text-white", styles.innerHead)}>
            <Container className="align-items-center d-flex flex-column mw-45rem">
              <h1 className="mw-50rem">PoeticMetric is the open source Google Analytics alternative</h1>

              <div className="mt-3">
                <p>
                  Unlock the power of data with PoeticMetric - the free and open source website analytics platform designed for
                  transparency, security, and community-driven innovation.
                </p>

                <div className="aling-items-start gap-2 hstack justify-content-center mt-5">
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
            </Container>
          </div>
        </div>
      </div>

      <div className="py-4">
        <Container className="mw-45rem">
          <Markdown showTableOfContents>{content}</Markdown>
        </Container>
      </div>
    </Layout>
  );
}
