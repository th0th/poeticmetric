import CanonicalLink from "~/components/CanonicalLink";
import Description from "~/components/Description";
import Plans from "~/components/Plans";
import Title from "~/components/Title";
import FAQ from "./FAQ";

export default function Pricing() {
  return (
    <>
      <CanonicalLink path="/pricing" />

      <Title>Plans and pricing</Title>

      <Description>
        Compare PoeticMetric plans and find the right analytics for your business. Get the insights you need to grow, stay compliant, and
        only pay for the events you track. No extra costs, no surprises.
      </Description>

      <div className="container py-16">
        <div className="py-24 text-center">
          <h1 className="display-5 fw-extra-bold">
            Choose a plan
            <br />
            that fuels better decisions
          </h1>

          <h4 className="fw-medium lh-base mt-12">
            PoeticMetric gives you the insights that matter, so you can make decisions
            <br />
            that take your business further, without paying for more than you need.
          </h4>
        </div>
      </div>

      <Plans className="container py-16" />

      <FAQ className="container py-16" />
    </>
  );
}
