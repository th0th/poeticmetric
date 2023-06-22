"use client";

import Link from "next/link";
import Breadcrumb from "~components/Breadcrumb";
import Empty from "~components/Empty";
import FavIcon from "~components/FavIcon";
import useSites from "~hooks/useSites";

export default function Page() {
  const { data: sites } = useSites();

  return (
    <>
      <Breadcrumb title="Sites" />

      <div className="d-flex flex-column flex-md-row gap-2 mb-3">
        <div className="flex-grow-1" />

        <div className="d-grid">
          <Link className="btn btn-primary" href="/sites/add">Add new site</Link>
        </div>
      </div>

      {sites === undefined ? (
        <div className="d-block spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>
          {sites.length === 0 ? (
            <Empty
              description="Please add a site to start tracking its traffic."
              title="You don't have any sites yet."
            />
          ) : (
            <div className="g-4 row row-cols-1 row-cols-md-2 row-cols-lg-3">
              {sites.map((site) => (
                <div className="col" key={site.id}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title d-flex flex-row align-items-center">
                        <FavIcon alt={site.domain} domain={site.domain} size={20} />

                        <span className="ms-2 text-truncate">{site.name}</span>
                      </h5>

                      <div className="card-subtitle fs-sm fw-bold text-muted text-truncate">{site.domain}</div>
                    </div>

                    <div className="card-footer">
                      <div className="d-flex flex-column flex-sm-row gap-2">
                        <Link className="btn btn-sm btn-primary" href={`/sites/reports/${site.id}`}>View reports</Link>

                        <Link className="btn btn-sm btn-secondary" href={`/sites/edit/${site.id}`}>Edit</Link>

                        <Link className="btn btn-sm btn-danger" href="/">Delete</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
