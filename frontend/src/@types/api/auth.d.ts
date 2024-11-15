type User = {
  createdAt: string;
  email: string;
  id: number;
  isEmailVerified: boolean;
  isPasswordSet: boolean;
  name: string;
  role: UserRole;
  updatedAt: string;
};

type UserRole = "ADMIN" | "OWNER" | "USER";
