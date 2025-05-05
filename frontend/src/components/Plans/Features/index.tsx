import Feature from "~/components/Plans/Features/Feature";

export type FeaturesProps = {
  plan: Plan;
};

export default function Features({ plan }: FeaturesProps) {
  return (
    <ul className="gap-4 list-unstyled mt-8 vstack">
      {plan.features.map((feature, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Feature feature={feature} key={i} />
      ))}
    </ul>
  );
}
