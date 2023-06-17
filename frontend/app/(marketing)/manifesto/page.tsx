import { Metadata } from "next";
import Manifesto from "./manifesto.mdx";

export const metadata: Metadata = {
  alternates: { canonical: "/manifesto" },
  description: "Discover the principles that guide PoeticMetric. Our privacy-first approach, commitment to transparency, dedication to sustainability, and focus on efficiency set us apart in the analytics industry. Read our manifesto now.",
  title: "Building a Better Web: PoeticMetric's Vision",
};

export default function Page() {
  return (
    <Manifesto />
  );
}
