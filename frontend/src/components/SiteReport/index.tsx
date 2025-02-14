import { useMemo } from "react";
import { useSearchParams } from "wouter";
import Breadcrumb from "~/components/Breadcrumb";
import SiteReportFiltersTimeInput from "~/components/SiteReportFiltersTimeInput";
import Title from "~/components/Title";
import useSite from "~/hooks/api/useSite";

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

        <div className="d-flex flex-row mt-12">
          <SiteReportFiltersTimeInput />
        </div>
      </div>
    </>
  );
}
