import { IconMoodSad } from "@tabler/icons-react";
import classNames from "classnames";
import { JSX, PropsWithoutRef, useMemo } from "react";
import { Link } from "react-router";
import useOrganizationUsage from "~/hooks/api/useOrganizationUsage";

export type PlanLimitHandlerProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  isDisabled?: boolean;
  kind: "site" | "user";
}>;

const descriptions: Record<PlanLimitHandlerProps["kind"], string> = {
  site: "You have reached the maximum number of sites for your plan. Please upgrade to add more sites.",
  user: "You have reached the maximum number of users for your plan. Please upgrade to add more users.",
};

const titles: Record<PlanLimitHandlerProps["kind"], string> = {
  site: "Site limit reached",
  user: "User limit reached",
};

const toTitles: Record<PlanLimitHandlerProps["kind"], string> = {
  site: "Return to sites",
  user: "Return to team",
};

const tos: Record<PlanLimitHandlerProps["kind"], string> = {
  site: "/sites",
  user: "/team",
};

export default function PlanLimitHandler({ children, className, isDisabled, kind, ...props }: PlanLimitHandlerProps) {
  const { data: organizationUsage } = useOrganizationUsage();

  const isBlocked = useMemo<boolean | undefined>(() => {
    if (organizationUsage === undefined) {
      return undefined;
    }

    return {
      site: !organizationUsage.canAddSite,
      user: !organizationUsage.canAddUser,
    }[kind];
  }, [kind, organizationUsage]);

  if (isDisabled || isBlocked === false) {
    return children;
  }

  if (isBlocked) {
    return (
      <div {...props} className={classNames("align-items-center d-flex flex-column", className)}>
        <IconMoodSad className="text-danger" size="6rem" />

        <div className="mt-6 mw-32rem text-center">
          <h2 className="fs-2">{titles[kind]}</h2>

          <div className="fs-5_5 text-body-emphasis">{descriptions[kind]}</div>

          <div className="d-flex flex-column flex-sm-row gap-6 justify-content-sm-center mt-8">
            <Link className="btn btn-primary" to="/billing">Go to billing</Link>

            <Link className="btn btn-outline-primary" to={tos[kind]}>{toTitles[kind]}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center">
      <div className="spinner spinner-border text-primary" role="status" />
    </div>
  );
}
