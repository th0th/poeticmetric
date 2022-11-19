import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Card, CardProps } from "react-bootstrap";
import { Omit } from "react-bootstrap/helpers";
import { FavIcon } from "../../../components";

type SiteProps = Overwrite<Omit<CardProps, "children">, {
  site: Site;
}>;

export function Site({ site, ...props }: SiteProps) {
  const router = useRouter();

  return (
    <Card {...props}>
      <Card.Body>
        <Card.Title className="d-flex flex-row align-items-center">
          <FavIcon alt={site.domain} domain={site.domain} size={20} />

          <span className="ms-2 text-truncate">{site.name}</span>
        </Card.Title>

        <Card.Subtitle className="text-muted text-truncate">
          <small>{site.domain}</small>
        </Card.Subtitle>
      </Card.Body>

      <Card.Footer>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <Link className="btn btn-sm btn-primary" href={`/sites/reports?id=${site.id}`}>View reports</Link>

          <Link className="btn btn-sm btn-secondary" href={`/sites/edit?id=${site.id}`}>Edit</Link>

          <Link
            className="btn btn-sm btn-danger"
            href={{ pathname: router.pathname, query: { ...router.query, deleteSiteId: site.id } }}
          >
            Delete
          </Link>
        </div>
      </Card.Footer>
    </Card>
  );
}
