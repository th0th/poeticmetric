import { useGoogleLogin } from "@react-oauth/google";
import React, { useCallback, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import useSWR from "swr";
import { AuthContext } from "../../../contexts";
import { api } from "../../../helpers";
import { withGoogleOauth } from "../../withGoogleOauth";

export type GoogleSearchConsoleSiteUrlFormGroupProps = {
  onValueChange: (value: string | null) => void;
  value: string | null;
};

export function BaseGoogleSearchConsoleSiteUrlFormGroup({ onValueChange, value }: GoogleSearchConsoleSiteUrlFormGroupProps) {
  const { organization } = useContext(AuthContext);
  const { data: googleSearchConsoleSites } = useSWR<Array<GoogleSearchConsoleSite>, Error>("/sites/google-search-console-sites");

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (cr) => {
      await api.post("/organization/set-google-oauth-token", { code: cr.code });
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
          {organization.googleOauthRefreshToken === null ? (
            <Button onClick={() => googleLogin()}>Connect with Google</Button>
          ) : (
            <>
              <Form.Label>Google Search Console site</Form.Label>

              <Form.Select className="w-auto" onChange={handleSiteUrlChange} required value={value}>
                <option disabled value="" />

                {googleSearchConsoleSites?.map((s) => (
                  <option key={s.siteUrl} value={s.siteUrl}>{s.siteUrl}</option>
                ))}
              </Form.Select>
            </>
          )}
        </Form.Group>
      ) : null}
    </>
  ) : null;
}

export const GoogleSearchConsoleSiteUrlFormGroup = withGoogleOauth(BaseGoogleSearchConsoleSiteUrlFormGroup);
