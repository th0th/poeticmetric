import { omit } from "lodash";
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from "react";

type ErrorKeys<V> = keyof V | "detail";
type Errors<V> = Partial<Record<ErrorKeys<V>, string>>;
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

type UpdateValue<V> = (...args: [key: keyof V, value: any] | [FormChangeEvent]) => void;

function isArgsForFormChangeEvent(args: any): args is [FormChangeEvent] {
  return args.length === 1;
}

function isArgsForCustom<V>(args: any): args is [keyof V, any] {
  return args.length === 2;
}

export function useForm<V>(initialValues: V): [
  V,
  Dispatch<SetStateAction<V>>,
  UpdateValue<V>,
  Errors<V>,
  Dispatch<SetStateAction<Errors<V>>>,
  () => void,
] {
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<Errors<V>>({});

  const updateValue = useCallback<UpdateValue<V>>((...args: any) => {
    let name: keyof V;
    let value: any;

    if (isArgsForFormChangeEvent(args)) {
      const event = args[0];

      name = event.target.name as keyof V;

      if (["checkbox", "radio"].includes(event.target.type)) {
        value = (event.target as HTMLInputElement).checked;
      } else {
        value = event.target.value;
      }
    } else if (isArgsForCustom<V>(args)) {
      [name, value] = args;
    } else {
      throw new Error("invalid parameters.");
    }

    setValues((v) => ({ ...v, [name]: value }));

    setErrors((e) => (omit<Errors<V>>(e, [name, "detail"])));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return [values, setValues, updateValue, errors, setErrors, reset];
}
