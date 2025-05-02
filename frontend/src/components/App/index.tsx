import { enGB } from "date-fns/locale/en-GB";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import dayjsDuration from "dayjs/plugin/duration";
import dayjsIsoWeek from "dayjs/plugin/isoWeek";
import dayjsLocalizedFormat from "dayjs/plugin/localizedFormat";
import dayjsRelativeTime from "dayjs/plugin/relativeTime";
import { domAnimation, LazyMotion } from "framer-motion";
import { lazy, Suspense, useMemo } from "react";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { Route, Router, Switch } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import AppErrorBoundary from "~/components/AppErrorBoundary";
import ColorModeProvider from "~/components/ColorModeProvider";
import Layout from "~/components/Layout";
import NotFound from "~/components/NotFound";
import SWRConfig from "~/components/SWRConfig";
import Tags from "~/components/Tags";
import withAuthorization from "~/components/withAuthorization";
import withRequiredSearchParams from "~/components/withRequiredSearchParams";
import { isHosted } from "~/lib/config";
import AuthenticationProvider from "../AuthenticationProvider";
import "~/styles/style.scss";

export type AppProps = {
  path?: string;
};

dayjs.locale("en-gb");
dayjs.extend(dayjsIsoWeek);
dayjs.extend(dayjsDuration);
dayjs.extend(dayjsLocalizedFormat);
dayjs.extend(dayjsRelativeTime);

const Activation = lazy(() => import("~/components/Activation"));
const BlogPage = lazy(() => import("~/components/BlogPage"));
const BlogPost = lazy(() => import("~/components/BlogPost"));
const Bootstrap = lazy(() => import("~/components/Bootstrap"));
const DocsArticle = lazy(() => import("~/components/DocsArticle"));
const EmailAddressVerification = lazy(() => import("~/components/EmailAddressVerification"));
const Home = lazy(() => import("~/components/Home"));
const Manifesto = lazy(() => import("~/components/Manifesto"));
const OpenSource = lazy(() => import("~/components/OpenSource"));
const PasswordRecovery = lazy(() => import("~/components/PasswordRecovery"));
const PasswordReset = lazy(() => import("~/components/PasswordReset"));
const PrivacyPolicy = lazy(() => import("~/components/PrivacyPolicy"));
const Settings = lazy(() => import("~/components/Settings"));
const SignIn = lazy(() => import("~/components/SignIn"));
const SignUp = lazy(() => import("~/components/SignUp"));
const SiteForm = lazy(() => import("~/components/SiteForm"));
const SiteReport = lazy(() => import("~/components/SiteReport"));
const Sites = lazy(() => import("~/components/Sites"));
const Team = lazy(() => import("~/components/Team"));
const TeamMemberForm = lazy(() => import("~/components/TeamMemberForm"));
const TermsOfService = lazy(() => import("~/components/TermsOfService"));

registerLocale("en-GB", enGB);
setDefaultLocale("en-GB");

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
              <ColorModeProvider>
                <Layout>
                  {isHosted ? (
                    <Tags />
                  ) : null}

                  <Suspense fallback={suspenseFallback}>
                    <Switch>
                      {/* site routes */}
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

                      {/* application routes */}
                      <Route component={Bootstrap} path="/bootstrap" />

                      {/* application routes - authenticated */}
                      <Route
                        component={withAuthorization(EmailAddressVerification, { isAuthenticated: true })}
                        path="/email-address-verification"
                      />
                      <Route component={withAuthorization(Settings, { isAuthenticated: true })} path="/settings" />
                      <Route
                        component={withAuthorization(Settings, { isAuthenticated: true, isOrganizationOwner: true })}
                        path="/settings/account-deletion"
                      />
                      <Route
                        component={withAuthorization(Settings, { isAuthenticated: true, isOrganizationOwner: true })}
                        path="/settings/organization-details"
                      />
                      <Route component={withAuthorization(Settings, { isAuthenticated: true })} path="/settings/password" />
                      <Route component={withAuthorization(Settings, { isAuthenticated: true })} path="/settings/profile" />
                      <Route component={withAuthorization(Sites, { isAuthenticated: true, isEmailVerified: true })} path="/sites" />
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
                      <Route component={withAuthorization(SiteReport, { isAuthenticated: true })} path="/sites/report" />
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

                      {/* application routes - unauthenticated */}
                      <Route component={withAuthorization(Activation, { isAuthenticated: false })} path="/activation" />
                      <Route component={withAuthorization(PasswordRecovery, { isAuthenticated: false })} path="/password-recovery" />
                      <Route component={withAuthorization(PasswordReset, { isAuthenticated: false })} path="/password-reset" />
                      <Route component={withAuthorization(SignIn, { isAuthenticated: false })} path="/sign-in" />
                      <Route component={withAuthorization(SignUp, { isAuthenticated: false })} path="/sign-up" />

                      <Route>
                        <NotFound />
                      </Route>
                    </Switch>
                  </Suspense>
                </Layout>
              </ColorModeProvider>
            </AuthenticationProvider>
          </SWRConfig>
        </Router>
      </LazyMotion>
    </AppErrorBoundary>
  );
}
