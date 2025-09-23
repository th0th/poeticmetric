import { enGB } from "date-fns/locale/en-GB";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import dayjsDuration from "dayjs/plugin/duration";
import dayjsIsoWeek from "dayjs/plugin/isoWeek";
import dayjsLocalizedFormat from "dayjs/plugin/localizedFormat";
import dayjsRelativeTime from "dayjs/plugin/relativeTime";
import { domAnimation, LazyMotion } from "framer-motion";
import { StrictMode } from "react";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { Outlet, ScrollRestoration } from "react-router";
import AppErrorBoundary from "~/components/AppErrorBoundary";
import AuthenticationProvider from "~/components/AuthenticationProvider";
import ColorModeProvider from "~/components/ColorModeProvider";
import PostHogHandler from "~/components/PostHogHandler";
import PostHogProvider from "~/components/PostHogProvider";
import SWRConfig from "~/components/SWRConfig";
import Tags from "~/components/Tags";
import "~/styles/style.scss";

dayjs.locale("en-gb");
dayjs.extend(dayjsIsoWeek);
dayjs.extend(dayjsDuration);
dayjs.extend(dayjsLocalizedFormat);
dayjs.extend(dayjsRelativeTime);

registerLocale("en-GB", enGB);
setDefaultLocale("en-GB");

export default function App() {
  return (
    <StrictMode>
      <AppErrorBoundary>
        <PostHogProvider>
          <ScrollRestoration />

          <LazyMotion features={domAnimation}>
            <SWRConfig>
              <AuthenticationProvider>
                <ColorModeProvider>
                  <Tags />
                  <PostHogHandler />

                  <Outlet />
                </ColorModeProvider>
              </AuthenticationProvider>
            </SWRConfig>
          </LazyMotion>
        </PostHogProvider>
      </AppErrorBoundary>
    </StrictMode>
  );
}
