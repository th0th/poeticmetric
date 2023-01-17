import * as Sentry from "@sentry/nextjs";
import { NextPageContext } from "next";
import NextErrorComponent from "next/error";

type CustomErrorComponentProps = {
  statusCode: number;
};

export default function CustomErrorComponent({ statusCode }: CustomErrorComponentProps) {
  return (
    <NextErrorComponent statusCode={statusCode} />
  );
}

CustomErrorComponent.getInitialProps = async (context: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(context);

  return NextErrorComponent.getInitialProps(context);
};
