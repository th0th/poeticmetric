import { IconPlus } from "@tabler/icons-react";
import { Link } from "wouter";
import Breadcrumb from "~/components/Breadcrumb";
import Title from "~/components/Title";
import useSites from "~/hooks/api/useSites";
import useListFilters from "~/hooks/useListFilters";
import Site from "./Site";
import DeleteModal from "./DeleteModal";

export default function Sites() {
  const { data: sites } = useSites();
  const [listFilters, filteredSites] = useListFilters(sites, [
    {
      dataBy: "isPublic",
      dataDisplayBy: (site: HydratedSite) => site.isPublic ? "Public" : "Not public",
      name: "Public",
      searchParamName: "isPublic",
    },
  ]);

  return (
    <>
      <Title>Sites</Title>

      <div className="container py-16">
        <Breadcrumb>
          <Breadcrumb.Title>Sites</Breadcrumb.Title>
        </Breadcrumb>

        <div className="d-flex flex-column flex-md-row gap-4 mt-12">
          {listFilters}

          <div className="d-none d-md-block mx-auto" />

          <Link className="align-items-center btn btn-primary d-flex gap-2 justify-content-center overflow-hidden" to="/sites/add">
            <IconPlus className="flex-grow-0 flex-shrink-0" />

            <span className="text-truncate">Add site</span>
          </Link>
        </div>

        <div className="gap-6 mt-8 vstack">
          {filteredSites.map((site) => (
            <Site key={site.id} site={site} />
          ))}
        </div>
      </div>

      <DeleteModal />
    </>
  );
}
