import { useGoogleLogin } from "@react-oauth/google";
import React, { useCallback, useContext } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import useSWR from "swr";
import { AuthContext } from "../../../contexts";
import { api } from "../../../helpers";
import { withGoogleOauth } from "../../withGoogleOauth";

export type GoogleSearchConsoleSiteUrlFormGroupProps = {
  onValueChange: (value: string | null) => void;
  value: string | null;
};

export function BaseGoogleSearchConsoleSiteUrlFormGroup({ onValueChange, value }: GoogleSearchConsoleSiteUrlFormGroupProps) {
  const { mutate, organization } = useContext(AuthContext);
  const {
    data: googleSearchConsoleSites,
    isValidating,
  } = useSWR<Array<GoogleSearchConsoleSite>, Error>(organization?.hasGoogleOauth ? "/sites/google-search-console-sites" : null);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (cr) => {
      await api.post("/organization/set-google-oauth-token", { code: cr.code });

      await mutate();
    },
    overrideScope: true,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
  });

  const handleSiteUrlChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>((event) => {
    onValueChange(event.target.value);
  }, [onValueChange]);

  const handleCheckboxChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    onValueChange(event.target.checked ? "" : null);
  }, [onValueChange]);

  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== undefined && organization !== null ? (
    <>
      <Form.Group controlId="is-google-search-console-integration-enabled">
        <Form.Check
          checked={value !== null}
          label="Show Google Search Console reports"
          name="isGoogleSearchConsoleIntegrationEnabled"
          onChange={handleCheckboxChange}
          type="checkbox"
        />

        <Form.Text>You can enable this to see the Google Search Console statistics on your PoeticMetric reports.</Form.Text>
      </Form.Group>

      {value !== null ? (
        <Form.Group controlId="google-search-console-site-url">
          {organization.hasGoogleOauth ? (
            <>
              <Form.Label>Google Search Console site</Form.Label>

              <div className="align-items-center d-flex flex-row gap-2 position-relative">
                {googleSearchConsoleSites === undefined ? (
                  <Form.Control className="bottom-0 ms-5 visually-hidden p-absolute" onChange={() => {}} required value={value} />
                ) : null}

                <Form.Select
                  className="w-auto"
                  disabled={googleSearchConsoleSites === undefined}
                  onChange={handleSiteUrlChange}
                  required
                  value={value}
                >
                  <option disabled value="" />

                  {googleSearchConsoleSites?.map((s) => (
                    <option key={s.siteUrl} value={s.siteUrl}>{s.siteUrl}</option>
                  ))}
                </Form.Select>

                {isValidating ? (
                  <Spinner size="sm" variant="primary" />
                ) : null}
              </div>
            </>
          ) : (
            <Button onClick={() => googleLogin()}>Connect with Google</Button>
          )}
        </Form.Group>
      ) : null}
    </>
  ) : null;
}

export const GoogleSearchConsoleSiteUrlFormGroup = withGoogleOauth(BaseGoogleSearchConsoleSiteUrlFormGroup);
