type AuthenticationUser = {
  createdAt: string;
  email: string;
  id: number;
  isEmailVerified: boolean;
  isOrganizationOwner: boolean;
  name: string;
  updatedAt: string;
};

type HydratedAuthenticationUser = Overwrite<AuthenticationUser, {
  canWrite: boolean;
}>;


