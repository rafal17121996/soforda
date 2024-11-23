export interface Worker {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  birthday: string;
  department_id?: number;
  is_active: boolean;
  department_name: string;
  user: User;
  payroll_detail: PayrollDetail;
  driving_license: DrivingLicense[];
  driver_card: DriverCard[];
  employments: Employment[];
}

export interface User {
  id: number;
  username: string;
}

export interface PayrollDetail {
  id: number;
  address: string;
  nationality: string;
  tax_class: number;
  children_tax_allowance: number;
  tax_id_number: string;
  social_security_number: string;
  health_insurance_provider: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  birthday: string;
}

export interface DrivingLicense {
  id: number;
  country: string;
  number: string;
  worker_id: number;
  license_types: LicenseType[];
  date_issued: string;
  valid_until: string;
  code_95_valid_until: string;
  active: boolean;
  place_of_birth: string;
  place_of_issue: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  birthday: string;
}

export interface LicenseType {
  id: number;
  driving_license_id: number;
  type: string
  valid_since: string;
  valid_till: string;
  restrictions: string;
}

export interface DriverCard {
  id: number;
  card_number: string;
  worker_id: number;
  issuing_authority: string;
  driving_license_number: string;
  date_issued: string;
  valid_until: string;
  active: boolean;
  first_name: string;
  middle_name: string;
  last_name: string;
  birthday: string;
}

export interface Employment {
  start_date: string;
  end_date: string;
  worker_id: number;
  company_id: number;
  id: number;
  worker_first_name: string,
  worker_last_name: string,
  company_name: string
}
