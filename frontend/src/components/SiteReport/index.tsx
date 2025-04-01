import { useMemo } from "react";
import { useSearchParams } from "wouter";
import Breadcrumb from "~/components/Breadcrumb";
import SiteReportFiltersTimeInput from "~/components/SiteReportFiltersTimeInput";
import Title from "~/components/Title";
import useSite from "~/hooks/api/useSite";
import SiteReportDataProvider from "../SiteReportDataProvider";
import Filters from "./Filters";
import Geography from "./Geography";
import Overview from "./Overview";
import Path from "./Path";
import Source from "./Source";
import Technology from "./Technology";
import TimeCharts from "./TimeCharts";
import TimeOfWeekTrends from "./TimeOfWeekTrends";
import UTM from "./UTM";

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
          <div className="d-flex flex-column flex-sm-row gap-4 justify-content-between mt-12">
            <SiteReportFiltersTimeInput />

            <Filters />
          </div>

          <div className="mt-8">
            <div className="gx-8 gy-8 row">
              <div className="col-12">
                <Overview />
              </div>

              <div className="col-12 col-lg-8">
                <TimeCharts />
              </div>

              <div className="col-12 col-lg-4">
                <Path />
              </div>

              <div className="col-12 col-lg-4">
                <Source />
              </div>

              <div className="col-12 col-lg-8">
                <Geography />
              </div>

              <div className="col-12 col-lg-4">
                <Technology />
              </div>

              <div className="col-12 col-lg-4">
                <TimeOfWeekTrends />
              </div>

              <div className="col-12 col-lg-4">
                <UTM />
              </div>
            </div>
          </div>
        </SiteReportDataProvider>
      </div>
    </>
  );
}
