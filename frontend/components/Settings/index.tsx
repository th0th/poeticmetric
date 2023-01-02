import { omit } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useId, useMemo } from "react";
import { Container, Nav, Stack, Tab, TabsProps } from "react-bootstrap";
import { Layout } from "../index";
import { AccountDeletion } from "./AccountDeletion";
import { OrganizationDetails } from "./OrganizationDetails";
import { Password } from "./Password";
import { Profile } from "./Profile";

const sectionQueryKey = "section";

export function Settings() {
  const id = useId();
  const router = useRouter();

  const activeTabKey = useMemo(() => router.query.section?.toString() || "", [router.query.section]);

  const handleTabSelect = useCallback<Exclude<TabsProps["onSelect"], undefined>>(async (eventKey) => {
    const query = omit(router.query, [sectionQueryKey]);

    if (eventKey !== null && eventKey !== "") {
      query[sectionQueryKey] = eventKey;
    }

    await router.push({ pathname: router.pathname, query }, undefined, { scroll: false });
  }, [router]);

  return (
    <Layout kind="app">
      <Head>
        <title>Settings</title>
      </Head>

      <Container className="flex-grow-1 py-4">
        <h1>Settings</h1>

        <Tab.Container activeKey={activeTabKey} id={id} onSelect={handleTabSelect}>
          <div className="d-flex flex-column flex-md-row gap-3 gap-md-4 mt-4">
            <div className="bg-white flex-grow-0 text-center text-md-start text-nowrap">
              <Nav className="border flex-column fs-sm p-2 rounded-3" variant="pills">
                <Stack gap={3}>
                  <div>
                    <div className="fs-xs fw-bold px-3 py-2 text-secondary">Account settings</div>

                    <Nav.Item>
                      <Nav.Link eventKey="">Profile</Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link eventKey="password">Password</Nav.Link>
                    </Nav.Item>
                  </div>

                  <div>
                    <div className="fs-xs fw-bold px-3 py-2 text-secondary">Organization settings</div>

                    <Nav.Item>
                      <Nav.Link eventKey="organization-details">Organizations details</Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link eventKey="account-deletion">Account deletion</Nav.Link>
                    </Nav.Item>
                  </div>
                </Stack>
              </Nav>
            </div>

            <div className="flex-grow-1">
              <Tab.Content>
                <Tab.Pane eventKey="">
                  <Profile />
                </Tab.Pane>

                <Tab.Pane eventKey="password">
                  <Password />
                </Tab.Pane>

                <Tab.Pane eventKey="organization-details">
                  <OrganizationDetails />
                </Tab.Pane>

                <Tab.Pane eventKey="account-deletion">
                  <AccountDeletion />
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </Container>
    </Layout>
  );
}
