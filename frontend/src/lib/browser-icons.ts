import { IconBrandChrome, IconBrandEdge, IconBrandFirefox, IconBrandOpera, IconBrandSafari, TablerIcon } from "@tabler/icons-react";

export const browserIcons: Record<string, TablerIcon> = {
  Chrome: IconBrandChrome,
  Firefox: IconBrandFirefox,
  "Microsoft Edge": IconBrandEdge,
  Opera: IconBrandOpera,
  Safari: IconBrandSafari,
};

export function getBrowserIcon(browserName: string): TablerIcon {
  return browserIcons[browserName] || IconBrandChrome;
}
