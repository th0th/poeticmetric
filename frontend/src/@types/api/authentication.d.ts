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

type OrganizationDeletionReason = {
  detailTitle: string | null;
  order: number;
  reason: string;
};
