import clsx from "clsx";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import FormGroupProvider from "~/components/FormGroup/FormGroupProvider";
import FormGroupContext, { FormGroupContextType } from "~/contexts/FormGroupContext";
import styles from "./FormGroup.module.css";

export type FormGroupProps = FormGroupContextType;

export default function FormGroup(value: FormGroupProps) {
  return (
    <FormGroupProvider value={value}>
      <FormGroupConsumer />
    </FormGroupProvider>
  );
}

function FormGroupConsumer() {
  const { clearErrors, formState: { errors }, register } = useFormContext();
  const { id, inputProps: { className, ...input } = {}, labelHelper, labelText, name } = useContext(FormGroupContext);
  const isCheckboxOrRadio = ["checkbox", "radio"].includes(input?.type || "");

  return (
    <div className="form-group">
      <div className={clsx(isCheckboxOrRadio ? "form-group-inline" : "form-group")}>
        <div className={styles.inlineLabel}>
          <label className="form-label" htmlFor={id}>{labelText}</label>

          {labelHelper}
        </div>

        <input
          {...input}
          {...register(name, { onChange: () => clearErrors() })}
          className={clsx("input", (!!errors[name] || !!errors.root) && "input-invalid", className)}
          id={id}
        />
      </div>

      {!!errors[name] && typeof errors[name].message === "string" ? (
        <div>{errors[name].message}</div>
      ) : null}
    </div>
  );
}
