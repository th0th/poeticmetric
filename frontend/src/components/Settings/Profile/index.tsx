import { IconCircleCheck } from "@tabler/icons-react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";

type Form = {
  email: string;
  name: string;
};

type State = {
  isDone: boolean;
};

export default function Profile() {
  const { showBoundary } = useErrorBoundary();
  const [state, setState] = useState<State>({ isDone: false });
  const {
    formState: { errors, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    watch,
  } = useForm<Form>({
    defaultValues: async () => {
      const values: Form = {
        email: "",
        name: "",
      };

      try {
        const response = await api.get("/authentication/user");
        const responseJson = await response.json();

        values.email = responseJson.email;
        values.name = responseJson.name;
      } catch (e) {
        showBoundary(e);
      }

      return values;
    },
  });

  async function submit(data: Form) {
    try {
      const response = await api.patch("/authentication/user", data);
      const responseJson = await response.json();

      if (!response.ok) {
        setErrors(setError, responseJson);
      } else {
        reset({ name: responseJson.name });
        setState((s) => ({ ...s, isDone: true }));
      }
    } catch (e) {
      showBoundary(e);
    }
  }

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      if (state.isDone) {
        setState((s) => ({ ...s, isDone: false }));
      }
    });

    return () => unsubscribe();
  }, [isSubmitSuccessful, state.isDone, watch]);

  return (
    <>
      <h2 className="fs-5">Profile</h2>

      <form className="card" onSubmit={handleSubmit(submit)}>
        <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
          {state.isDone ? (
            <div className="alert alert-success align-items-center d-flex gap-6 mb-0">
              <IconCircleCheck className="flex-grow-0 flex-shrink-0" />

              <div className="flex-grow-1">
                Your profile is successfully updated.
              </div>
            </div>
          ) : null}

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
            <label className="form-label" htmlFor="input-email">E-mail address</label>

            <input
              className={classNames("form-control", { "is-invalid": errors.email })}
              disabled
              id="input-email"
              type="email"
              {...register("email")}
            />

            <div className="invalid-feedback">{errors.email?.message}</div>

            <div className="form-text">
              Your e-mail address cannot be changed directly. If you need to use a new e-mail address, please ask the owner of your
              organization to invite you as a new user with your updated e-mail address.
            </div>
          </div>

          <div>
            <button className="align-items-center btn btn-primary d-flex gap-4 justify-content-center" type="submit">
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm" />
              ) : null}

              <span>Update my profile</span>
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export const Component = Profile;
