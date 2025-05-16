import { IconBolt, IconChartBar, IconCode, IconCookieOff, IconPlug, IconUsers } from "@tabler/icons-react";
import classNames from "classnames";
import { Link } from "react-router";
import CallToAction from "~/components/CallToAction";
import Description from "~/components/Description";
import Features, { FeaturesProps } from "~/components/Features";
import Title from "~/components/Title";
import styles from "./Home.module.scss";
import imageScreenshot from "./screenshot.png";

const features: FeaturesProps["features"] = [
  {
    description: "Analytics with compliance built-in",
    detail: "Privacy is where PoeticMetric actually starts, not just a checkbox we ticked later. We don't do invasive cookies or follow-your-every-move tracking. Your users get their space respected. You can feel good knowing you're doing analytics the right way, without worrying about crossing any lines.",
    icon: IconCookieOff,
    iconWrapperClassName: "bg-primary",
    title: "Privacy by Design",
  },
  {
    description: "Trust you can verify",
    detail: "PoeticMetric's code is right out in the open for anyone to see and check. If you want to dive in or even run your own version, you're more than welcome. We believe in transparency for real, not just as a buzzword.",
    icon: IconCode,
    iconWrapperClassName: "bg-primary",
    title: "Open Source",
  },
  {
    description: "Installs in minutes, not hours",
    detail: "No need to block out an afternoon or learn some new tech jargon. PoeticMetric is up and running fast, whether your stack is React, Vue, Angular, or something old-school. The setup is smooth enough to finish before your coffee cools off.",
    icon: IconPlug,
    iconWrapperClassName: "bg-primary",
    link: "/docs/websites/adding-the-script-to-your-website",
    title: "Effortless Integration",
  },
  {
    description: "Simple, clutter-free reports",
    detail: "You don't get buried in dashboards or numbers you don't care about. PoeticMetric just puts the important stuff front and center, in a way that makes sense. Whether you're new to analytics or have been staring at charts for years, you can get what you need and get back to work.",
    icon: IconChartBar,
    iconWrapperClassName: "bg-primary",
    title: "Clear Insights",
  },
  {
    description: "Built for modern workflows",
    detail: "Analytics makes more sense when you share the story. Bring in your team, show your clients, or post reports for everyone if you want to. No complicated steps, no hoops to jump through. Sharing is actually just sharing.",
    icon: IconUsers,
    iconWrapperClassName: "bg-primary",
    link: "/docs/team/introduction",
    title: "Team Collaboration",
  },
  {
    description: "Analytics at top speed",
    detail: "You won't notice PoeticMetric slowing anything down, even during your busiest times. Everything runs in the background and keeps up as traffic spikes. Your stats are always fresh, with no waiting around and no crossed fingers.",
    icon: IconBolt,
    iconWrapperClassName: "bg-primary",
    link: "https://dev.poeticmetric.com/docs/websites/adding-the-script-to-your-website",
    title: "Lightning Fast",
  },
];

export default function Home() {
  return (
    <>
      <Title>Free and open source, privacy-friendly Google Analytics alternative</Title>

      <Description>
        PoeticMetric is a free as in freedom, open source, privacy-first and regulation-compliant website analytics tool. You can keep track
        of your website&apos;s traffic without invading your visitors&apos; privacy.
      </Description>

      <section className="py-64">
        <div className="container">
          <div className="text-center">
            <h1 className="display-5 fw-bold">
              Privacy-first, regulation compliant
              <br />
              Google Analytics alternative
            </h1>

            <h4 className="fw-medium lh-base mt-12">
              PoeticMetric is a free as in freedom, open source, privacy-first and
              <br />
              regulation-compliant website analytics tool.
            </h4>
          </div>

          <div className="d-flex flex-row justify-content-center mt-16">
            <Link className="btn btn-lg btn-primary" to="/sign-up">Try PoeticMetric now</Link>
          </div>
        </div>

        <div className={classNames("container mt-32", styles.screenshotWrapper)}>
          <div className="border overflow-hidden rounded">
            <img alt="Screenshot" className="d-block w-100" src={imageScreenshot} />
          </div>
        </div>
      </section>

      <Features
        description="Analytics shouldn't be a headache or a privacy risk. With PoeticMetric, you'll have the tools (and peace of mind) to actually enjoy checking your stats."
        features={features}
        title="A Better Way to Do Analytics"
      />

      <CallToAction
        className="bg-body-tertiary"
        description="PoeticMetric gives you the clear answers you need to help your business grow, and takes care of the privacy rules in the background. You stay on the right side of the law, your customers’ trust stays intact, and you get to focus on what’s next."
        title="Confident growth. Worry-free compliance."
      />
    </>
  );
}

export const Component = Home;
