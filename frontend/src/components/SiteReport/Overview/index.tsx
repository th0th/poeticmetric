import { IconArrowRight, IconTrendingDown, IconTrendingUp, TablerIcon } from "@tabler/icons-react";
import classNames from "classnames";
import { createElement } from "react";
import useSiteOverviewReport from "~/hooks/api/useSiteOverviewReport";

const changeVariantIcons: Record<DisplayVariant, TablerIcon> = {
  danger: IconTrendingDown,
  secondary: IconArrowRight,
  success: IconTrendingUp,
};

const changeVariantClassNames: Record<DisplayVariant, string> = {
  danger: "text-danger",
  secondary: "text-secondary",
  success: "text-success",
};

export default function Overview() {
  const { data: report } = useSiteOverviewReport();

  return (
    <div className="card">
      <div className="card-body">
        {report === undefined ? (
          <div>loading</div>
        ) : (
          <div className="gy-6 row row-cols-1 row-cols-lg-4 row-cols-sm-2 text-center text-sm-start">
            <div className="col">
              <div className="fs-7 fw-medium">Visitors</div>

              <div className="fs-3 fw-medium">{report.visitorCountDisplay}</div>

              <div className={classNames("fs-7 gap-2 hstack justify-content-center justify-content-sm-start", changeVariantClassNames[report.visitorCountPercentageChangeVariant])}>
                {createElement(changeVariantIcons[report.visitorCountPercentageChangeVariant], { size: "1em" })}

                {`${report.visitorCountPercentageChange}%`}
              </div>
            </div>

            <div className="col">
              <div className="fs-7 fw-medium">Page views</div>

              <div className="fs-3 fw-medium">{report.pageViewCountDisplay}</div>

              <div className={classNames("fs-7 gap-2 hstack justify-content-center justify-content-sm-start", changeVariantClassNames[report.pageViewCountPercentageChangeVariant])}>
                {createElement(changeVariantIcons[report.pageViewCountPercentageChangeVariant], { size: "1em" })}

                {`${report.pageViewCountPercentageChange}%`}
              </div>
            </div>

            <div className="col">
              <div className="fs-7 fw-medium">Page views per visitor</div>

              <div className="fs-3 fw-medium">{report.pageViewCountPerVisitorDisplay}</div>

              <div
                className={classNames("fs-7 gap-2 hstack justify-content-center justify-content-sm-start", changeVariantClassNames[report.pageViewCountPerVisitorPercentageChangeVariant])}
              >
                {createElement(changeVariantIcons[report.pageViewCountPerVisitorPercentageChangeVariant], { size: "1em" })}

                {report.pageViewCountPerVisitorPercentageChangeDisplay}
              </div>
            </div>

            <div className="col">
              <div className="fs-7 fw-medium">Average page duration</div>

              <div className="fs-3 fw-medium">{report.averagePageViewDurationSecondsDisplay}</div>

              <div
                className={classNames("fs-7 gap-2 hstack justify-content-center justify-content-sm-start", changeVariantClassNames[report.averagePageViewDurationSecondsPercentageChangeVariant])}
              >
                {createElement(changeVariantIcons[report.averagePageViewDurationSecondsPercentageChangeVariant], { size: "1em" })}

                {report.averagePageViewDurationSecondsPercentageChangeDisplay}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
