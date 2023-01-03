export const plans: Array<Plan> = [
  {
    description: "A straightforward, privacy-focused analytics solution for small businesses",
    isPriorityEmailSupportEnabled: false,
    maxEventsPerMonth: 100_000,
    maxUsers: 1,
    name: "Basic",
    priceMonthly: 12,
  },
  {
    description: "A comprehensive analytics solution for growing businesses",
    isPriorityEmailSupportEnabled: false,
    maxEventsPerMonth: 1_000_000,
    maxUsers: 10,
    name: "Pro",
    priceMonthly: 20,
  },
  {
    description: "High-capacity event tracking for large organizations",
    isPriorityEmailSupportEnabled: true,
    maxEventsPerMonth: 5_000_000,
    maxUsers: 50,
    name: "Business",
    priceMonthly: 60,
  },
];
