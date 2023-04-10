interface ICustomError {
  message: string;
  field?: string;
}
export type Errors = ICustomError[];

type Role = 'user' | 'admin';
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
  isVerified: true;
  role: Role;
};
