import { RouteObject } from "react-router";
import EmailAddressVerificationBlock from "~/components/EmailAddressVerificationBlock";
import Layout from "~/components/Layout";
import withAuthorization from "~/components/withAuthorization";
import withRequiredSearchParam from "~/components/withRequiredSearchParam";
import App from "./components/App";

const routes: Array<RouteObject> = [
  {
    Component: App,
    children: [
      {
        Component: Layout,
        children: [
          // site
          {
            children: [
              { lazy: () => import("~/components/Home"), path: "" },
              {
                caseSensitive: true,
                children: [
                  { lazy: () => import("~/components/BlogPage"), path: "" },
                  { caseSensitive: true, lazy: () => import("~/components/BlogPage"), path: "page/:blogPage" },
                  { caseSensitive: true, lazy: () => import("~/components/BlogPost"), path: ":blogPostSlug" },
                ],
                path: "blog",
              },
              { lazy: () => import("~/components/Contact"), path: "contact" },
              {
                caseSensitive: true,
                children: [
                  { lazy: () => import("~/components/DocsArticle"), path: "" },
                  { caseSensitive: true, lazy: () => import("~/components/DocsArticle"), path: ":docsCategorySlug/:docsArticleSlug" },
                ],
                path: "docs",
              },
              { caseSensitive: true, lazy: () => import("~/components/Manifesto"), path: "manifesto" },
              { caseSensitive: true, lazy: () => import("~/components/OpenSource"), path: "open-source" },
              { caseSensitive: true, lazy: () => import("~/components/Pricing"), path: "pricing" },
              { caseSensitive: true, lazy: () => import("~/components/PublicSiteReport"), path: "s" },
              { caseSensitive: true, lazy: () => import("~/components/PrivacyPolicy"), path: "privacy-policy" },
              { caseSensitive: true, lazy: () => import("~/components/TermsOfService"), path: "terms-of-service" },
            ],
            handle: {
              layoutVariant: "site",
            },
          },

          // application
          {
            children: [
              { lazy: () => import("~/components/Bootstrap"), path: "bootstrap" },

              // authenticated
              {
                Component: withAuthorization({ isAuthenticated: true }),
                children: [
                  { caseSensitive: true, lazy: () => import("~/components/EmailAddressVerification"), path: "email-address-verification" },
                ],
              },

              // e-mail verification block
              {
                Component: EmailAddressVerificationBlock,
                children: [
                  // billing
                  {
                    Component: withAuthorization({ isAuthenticated: true, isOrganizationOwner: true }),
                    caseSensitive: true,
                    children: [
                      { caseSensitive: true, lazy: () => import("~/components/Billing"), path: "billing" },
                    ],
                  },

                  // sites
                  {
                    children: [
                      {
                        children: [
                          { caseSensitive: true, lazy: () => import("~/components/Sites"), path: "" },
                          { caseSensitive: true, lazy: () => import("~/components/SiteForm"), path: "add" },
                          {
                            Component: withRequiredSearchParam({ check: (v) => !Number.isNaN(Number(v)), searchParamName: "siteID" }),
                            caseSensitive: true,
                            children: [
                              { caseSensitive: true, lazy: () => import("~/components/SiteForm"), path: "edit" },
                              { caseSensitive: true, lazy: () => import("~/components/OrganizationSiteReport"), path: "report" },
                            ],
                          },
                        ],
                      },
                    ],
                    path: "sites",
                  },

                  // team
                  {
                    children: [
                      {
                        children: [
                          { caseSensitive: true, lazy: () => import("~/components/Team"), path: "" },
                          { caseSensitive: true, lazy: () => import("~/components/TeamMemberForm"), path: "invite" },
                          {
                            Component: withRequiredSearchParam({ check: (v) => !Number.isNaN(Number(v)), searchParamName: "userID" }),
                            caseSensitive: true,
                            children: [
                              { caseSensitive: true, lazy: () => import("~/components/TeamMemberForm"), path: "edit" },
                            ],
                          },
                        ],
                      },
                    ],
                    path: "team",
                  },
                ],
              },

              // settings
              {
                Component: withAuthorization({ isAuthenticated: true }),
                caseSensitive: true,
                children: [
                  { caseSensitive: true, lazy: () => import("~/components/Settings/Password"), path: "password" },
                  { caseSensitive: true, lazy: () => import("~/components/Settings/Profile"), path: "profile" },
                  {
                    Component: withAuthorization({ isAuthenticated: true, isOrganizationOwner: true }),
                    caseSensitive: true,
                    children: [
                      { caseSensitive: true, lazy: () => import("~/components/Settings/AccountDeletion"), path: "account-deletion" },
                      {
                        caseSensitive: true,
                        lazy: () => import("~/components/Settings/OrganizationDetails"),
                        path: "organization-details",
                      },
                    ],
                  },
                ],
                lazy: () => import("~/components/Settings"),
                path: "settings",
              },

              // unauthenticated
              {
                Component: withAuthorization({ isAuthenticated: false }),
                children: [
                  { caseSensitive: true, lazy: () => import("~/components/Activation"), path: "activation" },
                  { caseSensitive: true, lazy: () => import("~/components/PasswordRecovery"), path: "password-recovery" },
                  { caseSensitive: true, lazy: () => import("~/components/PasswordReset"), path: "password-reset" },
                  { caseSensitive: true, lazy: () => import("~/components/SignIn"), path: "sign-in" },
                  { caseSensitive: true, lazy: () => import("~/components/SignUp"), path: "sign-up" },
                ],
              },
            ],
            handle: {
              layoutVariant: "application",
            },
          },
        ],
      },
    ],
  },
];

export default routes;
