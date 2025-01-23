import { IconPlus, IconTrash } from "@tabler/icons-react";
import classNames from "classnames";
import { JSX } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Form } from "..";

export type SafeQueryParametersProps = JSX.IntrinsicElements["div"];

export default function SafeQueryParameters({ ...props }: SafeQueryParametersProps) {
  const { control, formState: { errors }, register } = useFormContext<Form>();
  const { append, fields, remove } = useFieldArray<Form>({ control, name: "safeQueryParameters" });

  function add() {
    append({ value: "" });
  }

  return (
    <div {...props}>
      <button
        className="align-items-center btn btn-primary btn-sm gap-1 d-flex flex-row"
        onClick={add}
        type="button"
      >
        <IconPlus size={16} />

        Add
      </button>

      {fields.length > 0 ? (
        <div className="gap-2 mt-8 vstack">
          {fields.map((field, index) => (
            <div className="input-group input-group-sm" key={field.id}>
              <input
                className={classNames("form-control mw-12rem", { "is-invalid": errors.safeQueryParameters?.[index]?.value })}
                placeholder="query parameter"
                type="text"
                {...register(`safeQueryParameters.${index}.value`)}
              />

              <div className="invalid-feedback">{errors.safeQueryParameters?.[index]?.value?.message}</div>

              <button className="btn btn-danger" onClick={() => remove(index)} type="button">
                <IconTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
