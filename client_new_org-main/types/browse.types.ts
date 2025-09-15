export interface BrowseStylistsParams {
  page?: number;
  limit?: number;
}

export interface StyleImage {
  url: string;
  type: string;
  created_at: string;
}

export interface BrowseStyle {
  _id: string;
  stylist_id: string;
  user_id?: string;
  style_name: string;
  category: string;
  images: StyleImage[];
  description: string;
  price: number;
  is_available: boolean;
  is_favorite: boolean;
  likes: number;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface BrowseStylists {
  _id: string;
  bio: string;
  created_at: string;
  delivery_days: number;
  email: string;
  experience_years: number;
  first_name: string;
  gender: string;
  is_available: boolean;
  is_recommended: boolean;
  last_name: string;
  portfolio_count: number;
  review_count: number;
  specialization: string;
  specializations: string[];
  user_id: string;
  profile_image_url?: string;
}