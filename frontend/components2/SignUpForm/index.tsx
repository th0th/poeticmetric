"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";
import React, { useCallback, useContext } from "react";
import ToastsContext from "~contexts/ToastsContext";
import api from "~helpers/api";
import setUserAccessToken from "~helpers/setUserAccessToken";
import useAuthUser from "~hooks/useAuthUser";
import useForm from "~hooks/useForm";

export type SignUpFormProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

type Form = {
  email: string;
  name: string;
  organizationName: string;
  password: string;
};

export default function SignUpForm({ className, ...props }: SignUpFormProps) {
  const router = useRouter();
  const { mutate } = useAuthUser();
  const { addToast } = useContext(ToastsContext);
  const [values, , updateValue, errors, setErrors] = useForm<Form>({ email: "", name: "", organizationName: "", password: "" });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();

    const response = await api.post("/users/sign-up", values);
    const responseJson = await response.json();

    if (response.ok) {
      addToast({
        body: "Welcome to PoeticMetric! Your account has been created successfully. Check your e-mail inbox to verify and activate your account.",
        variant: "success",
      });

      setUserAccessToken(responseJson.userAccessToken.token);

      await mutate();

      router.replace("/sites");
    } else {
      setErrors(responseJson);
    }
  }, [addToast, mutate, setErrors, values]);

  return (
    <div {...props} className={classNames("card mw-32rem", className)}>
      <div className="card-body">
        {errors.detail !== undefined ? (
          <div className="alert alert-danger">
            {errors.detail}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="gap-3 vstack">
            <div>
              <label className="form-label" htmlFor="input-name">Full name</label>

              <input
                className={classNames("form-control", errors.name !== undefined && "is-invalid")}
                id="input-name"
                name="name"
                onChange={updateValue}
                required
                type="text"
                value={values.name}
              />

              {errors.name !== undefined ? (
                <div className="invalid-feedback">{errors.name}</div>
              ) : null}
            </div>

            <div>
              <label className="form-label" htmlFor="input-email">E-mail address</label>

              <input
                className={classNames("form-control", errors.email !== undefined && "is-invalid")}
                id="input-email"
                name="email"
                onChange={updateValue}
                required
                type="email"
                value={values.email}
              />

              {errors.email !== undefined ? (
                <div className="invalid-feedback">{errors.email}</div>
              ) : null}
            </div>

            <div>
              <label className="form-label" htmlFor="input-password">Password</label>

              <input
                className={classNames("form-control", errors.password !== undefined && "is-invalid")}
                id="input-password"
                name="password"
                onChange={updateValue}
                required
                type="password"
                value={values.password}
              />

              {errors.password !== undefined ? (
                <div className="invalid-feedback">{errors.password}</div>
              ) : null}
            </div>

            <div>
              <label className="form-label" htmlFor="input-organization">Company name</label>

              <input
                className={classNames("form-control", errors.organizationName !== undefined && "is-invalid")}
                id="input-organization"
                name="organizationName"
                onChange={updateValue}
                required
                type="text"
                value={values.organizationName}
              />

              {errors.organizationName !== undefined ? (
                <div className="invalid-feedback">{errors.organizationName}</div>
              ) : null}
            </div>
          </div>

          <div className="d-grid mt-4">
            <button className="btn btn-primary">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
