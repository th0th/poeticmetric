import { Metadata } from "next";
import Link from "next/link";
import Auth from "~components/Auth";
import Faq from "~components/Faq";
import Plans from "~components/Plans";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  description: "Get the insights and analytics you need to grow your business with PoeticMetric. Our pricing plans are flexible and designed to fit the needs of businesses of all sizes. Explore our pricing page to find the perfect plan for you.",
  title: "Pricing",
};

export default function Layout() {
  return (
    <div className="container py-5">
      <div className="mw-34rem">
        <h1>Simple pricing</h1>

        <div className="fs-5 mw-34rem mt-3">
          <p>
            {"Get started with a 30-day free trial on the  "}
            <strong>Business</strong>
            {" plan and then pay a fair price according to your traffic."}
          </p>

          <p>No credit card is required for the free trial.</p>
        </div>
      </div>

      <Plans />

      <div className="align-items-center d-flex flex-column mt-4">
        <Auth
          ifAuthenticated={(
            <Link className="btn btn-lg btn-primary" href="/billing">Go to billing</Link>
          )}
          ifUnauthenticated={(
            <Link className="btn btn-lg btn-primary" href="/sign-up">Start your free trial</Link>
          )}
        />
      </div>

      <Faq />
    </div>
  );
}
