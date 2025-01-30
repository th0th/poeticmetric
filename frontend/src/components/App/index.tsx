import { domAnimation, LazyMotion } from "framer-motion";
import { lazy, Suspense, useMemo } from "react";
import { Route, Router, Switch } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import AppErrorBoundary from "~/components/AppErrorBoundary";
import Layout from "~/components/Layout";
import NotFound from "~/components/NotFound";
import SWRConfig from "~/components/SWRConfig";
import withAuthorization from "~/components/withAuthorization";
import withRequiredSearchParams from "~/components/withRequiredSearchParams";
import AuthenticationProvider from "../AuthenticationProvider";
import "~/styles/style.scss";

export type AppProps = {
  path?: string;
};

const BlogPage = lazy(() => import("~/components/BlogPage"));
const BlogPost = lazy(() => import("~/components/BlogPost"));
const Bootstrap = lazy(() => import("~/components/Bootstrap"));
const DocsArticle = lazy(() => import("~/components/DocsArticle"));
const Home = lazy(() => import("~/components/Home"));
const Manifesto = lazy(() => import("~/components/Manifesto"));
const OpenSource = lazy(() => import("~/components/OpenSource"));
const PasswordRecovery = lazy(() => import("~/components/PasswordRecovery"));
const PasswordReset = lazy(() => import("~/components/PasswordReset"));
const PrivacyPolicy = lazy(() => import("~/components/PrivacyPolicy"));
const Settings = lazy(() => import("~/components/Settings"));
const SignIn = lazy(() => import("~/components/SignIn"));
const SiteForm = lazy(() => import("~/components/SiteForm"));
const Sites = lazy(() => import("~/components/Sites"));
const Team = lazy(() => import("~/components/Team"));
const TeamMemberForm = lazy(() => import("~/components/TeamMemberForm"));
const TermsOfService = lazy(() => import("~/components/TermsOfService"));

export default function App({ path }: AppProps) {
  const suspenseFallback = useMemo(() => (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center">
      <ActivityIndicator />
    </div>
  ), []);

  return (
    <AppErrorBoundary>
      <LazyMotion features={domAnimation}>
        <Router ssrPath={path}>
          <SWRConfig>
            <AuthenticationProvider>
              <Layout>
                <Suspense fallback={suspenseFallback}>
                  <Switch>
                    <Route component={Home} path="/" />
                    <Route component={BlogPage} path="/blog" />
                    <Route component={BlogPage} path="/blog/page/:blogPage" />
                    <Route component={BlogPost} path="/blog/:blogPostSlug" />
                    <Route component={DocsArticle} path="/docs" />
                    <Route component={DocsArticle} path="/docs/:docsCategorySlug/:docsArticleSlug" />
                    <Route component={Manifesto} path="/manifesto" />
                    <Route component={OpenSource} path="/open-source" />
                    <Route component={PrivacyPolicy} path="/privacy-policy" />
                    <Route component={TermsOfService} path="/terms-of-service" />

                    <Route component={Bootstrap} path="/bootstrap" />
                    <Route component={withAuthorization(PasswordRecovery, { isAuthenticated: false })} path="/password-recovery" />
                    <Route component={withAuthorization(PasswordReset, { isAuthenticated: false })} path="/password-reset" />
                    <Route component={withAuthorization(Settings, { isAuthenticated: true })} path="/settings" />
                    <Route
                      component={withAuthorization(Settings, { isAuthenticated: true, isOrganizationOwner: true })}
                      path="/settings/organization-details"
                    />
                    <Route component={withAuthorization(Settings, { isAuthenticated: true })} path="/settings/password" />
                    <Route component={withAuthorization(Settings, { isAuthenticated: true })} path="/settings/profile" />
                    <Route component={withAuthorization(SignIn, { isAuthenticated: false })} path="/sign-in" />
                    <Route component={withAuthorization(Sites, { isAuthenticated: true })} path="/sites" />
                    <Route
                      component={withAuthorization(SiteForm, { isAuthenticated: true, isOrganizationOwner: true })}
                      path="/sites/add"
                    />
                    <Route
                      component={withAuthorization(withRequiredSearchParams(SiteForm, ["siteID"]), {
                        isAuthenticated: true,
                        isOrganizationOwner: true,
                      })}
                      path="/sites/edit"
                    />
                    <Route component={withAuthorization(Team, { isAuthenticated: true })} path="/team" />
                    <Route
                      component={withAuthorization(withRequiredSearchParams(TeamMemberForm, ["userID"]), {
                        isAuthenticated: true,
                        isOrganizationOwner: true,
                      })}
                      path="/team/edit"
                    />
                    <Route
                      component={withAuthorization(TeamMemberForm, { isAuthenticated: true, isOrganizationOwner: true })}
                      path="/team/invite"
                    />

                    <Route>
                      <NotFound />
                    </Route>
                  </Switch>
                </Suspense>
              </Layout>
            </AuthenticationProvider>
          </SWRConfig>
        </Router>
      </LazyMotion>
    </AppErrorBoundary>
  );
}
