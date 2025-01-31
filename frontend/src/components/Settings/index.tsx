import classNames from "classnames";
import { lazy } from "react";
import { Link, Redirect, Route } from "wouter";
import Breadcrumb from "~/components/Breadcrumb";
import Title from "~/components/Title";
import useAuthentication from "~/hooks/useAuthentication";

const AccountDeletion = lazy(() => import("./AccountDeletion"));
const OrganizationDetails = lazy(() => import("./OrganizationDetails"));
const Password = lazy(() => import("./Password"));
const Profile = lazy(() => import("./Profile"));

export default function Settings() {
  const { user } = useAuthentication();

  return (
    <>
      <Title>Settings</Title>

      <div className="container py-16">
        <Breadcrumb>
          <Breadcrumb.Title>Settings</Breadcrumb.Title>
        </Breadcrumb>

        <div className="mt-12 row">
          <div className="col-12 col-md-auto">
            <ul className="flex-column fs-7 nav">
              <li className="nav-item">
                <div className="fs-8 fw-bold nav-link text-body-secondary">Account settings</div>
              </li>

              <li className="nav-item">
                <Link
                  className={(isActive) => classNames(
                    "nav-link position-relative rounded text-body z-2-focus-visible",
                    isActive && "bg-body-secondary",
                    !isActive && "bg-body-tertiary-focus-visible bg-body-tertiary-hover",
                  )}
                  to="/settings/profile"
                >
                  Profile
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={(isActive) => classNames(
                    "nav-link position-relative rounded text-body z-2-focus-visible",
                    isActive && "bg-body-secondary",
                    !isActive && "bg-body-tertiary-focus-visible bg-body-tertiary-hover",
                  )}
                  to="/settings/password"
                >
                  Password
                </Link>
              </li>

              {user?.isOrganizationOwner ? (
                <>
                  <li className="mt-6 nav-item">
                    <div className="fs-8 fw-bold nav-link text-body-secondary">Organization settings</div>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={(isActive) => classNames(
                        "nav-link position-relative rounded text-body z-2-focus-visible",
                        isActive && "bg-body-secondary",
                        !isActive && "bg-body-tertiary-focus-visible bg-body-tertiary-hover",
                      )}
                      to="/settings/organization-details"
                    >
                      Organization details
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={(isActive) => classNames(
                        "nav-link position-relative rounded text-body z-2-focus-visible",
                        isActive && "bg-body-secondary",
                        !isActive && "bg-body-tertiary-focus-visible bg-body-tertiary-hover",
                      )}
                      to="/settings/account-deletion"
                    >
                      Account deletion
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </div>

          <div className="col">
            <Route component={AccountDeletion} path="/settings/account-deletion" />
            <Route component={OrganizationDetails} path="/settings/organization-details" />
            <Route component={Password} path="/settings/password" />
            <Route component={Profile} path="/settings/profile" />

            <Route path="/settings"><Redirect to="/settings/profile" /></Route>
          </div>
        </div>
      </div>
    </>
  );
}
