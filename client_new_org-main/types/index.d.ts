interface IUser {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  active: boolean;
  phone: string;
  country_code: string;
  address: string;
  profile_image_url: string;
  is_email_confirmed: boolean;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  external_accounts: any | null;
  bank_info?: {
    account_number?: string;
    bank_code?: string;
    business_name?: string;
    email?: string;
    phone?: string;
  };
  sub_account?: {
    account_number: string;
    account_name: string;
    bank_name: string;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
}


