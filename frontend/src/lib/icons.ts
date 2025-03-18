import {
  IconBrandApple,
  IconBrandChrome,
  IconBrandEdge,
  IconBrandFinder,
  IconBrandFirefox,
  IconBrandOpera,
  IconBrandSafari,
  IconBrandWindows,
  IconBrowser,
  IconSettings,
  TablerIcon,
} from "@tabler/icons-react";

export const browserIcons: Record<string, TablerIcon> = {
  Chrome: IconBrandChrome,
  Firefox: IconBrandFirefox,
  "Microsoft Edge": IconBrandEdge,
  Opera: IconBrandOpera,
  Safari: IconBrandSafari,
};

export function getBrowserIcon(browserName: string): TablerIcon {
  return browserIcons[browserName] || IconBrowser;
}

export const operatingSystemIcons: Record<string, TablerIcon> = {
  Windows: IconBrandWindows,
  iOS: IconBrandApple,
  macOS: IconBrandFinder,
};

export function getOperatingSystemIcon(operatingSystemName: string): TablerIcon {
  return operatingSystemIcons[operatingSystemName] || IconSettings;
}
