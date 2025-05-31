type Plan = {
  description: string;
  features: Array<PlanFeature>;
  name: string;
  price: PlanPrice;
  requiresSalesContact: boolean;
};

type PlanFeature = {
  description: import("react").ReactNode;
  detail?: import("react").ReactNode;
  icon?: import("@tabler/icons-react").TablerIcon;
  variant?: "body-secondary" | "success";
};

type PlanMaxEventsPerMonth = 100000 | 500000 | 1000000 | 2000000 | 5000000;

type PlanPrice = "Free" | Record<PlanMaxEventsPerMonth, number> | {
  amount: number;
  subscriptionPeriod: OrganizationResponseSubscriptionPeriod;
};
