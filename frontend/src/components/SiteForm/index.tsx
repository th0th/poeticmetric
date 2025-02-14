import { IconWorldCheck } from "@tabler/icons-react";
import classNames from "classnames";
import { useMemo } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useSearchParams } from "wouter";
import ActivityOverlay from "~/components/ActivityOverlay";
import Breadcrumb from "~/components/Breadcrumb";
import Result from "~/components/Result";
import SafeQueryParameters from "~/components/SiteForm/SafeQueryParameters";
import Title from "~/components/Title";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";

export type Form = {
  domain: string;
  googleSearchConsoleSiteURL: string;
  isPublic: boolean;
  name: string;
  safeQueryParameters: Array<{ value: string }>;
};

export default function SiteForm() {
  const { showBoundary } = useErrorBoundary();
  const [searchParams] = useSearchParams();
  const siteID = useMemo(() => searchParams.get("siteID"), [searchParams]);
  const title = useMemo(() => siteID === null ? "Add site" : "Edit site", [siteID]);
  const form = useForm<Form>({
    defaultValues: async () => {
      const v: Form = {
        domain: "",
        googleSearchConsoleSiteURL: "",
        isPublic: false,
        name: "",
        safeQueryParameters: [],
      };

      if (siteID !== null) {
        const response = await api.get(`/sites/${siteID}`);
        const responseJson = await response.json();

        v.domain = responseJson.domain;
        v.isPublic = responseJson.isPublic;
        v.name = responseJson.name;
        v.safeQueryParameters = responseJson.safeQueryParameters.map((d: string) => ({ value: d }));
      }

      return v;
    },
  });
  const { formState: { errors, isLoading, isSubmitSuccessful, isSubmitting }, handleSubmit, register, setError } = form;

  async function submit(data: Form) {
    const hydratedData = {
      ...data,
      googleSearchConsoleSiteURL: data.googleSearchConsoleSiteURL === "" ? null : data.googleSearchConsoleSiteURL,
      safeQueryParameters: data.safeQueryParameters.map((x) => x.value),
    };

    try {
      const response = await (siteID === null ? api.post("/sites", hydratedData) : api.patch(`/sites/${siteID}`, hydratedData));
      const responseJSON = await response.json();

      if (!response.ok) {
        setErrors(setError, responseJSON);
      }
    } catch (e) {
      showBoundary(e);
    }
  }

  return (
    <FormProvider {...form}>
      <Title>{title}</Title>

      <div className="container py-16">
        <Breadcrumb>
          <Breadcrumb.Items>
            <Breadcrumb.Item to="/sites">Sites</Breadcrumb.Item>
          </Breadcrumb.Items>

          <Breadcrumb.Title>{title}</Breadcrumb.Title>
        </Breadcrumb>

        <div className="mt-16">
          {isSubmitSuccessful ? (
            <Result
              description={siteID === null
                ? "Site is successfully created."
                : "Site has been updated."}
              icon={IconWorldCheck}
              title={siteID === null ? "Site is created" : "Site is updated"}
              to="/sites"
              toTitle="Go back to sites"
            />
          ) : (
            <form className="card overflow-hidden position-relative" onSubmit={handleSubmit(submit)}>
              <ActivityOverlay isActive={isLoading} />

              <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
                <div>
                  <label className="form-label" htmlFor="input-domain">Domain name</label>

                  <input
                    className={classNames("form-control", { "is-invalid": errors.domain })}
                    id="input-domain"
                    required
                    {...register("domain")}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="input-name">Name</label>

                  <input
                    className={classNames("form-control", { "is-invalid": errors.name })}
                    id="input-name"
                    maxLength={70}
                    minLength={1}
                    required
                    {...register("name")}
                  />

                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>

                <div>
                  <h5>Safe query parameters</h5>

                  <div className="card">
                    <div className="card-body">
                      <div className="gap-8 vstack">
                        <div className="form-text">
                          You can select query parameters that are safe to saved while processing the data. You can read more about query
                          parameters
                          {" "}
                          <Link target="_blank" to="/docs/websites/query-parameters">here</Link>
                          .
                        </div>

                        <SafeQueryParameters />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button className="align-items-center btn btn-primary d-flex gap-4" type="submit">
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />
                        {" "}
                      </>
                    ) : null}

                    {siteID === null ? "Add site" : "Save site"}
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
