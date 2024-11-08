export interface User {
    id: number;
    username: string;
    worker_id: number;
    role_name: string;
    first_name: string;
    last_name: string;
    role_id:number;
    department_name: string;
    department_id:number;
    is_temporary_password: boolean
  }