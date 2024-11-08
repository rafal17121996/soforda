export interface Worker {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    birthday: string;
    department_name: string;
    department_id?: number;
  }

  export interface DrivingLicense {
    licenseType: string;
    issuedDate: string;
    expiryDate: string;
  }
  
  export interface PayrollDetails {
    salary: number;
    bonus: number;
    deductions: number;
  }
  
  export interface DepartmentDetails {
    departmentName: string;
    manager: string;
    location: string;
  }
  