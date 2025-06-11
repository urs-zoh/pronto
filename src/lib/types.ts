export interface WorkingHour {
  opens_at: string;
  closes_at: string;
}

export interface BusinessInfo {
  id: number;
  name: string;
  address: string;
  zip_code: string;
  working_hours_today: WorkingHour | null;
}

export interface Product {
  id: number;
  name: string;
  image_url: string;
  price: number;
  unit: string;
  amount_per_unit: number;
  stock_quantity: number;
  in_stock: boolean;
  cart_quantity: number;
  business: BusinessInfo;
}

export interface User {
  id: number;
  email: string;
  name: string;
  zip_code: string;
  role: string;
  created_at: string;
}