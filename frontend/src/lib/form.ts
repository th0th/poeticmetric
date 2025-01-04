import { Path, UseFormSetError, UseFormSetValue } from "react-hook-form";

function hasOwnProperty<T extends object>(data: T, key: any): key is Path<T> {
  return Object.prototype.hasOwnProperty.call(data, key);
}

export function setErrors<T extends object>(setError: UseFormSetError<T>, obj: any) {
  for (const field in obj) {
    const message = obj[field];

    if (field === "detail") {
      setError("root", { message });
    } else if (field.includes("[")) {
      const match = field.match(/^(.*?)\[(\d+)]\.(.*)$/);

      if (match === null) {
        throw new Error("invalid field format");
      }

      const [, newField, index, key] = match;

      setError(`${newField}.${index}.${key}` as Path<T>, { message });
    } else if (hasOwnProperty<T>(obj, field)) {
      setError(field, { message });
    }
  }
}

export function setValues<T extends object>(setValue: UseFormSetValue<T>, obj: any) {
  for (const field in obj) {
    if (hasOwnProperty<T>(obj, field)) {
      setValue(field, obj[field]);
    }
  }
}
