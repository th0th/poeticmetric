import { IconStarFilled } from "@tabler/icons-react";

export const plans: Array<Plan> = [
  {
    description: "Perfect for weekend projects, and teams who are just getting started.",
    features: [
      {
        description: "100K monthly page views",
      },
      {
        description: "Single user",
        variant: "body-secondary",
      },
      {
        description: "Single site",
        variant: "body-secondary",
      },
      {
        description: "2 years data retention",
      },
      {
        description: "Community support",
        variant: "body-secondary",
      },
    ],
    name: "Hobbyist",
    price: "Free",
    requiresSalesContact: false,
  },
  {
    description: "All the insights you need to grow your business, with bigger plans ready when you are.",
    features: [
      {
        description: "PAGE_VIEWS",
      },
      {
        description: "Up to 20 team members",
      },
      {
        description: "Up to 50 sites",
      },
      {
        description: "Unlimited data retention",
      },
      {
        description: "Official e-mail and live chat support",
      },
    ],
    name: "Pro",
    price: {
      /* eslint-disable sort-keys */
      100000: 29,
      500000: 59,
      1000000: 99,
      2000000: 149,
      5000000: 299,
      /* eslint-enable */
    },
    requiresSalesContact: false,
  },
  {
    description: "Custom solutions, priority support, and a dedicated team—built just for you.",
    features: [
      {
        description: "More than 5M monthly page views",
      },
      {
        description: "More than 20 team members",
      },
      {
        description: "More than 50 sites",
      },
      {
        description: "Unlimited data retention",
      },
      {
        description: "Priority e-mail and live chat support",
        detail: "You get e-mail support directly from an engineer when you need.",
        icon: IconStarFilled,
      },
    ],
    name: "Enterprise",
    price: {
      amount: 7800,
      subscriptionPeriod: "YEAR",
    },
    requiresSalesContact: true,
  },
];
