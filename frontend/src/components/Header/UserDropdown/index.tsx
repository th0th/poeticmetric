import { Dropdown, DropdownProps } from "react-bootstrap";
import { Link } from "wouter";
import Avatar from "~/components/Avatar";
import useAuthentication from "~/hooks/useAuthentication";

export type UserDropdownProps = Overwrite<Omit<DropdownProps, "align" | "children">, {
  layoutVariant: LayoutVariant;
}>;

export default function UserDropdown({ layoutVariant, ...props }: UserDropdownProps) {
  const { signOut, user } = useAuthentication();

  return user ? (
    <Dropdown {...props} align="end">
      <Dropdown.Toggle
        as="button"
        bsPrefix=" "
        className="bg-body-secondary-focus-visible bg-body-secondary-hover bg-transparent border-0 px-2 py-1 rounded transition-all"
      >
        <Avatar alt={user.name} email={user.email} size={30} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {layoutVariant !== "application" ? (
          <>
            <Dropdown.Item as={Link} className="d-sm-none" to="/sites">Go to application</Dropdown.Item>

            <Dropdown.Divider className="d-sm-none" />
          </>
        ) : null}

        <Dropdown.Item as={Link} to="/docs">Docs</Dropdown.Item>

        <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>

        {user.isOrganizationOwner ? (
          <Dropdown.Item as={Link} to="/billing">Billing</Dropdown.Item>
        ) : null}

        <Dropdown.Divider />

        <Dropdown.Item as="button" onClick={() => signOut()}>Sign out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : null;
}
