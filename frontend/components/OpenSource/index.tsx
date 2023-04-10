import { Container } from "react-bootstrap";
import GitHubButton from "react-github-btn";
import { Description, Layout, Markdown, Title } from "..";

type OpenSourceProps = {
  content: string;
};

export function OpenSource({ content }: OpenSourceProps) {
  return (
    <Layout kind="website">
      <Title>PoeticMetric: the open source Google Analytics alternative</Title>
      <Description>Here you can find about the philosophy of PoeticMetric open source web analytics.</Description>

      <div className="position-relative overflow-hidden">
        <video autoPlay className="d-block position-absolute start-50 top-50 translate-middle" loop muted style={{ zIndex: -1 }}>
          <source src="/open-source.mp4" type="video/mp4" />
        </video>

        <div className="bg-black bg-opacity-50 fs-5 py-5 text-center text-white" style={{ backdropFilter: "blur(8px)" }}>
          <Container className="align-items-center d-flex flex-column mw-45rem">
            <h1 className="mw-50rem">PoeticMetric is the open source Google Analytics alternative</h1>

            <div className="mt-3">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur, consequuntur ea eos eum facilis, fugit hic id,
                impedit in maiores nobis numquam officia perspiciatis quam reprehenderit unde vel vitae?
              </p>

              <div className="aling-items-start gap-2 hstack justify-content-center">
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

      <div className="py-4">
        <Container className="mw-45rem">
          <Markdown showTableOfContents>{content}</Markdown>
        </Container>
      </div>
    </Layout>
  );
}
