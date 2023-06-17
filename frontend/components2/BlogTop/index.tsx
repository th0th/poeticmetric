"use client";

import classNames from "classnames";
import React, { useCallback, useContext } from "react";
import ToastsContext from "~contexts/ToastsContext";
import useForm from "~hooks/useForm";
import { api } from "../../helpers";
import styles from "./BlogTop.module.scss";

export type BlogTopProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

type Form = {
  email: string;
};

const initialForm: Form = {
  email: "",
};

export default function BlogTop({ className, ...props }: BlogTopProps) {
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>(initialForm);
  const { addToast } = useContext(ToastsContext);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    const response = await api.post("/newsletter-subscription", values);
    const responseJson = await response.json();

    if (response.ok) {
      setValues(initialForm);
      addToast({ body: "You have successfully subscribed to our newsletter! Have a nice day 💐", variant: "success" });
    } else {
      setErrors(responseJson);
    }
  }, [addToast, setErrors, setValues, values]);

  return (
    <div {...props} className={classNames("container my-5", styles.blogTop, className)}>
      <h1>PoeticMetric Blog</h1>

      <div className="mw-34rem">
        <div className="fs-5 mt-4">
          <p>
            We share informative analytics-related articles and what we learn while building a privacy-focused Google Analytics alternative.
          </p>

          <p>
            Hey there! Thanks for visiting our blog. If you&apos;d like to stay in the loop with all of our new posts and exclusive content,
            we&apos;d love for you to join our newsletter. Just enter your e-mail address below and we&apos;ll add you to the list.
            Can&apos;t wait to stay connected with you!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="input-email">E-mail address</label>

          <div className="align-items-start d-flex flex-row gap-3">
            <div className="flex-grow-1">
              <input
                className="form-control"
                id="input-email"
                name="email"
                onChange={updateValue}
                type="email"
                value={values.email}
              />
            </div>

            <button className="btn btn-primary" type="submit">Subscribe</button>
          </div>
        </form>
      </div>
    </div>
  );
}
