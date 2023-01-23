type PoeticMetricConfig = {
  frontendBaseUrl: string;
  nodeRedBaseUrl: string;
  restApiBaseUrl: string;
};

interface Window {
  poeticMetric?: PoeticMetricConfig;
}
