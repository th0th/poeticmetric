import { IconDotsVertical, IconEdit } from "@tabler/icons-react";
import classNames from "classnames";
import { JSX, KeyboardEvent, MouseEvent, PropsWithoutRef, useMemo } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useLocation } from "wouter";
import FavIcon from "~/components/FavIcon";
import Portal from "~/components/Portal";
import useAuthentication from "~/hooks/useAuthentication";

export type SiteProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  site: HydratedSite;
}>;

export default function Site({ className, site, ...props }: SiteProps) {
  const [, navigate] = useLocation();
  const { user } = useAuthentication();
  const reportLinkTo = useMemo(() => `/sites/report?id=${site.id}`, [site.id]);

  function handleItemClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest(".dropdown") === null && event.target.closest(".dropdown-menu") === null) {
      navigate(reportLinkTo);
    }
  }

  function handleItemKeyUp(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && [" ", "Enter"].includes(event.key)) {
      navigate(reportLinkTo);
    }
  }

  return (
    <div
      {...props}
      className={classNames("border-4 overflow-hidden rounded shadow", className)}
      onClick={handleItemClick}
      onKeyUp={handleItemKeyUp}
      role="button"
      tabIndex={0}
    >
      <div className="bg-primary-focus-within bg-primary-hover bg-opacity-10-focus-within bg-opacity-10-hover d-flex">
        <div className="bg-primary flex-grow-0 flex-shrink-0 ps-3" />

        <div className="align-items-center d-flex flex-fill gap-6 p-6">
          <div>
            <div className="align-items-center d-flex gap-4">
              <FavIcon className="flex-shrink-0" domain={site.domain} size={20} />

              <div className="fs-5 fw-bold text-truncate">{site.name}</div>
            </div>

            <div className="fs-7 fw-bold text-body-tertiary text-truncate">{site.domain}</div>
          </div>

          {user?.isOrganizationOwner ? (
            <div className="ms-auto">
              <Dropdown className="flex-shrink-0">
                <Dropdown.Toggle
                  bsPrefix=" "
                  className="border-0 px-4"
                  variant="outline-secondary"
                >
                  <IconDotsVertical className="d-block" size="1em" />
                </Dropdown.Toggle>

                <Portal>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} className="gap-3 hstack" to={`/sites/edit?siteID=${site.id}`}>
                      <IconEdit size="1em" />

                      Edit
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Portal>
              </Dropdown>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
