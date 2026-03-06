// types/user.types.ts
export interface User {
  id: number;
  email: string;
}

export interface UserContextValue {
  user: User | null;
  token: string | null;
  login: (newToken: string, userData: User) => void;
  logout: () => void;
}