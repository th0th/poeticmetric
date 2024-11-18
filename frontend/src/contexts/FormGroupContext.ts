import { createContext, JSX, ReactNode } from "react";

export type FormGroupContextType = {
  id: string;
  inputProps?: Overwrite<JSX.IntrinsicElements["input"], { className?: string }>;
  labelHelper?: ReactNode;
  labelText: string;
  name: string;
};

const FormGroupContext = createContext<FormGroupContextType>({
  id: "",
  labelText: "",
  name: "",
});

export default FormGroupContext;
