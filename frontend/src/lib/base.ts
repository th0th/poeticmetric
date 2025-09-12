function getEnvironmentVariable(name: string, defaultValue: string): string | undefined {
  const value = import.meta.env[name];

  // development
  if (import.meta.env.MODE === "development") {
    return value;
  }

  // production
  return value || defaultValue;
}

export const baseURL = getEnvironmentVariable("VITE_BASE_URL", "https://placeholder.poeticmetric.com");
export const googleClientID = getEnvironmentVariable("VITE_GOOGLE_CLIENT_ID", "___+++PLACEHOLDER_GOOGLE_CLIENT_ID+++___");
export const isHosted = getEnvironmentVariable("VITE_IS_HOSTED", "___+++PLACEHOLDER_IS_HOSTED+++___");
export const restAPIBaseURL = getEnvironmentVariable("VITE_REST_API_BASE_URL", "https://api.placeholder.poeticmetric.com");
export const tagsEnvironment = getEnvironmentVariable("VITE_TAGS_ENVIRONMENT", "___+++PLACEHOLDER_TAGS_ENVIRONMENT+++___");
