import { useMemo } from "react";
import { useSearchParams } from "wouter";
import Breadcrumb from "~/components/Breadcrumb";
import Overview from "~/components/SiteReport/Overview";
import Path from "~/components/SiteReport/Path";
import TimeCharts from "~/components/SiteReport/TimeCharts";
import SiteReportFiltersTimeInput from "~/components/SiteReportFiltersTimeInput";
import Title from "~/components/Title";
import useSite from "~/hooks/api/useSite";
import SiteReportDataProvider from "../SiteReportDataProvider";

export default function SiteReport() {
  const [searchParams] = useSearchParams();
  const siteID = useMemo(() => Number(searchParams.get("siteID")) || undefined, [searchParams]);
  const { data: site } = useSite(siteID);
  const title = useMemo(() => `Report for ${site?.name || "..."}`, [site?.name]);

  return (
    <>
      <Title>{title}</Title>

      <div className="container py-16">
        <Breadcrumb>
          <Breadcrumb.Items>
            <Breadcrumb.Item to="/sites">Sites</Breadcrumb.Item>
          </Breadcrumb.Items>

          <Breadcrumb.Title>{title}</Breadcrumb.Title>
        </Breadcrumb>

        <SiteReportDataProvider>
          <div className="d-flex flex-row mt-12">
            <SiteReportFiltersTimeInput />
          </div>

          <div className="mt-8">
            <div className="gy-8 row">
              <div className="col-12">
                <Overview />
              </div>

              <div className="col-8">
                <TimeCharts />
              </div>

              <div className="col-4">
                <Path />
              </div>
            </div>
          </div>
        </SiteReportDataProvider>
      </div>
    </>
  );
}
