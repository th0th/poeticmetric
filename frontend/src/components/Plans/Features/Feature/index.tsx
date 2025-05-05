import { IconCheck } from "@tabler/icons-react";
import classNames from "classnames";
import millify from "millify";
import { createElement, ReactNode, useContext, useMemo } from "react";
import InfoOverlay from "~/components/InfoOverlay";
import PlansContext from "~/contexts/PlansContext";

export type FeatureProps = {
  feature: PlanFeature;
};

export default function Feature({ feature }: FeatureProps) {
  const { monthlyEventCountStepIndex, monthlyEventCountSteps } = useContext(PlansContext);

  const description = useMemo(() => feature.description === "PAGE_VIEWS"
      ? `${millify(monthlyEventCountSteps[monthlyEventCountStepIndex])} monthly page views`
      : feature.description,
    [feature.description, monthlyEventCountStepIndex, monthlyEventCountSteps],
  );

  const content = useMemo<ReactNode>(() => {
    if (feature.detail !== undefined) {
      return (
        <InfoOverlay body={feature.detail} placement="bottom">{description}</InfoOverlay>
      );
    }

    return description;
  }, [description, feature.detail]);

  return (
    <li>
      {createElement(feature.icon || IconCheck, {
        className: classNames("fs-6 me-3", `text-${feature.variant || "success"}`),
        size: "1.2em",
        stroke: 3,
      })}

      {content}
    </li>
  );
}
