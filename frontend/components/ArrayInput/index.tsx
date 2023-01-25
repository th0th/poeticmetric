import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { Badge, CloseButton, Form } from "react-bootstrap";
import styles from "./ArrayInput.module.scss";

export type ArrayInputProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  onValueChange: (value: Array<string>) => void;
  value: Array<string>;
}>;

export function ArrayInput({ className, onValueChange, value, ...props }: ArrayInputProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const add = useCallback(() => {
    if (inputValue === "" || value.includes(inputValue)) {
      return;
    }

    onValueChange([...value, inputValue]);
    setInputValue("");
  }, [inputValue, onValueChange, setInputValue, value]);

  const handleKeyDown = useCallback<React.KeyboardEventHandler<HTMLInputElement>>((event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      add();
    }

    if (event.key === "Backspace" && inputValue === "") {
      onValueChange(value.slice(0, -1));
    }
  }, [add, inputValue, onValueChange, value]);

  return (
    <div {...props} className={classNames("align-items-center d-flex flex-row flex-wrap gap-1", styles.arrayInput, className)}>
      <div className="d-flex flex-row gap-1">
        {value.map((v) => (
          <React.Fragment key={v}>
            <Badge as="div" bg="primary" className="align-items-center d-flex flex-row gap-1 mw-20rem" title={v}>
              <span className="text-truncate">{v}</span>

              <CloseButton
                className={styles.closeButton}
                onClick={() => onValueChange(value.filter((x) => x !== v))}
                variant="white"
              />
            </Badge>
          </React.Fragment>
        ))}
      </div>

      <Form.Control
        className={classNames("flex-grow-1 w-auto", styles.formControl)}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press enter"
        size="sm"
        value={inputValue}
      />
    </div>
  );
}
