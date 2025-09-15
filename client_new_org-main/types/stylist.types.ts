export interface StyleImage {
  url: string;
  type: string;
  created_at: string;
}

export interface StylistStyles {
  id: string;
  stylist_id: string;
  user_id: string;
  style_name: string;
  category: string;
  description: string;
  price: number;
  is_available: boolean;
  likes: number;
  images: StyleImage[];
  created_at: string;
  updated_at: string;
}

export interface StylistProfile {
  id: string;
  user_id: string;
  experience_years: number;
  specialization: string;
  delivery_days: number | string;
  gender: string;
  expertise: string[];
  biography: string;
  identification_document: string;
  is_recommended: boolean;
}

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  IN_REVIEW = "in_review",
  IN_PROGRESS = "in_progress",
  COUNTER_OFFERED = "counter_offered",
  EXPIRED = "expired",
  COMPLETED = "completed",
}

export interface StylistOrder {
  _id: string;
  counter_offer_amount: number;
  counter_offer_notes: string;
  created_at: string;
  currency: string;
  customer_id: string;
  customer_name: string | null;
  delivery_date: string;
  delivery_location: string;
  expires_at: string;
  notes: string;
  proposed_amount: number;
  status: OrderStatus;
  style: StylistStyles;
  style_id: string;
  style_name: string;
  stylist_id: string;
  updated_at: string;
}

export interface StyleRequest {
  _id: string;
  counter_offer_amount: number;
  counter_offer_notes: string;
  created_at: string;
  customer_id: string;
  delivery_date: string;
  delivery_location: string;
  expires_at: string;
  notes: string;
  proposed_amount: number;
  status: string;
  style_id: string;
  style_images: {
    createdat: string;
    type: string;
    url: string;
  }[];
  stylist_id: string;
  stylist_name: string | null;
  updated_at: string;
}

export interface StyleRequestOffer {
  id: string;
  bid_id: string;
  stylist_id: string;
  customer_id: string;
  style_id: string;
  offered_amount: number;
  currency: string;
  delivery_date: string;
  delivery_location: string;
  notes: string;
  description: string;
  status: string;
  expires_at: string;
  counter_offer_amount: number;
  counter_offer_notes: string;
  created_at: string;
  updated_at: string;
  stylist?: {
    name: string;
    rating: number;
    delivery_days: number;
    location: string;
  }
}