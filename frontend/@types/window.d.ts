type PoeticMetricConfig = {
  frontendBaseUrl: string;
  restApiBaseUrl: string;
};

interface Window {
  poeticMetric?: PoeticMetricConfig;
}
