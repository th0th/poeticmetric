import { usePrevious } from "@react-hookz/web";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import classNames from "classnames";
import { useEffect, useEffectEvent, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm, useWatch } from "react-hook-form";
import { api } from "~/lib/api";
import { NewError } from "~/lib/errors";
import { setErrors } from "~/lib/form";

type Form = {
  name: string;
};

type State = {
  isDone: boolean;
};

export default function OrganizationDetails() {
  const { showBoundary } = useErrorBoundary();
  const [state, setState] = useState<State>({ isDone: false });
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<Form>({
    defaultValues: async () => {
      const values: Form = {
        name: "",
      };

      try {
        const response = await api.get("/organization");
        const responseJson = await response.json();

        values.name = responseJson.name;
      } catch (error) {
        showBoundary(NewError(error));
      }

      return values;
    },
  });
  const values = useWatch({ control });
  const previousValues = usePrevious(values);

  async function submit(data: Form) {
    try {
      const response = await api.patch("/organization", data);
      const responseJson = await response.json();

      if (!response.ok) {
        setErrors(setError, responseJson);
      } else {
        reset({ name: responseJson.name });
        setState((s) => ({ ...s, isDone: true }));
      }
    } catch (error) {
      showBoundary(NewError(error));
    }
  }

  const handleChange = useEffectEvent(() => {
    if (state.isDone && JSON.stringify(values) !== JSON.stringify(previousValues)) {
      setState((s) => ({ ...s, isDone: false }));
    }
  });

  useEffect(() => {
    handleChange();
  }, [previousValues, values]);

  return (
    <>
      <h2 className="fs-5">Organization details</h2>

      <form className="card" onSubmit={handleSubmit(submit)}>
        <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
          <div>
            <div className="mb-8">
              Organization details are used only for displaying your organization&apos;s name on the website, it doesn&apos;t affect any
              other functionality.
            </div>

            {state.isDone ? (
              <div className="alert alert-success align-items-center d-flex gap-6 mb-0">
                <IconCircleCheck className="flex-grow-0 flex-shrink-0" />

                <div className="flex-grow-1">
                  Organization details are updated.
                </div>
              </div>
            ) : (
              <div className="alert alert-warning align-items-center d-flex gap-6 mb-0">
                <IconAlertTriangle className="flex-grow-0 flex-shrink-0" />

                <div className="flex-grow-1">
                  If you need to change company details for invoices and receipts, please go to the billing section.
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="input-name">Name</label>

            <input
              className={classNames("form-control", { "is-invalid": errors.name })}
              id="input-name"
              required
              type="text"
              {...register("name")}
            />

            <div className="invalid-feedback">{errors.name?.message}</div>
          </div>

          <div>
            <button className="align-items-center btn btn-primary d-flex gap-4 justify-content-center" type="submit">
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm" />
              ) : null}

              <span>Update organization details</span>
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export const Component = OrganizationDetails;
