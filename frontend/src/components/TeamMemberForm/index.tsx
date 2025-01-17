import classNames from "classnames";
import { useMemo } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import ActivityOverlay from "~/components/ActivityOverlay";
import Avatar from "~/components/Avatar";
import Breadcrumb from "~/components/Breadcrumb";
import Title from "~/components/Title";
import useSearchParams from "~/hooks/useSearchParams";
import { api } from "~/lib/api";
import { setErrors } from "~/lib/form";

type Form = {
  email: string;
  name: string;
};

export default function TeamMemberForm() {
  const { showBoundary } = useErrorBoundary();
  const { searchParams } = useSearchParams();
  const userID = searchParams.get("userID");
  const title = useMemo(() => userID === null ? "Invite team member" : "Edit team member", [userID]);
  const { formState: { errors, isLoading, isSubmitting }, handleSubmit, register, setError, watch } = useForm<Form>({
    defaultValues: async () => {
      const v: Form = {
        email: "",
        name: "",
      };

      if (userID !== null) {
        const response = await api.get(`/users/${userID}`);
        const responseJson = await response.json();

        v.email = responseJson.email;
        v.name = responseJson.name;
      }

      return v;
    },
  });
  const email = watch("email", "");

  async function submit(data: Form) {
    try {
      const response = await (userID === null ? api.post("/users", data) : api.patch(`/users/${userID}`, data));
      const responseJSON = await response.json();

      if (!response.ok) {
        setErrors(setError, responseJSON);
      }
    } catch (e) {
      showBoundary(e);
    }
  }

  return (
    <>
      <Title>{title}</Title>

      <div className="container py-16">
        <Breadcrumb>
          <Breadcrumb.Items>
            <Breadcrumb.Item to="/team">Team</Breadcrumb.Item>
          </Breadcrumb.Items>

          <Breadcrumb.Title>{title}</Breadcrumb.Title>
        </Breadcrumb>

        <form className="card mt-16 overflow-hidden position-relative" onSubmit={handleSubmit(submit)}>
          <ActivityOverlay isActive={isLoading} />

          <fieldset className="card-body gap-12 vstack" disabled={isSubmitting}>
            <Avatar alt="Avatar" className="mx-auto" email={email} size={128} />

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
              <label className="form-label" htmlFor="input-email">E-mail address</label>

              <input
                className={classNames("form-control", { "is-invalid": errors.email })}
                disabled={userID !== null}
                id="input-email"
                required
                type="email"
                {...register("email")}
              />

              <div className="invalid-feedback">{errors.email?.message}</div>

              {userID !== null ? (
                <div className="form-text">
                  Changing a team member&apos;s e-mail address after creation is not possible. You can delete this account and send an
                  invitation to the new e-mail address.
                </div>
              ) : null}
            </div>

            <div>
              <button className="align-items-center btn btn-primary d-flex gap-4" type="submit">
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    {" "}
                  </>
                ) : null}

                {userID === null ? "Invite team member" : "Save team member"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
}
