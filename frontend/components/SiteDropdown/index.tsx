import React from "react";
import { Dropdown } from "react-bootstrap";
import { useSites } from "../../hooks";

export function SiteDropdown() {
  const { data: sites } = useSites();

  return (
    <Dropdown>
      <Dropdown.Toggle size="sm" variant="outline-primary">Site</Dropdown.Toggle>
    </Dropdown>
  );
}
