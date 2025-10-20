export interface User {
  id: number;
  name: string;
  email: string;
  age?: number | null;
  role?: string;
}
