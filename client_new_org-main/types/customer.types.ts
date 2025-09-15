export interface FavoriteStyle {
    id: string;
    style_id: string;
    style_name: string;
    category: string;
    images: string[];
    stylist_id: string;
    stylist_name: string;
    stylist_image?: string;
    rating?: number;
    added_at: string;
}

export interface CustomerStylistStyle {
    _id: string;
    category: string;
    created_at: string;
    description: string;
    gender: string;
    images: {
        created_at: string;
        type: string;
        url: string;
    }[];
    is_available: boolean;
    likes: number;
    price: number;
    style_name: string;
    stylist_id: string;
    updated_at: string;
    user_id: string;
    is_favorite?: boolean;
}

export interface CustomerMeasurements {
    chest: number;
    height: number;
    hips: number;
    inseam_leg: number;
    neck_size: number;
    shoe_size: number;
    shoulders: number;
    sleeve_length: number;
    updated_at: string;
    waist: number;
    weight: number;
}

export interface CustomerProfile {
    profile: {
        id: string;
        user_id: string;
        measurements: CustomerMeasurements;
        favourites: FavoriteStyle[];
        orders: any;
        style_profile: string;
        created_at: string;
        updated_at: string;
    }
}

export interface CustomerStylistProfile {
    _id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    bio: string;
    location: string;
    price_range: string;
    rating: number;
    review_count: number;
    portfolio_count: number;
    is_available: boolean;
    is_recommended: boolean;
    is_favorite: boolean;
    experience_years: number;
    specialization: string;
    specializations: string[];
    delivery_days: number;
    gender: string;
    created_at: string;
    profile_image_url?: string;
}

export interface MyStyles {
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

export interface MyStylesOffer {
    id: string;
    gig_id: string;
    stylist_id: string;
    customer_id: string;
    delivery_date: string;
    delivery_time: string;
    created_at: string;
    updated_at: string;
    price: number;
    stylist_info?: {
        name: string;
        rating: number;
        review_count: number;
        total_likes: number;
        delivery_days: number;
        location: string;
    }
}