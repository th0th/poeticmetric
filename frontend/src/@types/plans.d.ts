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

type PlanMonthlyEventCount = 100000 | 500000 | 1000000 | 2000000 | 5000000;

type PlanPrice = "Free" | Record<PlanMonthlyEventCount, number> | {
  amount: number;
  subscriptionPeriod: AuthenticationOrganizationSubscriptionPeriod;
};
