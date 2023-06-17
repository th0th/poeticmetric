import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isoWeek from "dayjs/plugin/isoWeek";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { Metadata } from "next";
import Bootstrap from "~components/Bootstrap";
import SwrConfig from "~components/SwrConfig";
import ToastsHandler from "~components/ToastsHandler";
import "~styles/style.scss";

dayjs.extend(updateLocale);
dayjs.extend(duration);
dayjs.extend(isoWeek);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.updateLocale("en", { weekStart: 1 });

export const metadata: Metadata = {
  description: "PoeticMetric is a free as in freedom, open source, privacy-first and regulation-compliant website analytics tool. You can keep track of your website's traffic without invading your visitors' privacy.",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL !== undefined ? new URL(process.env.NEXT_PUBLIC_BASE_URL) : undefined,
  title: {
    default: "Free and open source, privacy-friendly Google Analytics alternative",
    template: "%s | PoeticMetric",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <SwrConfig>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width" name="viewport" />
        </head>

        <body>
          <div className="d-flex flex-column min-vh-100">
            <ToastsHandler>
              {children}
            </ToastsHandler>
          </div>
        </body>
      </html>

      <Bootstrap />
    </SwrConfig>
  );
}
