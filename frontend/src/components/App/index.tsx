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
import ColorModeProvider from "~/components/ColorModeProvider";
import SWRConfig from "~/components/SWRConfig";
import Tags from "~/components/Tags";
import { isHosted } from "~/lib/config";
import AuthenticationProvider from "../AuthenticationProvider";
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
        <ScrollRestoration />

        <LazyMotion features={domAnimation}>
          <SWRConfig>
            <AuthenticationProvider>
              <ColorModeProvider>
                <Tags />
                {isHosted ? (
                  <Tags />
                ) : null}

                <Outlet />
              </ColorModeProvider>
            </AuthenticationProvider>
          </SWRConfig>
        </LazyMotion>
      </AppErrorBoundary>
    </StrictMode>
  );
}
