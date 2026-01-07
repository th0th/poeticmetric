import { useGoogleLogin } from "@react-oauth/google";
import { IconWorldCancel } from "@tabler/icons-react";
import classNames from "classnames";
import { useErrorBoundary } from "react-error-boundary";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { Link } from "react-router";
import { Form } from "~/components/SiteForm";
import { withGoogleOauth } from "~/components/withGoogleOAuth";
import useSiteGoogleSearchConsoleSites from "~/hooks/api/useSiteGoogleSearchConsoleSites";
import { api } from "~/lib/api";
import { NewError } from "~/lib/errors";

export type GoogleSearchConsoleIntegrationProps = {
  siteID: number;
};

function GoogleSearchConsole({ siteID }: GoogleSearchConsoleIntegrationProps) {
  const { showBoundary } = useErrorBoundary();
  const { control, formState: { errors }, register, setValue } = useFormContext<Form>();
  const hasGoogleOauth = useWatch({ control, defaultValue: false, name: "hasGoogleOauth" });
  const isGoogleSearchConsoleIntegrationEnabled = useWatch({
    control,
    defaultValue: false,
    name: "isGoogleSearchConsoleIntegrationEnabled",
  });
  const googleSearchConsoleSiteURL = useController({ control, defaultValue: "", name: "googleSearchConsoleSiteURL" });

  const {
    data: sites,
    error: sitesError,
    isLoading: areSitesLoading,
    mutate: mutateSites,
  } = useSiteGoogleSearchConsoleSites(hasGoogleOauth ? siteID : null);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (cr) => {
      try {
        const response = await api.post(`/sites/${siteID}/google-oauth`, { authCode: cr.code });

        if (response.ok) {
          setValue("hasGoogleOauth", true);
          await mutateSites();
        }
      } catch (error) {
        showBoundary(NewError(error));
      }
    },
    overrideScope: true,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
  });

  return (
    <div>
      <h5>Google Search Console integration</h5>

      <div className="card">
        <div className="card-body">
          <div className="gap-8 vstack">
            <div className="form-text">
              You can enable this to see the Google Search Console statistics on your PoeticMetric reports. For details please see
              {" "}
              <Link target="_blank" to="/docs/websites/google-search-console-integration">here</Link>
              .
            </div>

            <div className="form-check">
              <input
                className={classNames("form-check-input", { "is-invalid": errors.isGoogleSearchConsoleIntegrationEnabled })}
                id="input-is-google-search-console-integration-enabled"
                type="checkbox"
                {...register("isGoogleSearchConsoleIntegrationEnabled")}
              />

              <label className="form-check-label" htmlFor="input-is-google-search-console-integration-enabled">
                Enable
                {" "}
                <span className="fw-semi-bold">Google Search Console</span>
                {" "}
                integration
              </label>
            </div>

            {isGoogleSearchConsoleIntegrationEnabled ? (
              <fieldset disabled={areSitesLoading}>
                {hasGoogleOauth ? (
                  <>
                    {sitesError !== undefined ? (
                      <div className="alert alert-danger align-items-center d-flex gap-6 mb-0">
                        <IconWorldCancel className="flex-grow-0 flex-shrink-0" />

                        <div>
                          An error occurred while communicating with Google Search Console.
                          {" "}
                          <button
                            className="alert-link btn-unstyled text-decoration-underline"
                            onClick={googleLogin}
                            type="button"
                          >
                            Click here
                          </button>
                          {" "}
                          to reauthenticate with Google.
                        </div>
                      </div>
                    ) : (
                      <>
                        {sites?.length === 0 ? (
                          <>
                            <div className="alert alert-warning align-items-center d-inline-flex gap-6 mb-0">
                              <IconWorldCancel className="flex-grow-0 flex-shrink-0" />

                              <div>
                                There are no sites on Google Search Console associated with this Google account.
                                {" "}
                                <button
                                  className="alert-link btn-unstyled text-decoration-underline"
                                  onClick={googleLogin}
                                  type="button"
                                >
                                  Click here
                                </button>
                                {" "}
                                to login with another Google account.
                              </div>
                            </div>
                          </>
                        ) : (
                          <div>
                            <label className="form-label" htmlFor="input-google-search-console-site-url">Google Search Console site</label>

                            <div className="align-items-center d-flex gap-4">
                              <select
                                className={classNames(
                                  "flex-shrink-0 form-select w-auto",
                                  { "is-invalid": errors.googleSearchConsoleSiteURL },
                                )}
                                id="input-google-search-console-site-url"
                                onChange={googleSearchConsoleSiteURL.field.onChange}
                                value={googleSearchConsoleSiteURL.field.value || ""}
                              >
                                {sites?.map((site) => (
                                  <option key={site.siteURL} value={site.siteURL}>{site.siteURL}</option>
                                ))}
                              </select>

                              {areSitesLoading ? (
                                <div className="spinner spinner-border spinner-border-sm text-primary" role="status" />
                              ) : null}
                            </div>

                            <div className={classNames("invalid-feedback", { "d-block": errors.googleSearchConsoleSiteURL })}>
                              {errors.googleSearchConsoleSiteURL?.message}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={googleLogin} type="button">Connect with Google</button>
                )}
              </fieldset>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withGoogleOauth(GoogleSearchConsole);
