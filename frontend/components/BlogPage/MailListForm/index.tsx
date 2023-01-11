import classNames from "classnames";
import React, { useCallback, useContext } from "react";
import { Button, Container, ContainerProps, Form } from "react-bootstrap";
import { ToastsContext } from "../../../contexts";
import { useForm } from "../../../hooks";
import styles from "./MailListForm.module.scss";

type MailListFormProps = Omit<ContainerProps, "children">;

type Form = {
  email: string;
};

const initialForm: Form = {
  email: "",
};

export function MailListForm({ className, ...props }: MailListFormProps) {
  const { addToast } = useContext(ToastsContext);
  const [values, setValues, updateValue, errors, setErrors] = useForm<Form>(initialForm);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (event) => {
    event.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_POETICMETRIC_NODE_RED_BASE_URL}/mail-list`, {
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const responseJson = await response.json();

    if (response.ok) {
      setValues(initialForm);
      addToast({ body: "You have successfully subscribed to our newsletter! Have a nice day 💐", variant: "success" });
    } else {
      setErrors(responseJson);
    }
  }, [addToast, setErrors, setValues, values]);

  return (
    <Container {...props} className={classNames(styles.wrapper, className)}>
      <div className="mw-34rem">
        <h1>PoeticMetric Blog</h1>

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

        <Form className="mt-4" onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>E-mail address</Form.Label>

            <div className="align-items-start d-flex flex-row gap-3">
              <div className="flex-grow-1">
                <Form.Control isInvalid={errors.email !== undefined} name="email" onChange={updateValue} required type="email" value={values.email} />

                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </div>

              <Button type="submit">Subscribe</Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
}
