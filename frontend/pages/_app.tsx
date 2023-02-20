import enGb from "date-fns/locale/en-GB";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isoWeek from "dayjs/plugin/isoWeek";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "highlight.js/styles/stackoverflow-light.css";
import { AppProps } from "next/app";
import React, { useEffect } from "react";
import { registerLocale } from "react-datepicker";
import { AuthHandler, PoeticMetric, SwrConfig, ToastsHandler } from "../components";
import "../styles/style.scss";

dayjs.extend(updateLocale);
dayjs.extend(duration);
dayjs.extend(isoWeek);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.updateLocale("en", { weekStart: 1 });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    registerLocale("en-GB", enGb);
  }, []);

  return (
    <SwrConfig>
      <AuthHandler>
        <ToastsHandler>
          <Component {...pageProps} />
        </ToastsHandler>
      </AuthHandler>

      {process.env.NEXT_PUBLIC_HOSTED === "true" ? (
        <PoeticMetric />
      ) : null}
    </SwrConfig>
  );
}
