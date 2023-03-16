type GoogleSearchConsoleSite = {
  siteUrl: string;
};

type Site = {
  createdAt: string;
  domain: string;
  googleSearchConsoleSiteUrl: string | null;
  hasEvents: boolean;
  id: number;
  isPublic: boolean;
  name: string;
  safeQueryParameters: Array<string>;
  updatedAt: string;
};
