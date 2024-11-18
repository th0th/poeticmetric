import { ReactNode } from "react";
import FormGroupContext, { FormGroupContextType } from "~/contexts/FormGroupContext";

export default function FormGroupProvider({ children, value }: { children: ReactNode; value: FormGroupContextType }) {
  return (
    <FormGroupContext.Provider value={value}>
      {children}
    </FormGroupContext.Provider>
  );
}
