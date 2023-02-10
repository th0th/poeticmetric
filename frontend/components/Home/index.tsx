import React from "react";
import { CallToAction, Description, Features, FeaturesProps, Layout, Title } from "..";
import { Jumbotron } from "./Jumbotron";
import { Preview } from "./Preview";

const features: FeaturesProps["features"] = [
  {
    description: "Integrating with your website or application is a breeze. Get up and running in no time. Single page applications built tools like React.js, Vue.js and Angular are supported without any additional effort.",
    iconClassName: "bi bi-magic",
    link: {
      href: "/docs/websites/adding-the-script-to-your-website",
      title: "Read more on docs",
    },
    title: "Easy integration",
  },
  {
    description: "Simple, clear and easy to understand reports, without overwhelming you with unnecessary details. Whether you're a beginner or an experienced data analyst, you'll appreciate the clarity of our reports.",
    iconClassName: "bi bi-bar-chart-line-fill",
    title: "Simple analytics, user-friendly reports",
  },
  {
    description: "You have complete ownership of your data. There's no behavioral marketing or surveillance capitalism, giving you peace of mind that your privacy is being protected.",
    iconClassName: "bi bi-shield-fill-check",
    title: "100% data ownership",
  },
  {
    description: "API and data exporting capabilities for you to access your data and use it however you need, whether it's for further analysis or integration with other tools.",
    iconClassName: "bi bi-clipboard-data-fill",
    title: "API and data exporting",
  },
  {
    // TODO: improve this
    description: "PoeticMetric is team-ready, making it easy for multiple people to work together and collaborate on website performance analysis and optimization.",
    iconClassName: "bi bi-people-fill",
    title: "Collaboration made easy",
  },
  {
    description: "You can choose to make your site's analytics reports publicly accessible. Sharing with partners? OK. Showcasing? Also OK.",
    iconClassName: "bi bi-share-fill",
    link: {
      href: "/docs/websites/site-settings#public-reports",
      title: "Read more on docs",
    },
    title: "Publicly sharable reports",
  },
];

export function Home() {
  return (
    <Layout kind="website">
      <Title>Privacy-first, regulation compliant Google Analytics alternative</Title>
      <Description>
        PoeticMetric is a free as in freedom, open source, privacy-first and regulation-compliant web analytics tool. You can keep track of
        your website&apos;s traffic without invading your visitors&apos; privacy.
      </Description>

      <Jumbotron />

      <Preview className="pb-5 pt-0" />

      <Features className="bg-light" features={features}>
        <h2>Get insights that matter</h2>

        <div>
          With PoeticMetric&apos;s comprehensive and user-friendly analytics, say goodbye to confusing and
          cluttered reports, and hello to straightforward insights that are easy to understand and actionable.
          With PoeticMetric, you&apos;re in complete control of your data and your privacy. No more worrying about behavioral marketing or
          surveillance capitalism – your data belongs to you, and you alone.
        </div>
      </Features>

      <CallToAction showPricingLink title="Get accurate insights and take control of your data" />
    </Layout>
  );
}
