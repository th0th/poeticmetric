"use client";

import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import api from "~helpers/api";
import base64Encode from "~helpers/base64Encode";
import setUserAccessToken from "~helpers/setUserAccessToken";
import useAuthUser from "~hooks/useAuthUser";
import useForm from "~hooks/useForm";

export type SignInFormProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

type Form = {
  email: string;
  password: string;
};

export default function SignInForm({ className, ...props }: SignInFormProps) {
  const router = useRouter();
  const { mutate } = useAuthUser();
  const [values, , updateValue, errors, setErrors] = useForm<Form>({ email: "", password: "" });

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await api.post("/user-access-tokens", {}, {
      headers: { authorization: `basic ${base64Encode(`${values.email}:${values.password}`)}` },
    });
    const responseJson = await response.json();

    if (response.ok) {
      setUserAccessToken(responseJson.token);

      await mutate();

      router.replace("/sites");
    } else {
      setErrors(responseJson);
    }
  }, [mutate, router, setErrors, values.email, values.password]);

  return (
    <div {...props} className={classNames("card mw-32rem", className)}>
      <div className="card-body">
        {errors.detail !== undefined ? (
          <div className="alert alert-danger">
            {errors.detail}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div>
            <label className="form-label" htmlFor="input-email">E-mail address</label>

            <input className="form-control" id="input-email" name="email" onChange={updateValue} type="email" value={values.email} />
          </div>

          <div className="mt-2">
            <label className="form-label" htmlFor="input-password">Password</label>

            <input
              className="form-control"
              id="input-password"
              name="password"
              onChange={updateValue}
              type="password"
              value={values.password}
            />
          </div>

          <div className="d-grid mt-4">
            <button className="btn btn-primary">Sign in</button>
          </div>

          <div className="align-items-center d-flex flex-column mt-2">
            <Link
              className="fs-sm fw-semibold"
              href={{ pathname: "/password-recovery" }}
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
