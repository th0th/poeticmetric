import { IconMoodSad } from "@tabler/icons-react";
import classNames from "classnames";
import { JSX, PropsWithoutRef, useMemo } from "react";
import { Link } from "react-router";
import usePlan from "~/hooks/api/usePlan";
import useUsers from "~/hooks/api/useUsers";
import { disableMiddleware } from "~/lib/api";

export type PlanLimitHandlerProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  isDisabled?: boolean;
  kind: "user";
}>;

const descriptions: Record<PlanLimitHandlerProps["kind"], string> = {
  user: "You have reached the maximum number of users for your plan. Please upgrade to add more users.",
};

const titles: Record<PlanLimitHandlerProps["kind"], string> = {
  user: "User limit reached",
};

const toTitles: Record<PlanLimitHandlerProps["kind"], string> = {
  user: "Return to team",
};

const tos: Record<PlanLimitHandlerProps["kind"], string> = {
  user: "/team",
};

export default function PlanLimitHandler({ children, className, isDisabled, kind, ...props }: PlanLimitHandlerProps) {
  const { data: plan } = usePlan();
  const { data: users } = useUsers({ use: kind === "user" ? [] : [disableMiddleware] });
  const description = useMemo(() => descriptions[kind], [kind]);
  const title = useMemo(() => titles[kind], [kind]);
  const to = useMemo(() => tos[kind], [kind]);
  const toTitle = useMemo(() => toTitles[kind], [kind]);

  const isLimitReached = useMemo<boolean | undefined>(() => {
    if (kind === "user") {
      if (plan === undefined || users === undefined) {
        return undefined;
      }

      return plan.maxUsers !== -1 && users.length >= plan.maxUsers;
    }

    if (kind === "site") {
      return false;
    }

    throw new Error("Invalid kind");
  }, [kind, plan, users]);

  return isDisabled || isLimitReached === false ? children : (
    <>
      {isLimitReached === undefined ? (
        <div className="align-items-center d-flex flex-grow-1 justify-content-center">
          <div className="spinner spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div {...props} className={classNames("align-items-center d-flex flex-column", className)}>
          <IconMoodSad className="text-danger" size="6rem" />

          <div className="mt-6 mw-32rem text-center">
            <h2 className="fs-2">{title}</h2>

            <div className="fs-5_5 text-body-emphasis">{description}</div>

            <div className="d-flex flex-column flex-sm-row gap-6 justify-content-sm-center mt-8">
              <Link className="btn btn-primary" to="/billing">Go to billing</Link>

              <Link className="btn btn-outline-primary" to={to}>{toTitle}</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
