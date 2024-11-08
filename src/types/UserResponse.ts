import { User } from "./User";

export interface UserResponse {
    items: User[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }
  