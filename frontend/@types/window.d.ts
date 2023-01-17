type PoeticMetricConfig = {
  frontendBaseUrl: string;
  nodeRedBaseUrl: string;
  restApiBaseUrl: string;
  stripeApiPublishableKey: string;
};

interface Window {
  poeticMetric?: PoeticMetricConfig;
}
