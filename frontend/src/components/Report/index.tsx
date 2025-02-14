import { useMemo } from "react";
import Breadcrumb from "~/components/Breadcrumb";
import ReportFiltersTimeInput from "~/components/ReportFiltersTimeInput";
import Title from "~/components/Title";
import useSite from "~/hooks/api/useSite";
import useSearchParams from "~/hooks/useSearchParams";

export default function Report() {
  const [,searchParams] = useSearchParams();
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

        <ReportFiltersTimeInput />
      </div>
    </>
  );
}
