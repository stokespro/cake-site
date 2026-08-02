export interface Strain {
  id: string;
  name: string;
  slug: string;
  type: string;
  thc_percent: number | null;
  cbd_percent: number | null;
  description: string | null;
  effects: string[] | null;
  lineage: string | null;
  tagline: string | null;
  badge: string | null;
  flavor_notes: string[] | null;
  grow_method: string | null;
  harvest_date: string | null;
  availability: string | null;
  image_url: string | null;
  coa_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface StrainBatch {
  id: string;
  strain_id: string;
  batch_id: string;
  harvest_date: string;
  thc_percent: number | null;
  cbd_percent: number | null;
  total_cannabinoids: number | null;
  coa_url: string | null;
  terpenes: Record<string, number> | null;
  available: boolean;
  created_at: string;
}

export interface SampleRequest {
  id?: string;
  contact_name: string;
  dispensary_name: string;
  omma_license: string;
  email: string;
  phone: string | null;
  notes: string | null;
  strain_slugs: string[];
  customer_id?: string | null;
  is_existing_customer?: boolean;
  status?: string;
  created_at?: string;
}

export interface Customer {
  id: string;
  business_name: string;
  address: string | null;
  phone_number: string | null;
  email: string | null;
  omma_license: string | null;
  city: string | null;
  show_on_map?: boolean;
}

/** A strain a dispensary has taken delivery of recently. */
export interface RecentStrain {
  name: string;
  slug: string;
}

/**
 * Shape of the public_dispensary_locations view.
 *
 * No email: 72 of the 92 order-placing customers with one on file use a
 * personal domain (the buyer's own address, not a store contact).
 *
 * `recent_strains` is strains delivered in the last 90 days, and is null for
 * stores that have carried CAKE before but not ordered recently.
 */
export interface DispensaryLocation {
  id: string;
  dispensary_name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  /** Null where the address did not geocode; such stores list without a pin. */
  latitude: number | null;
  longitude: number | null;
  recent_strains: RecentStrain[] | null;
}

export interface Subscriber {
  id?: string;
  email: string;
  phone?: string | null;
  dispensary_name?: string | null;
  subscribed_at?: string;
  active?: boolean;
  source?: string | null;
}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      strains: {
        Row: Strain;
        Insert: Omit<Strain, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Strain, 'id' | 'created_at' | 'updated_at'>>;
      };
      strain_batches: {
        Row: StrainBatch;
        Insert: Omit<StrainBatch, 'id' | 'created_at'>;
        Update: Partial<Omit<StrainBatch, 'id' | 'created_at'>>;
      };
      sample_requests: {
        Row: SampleRequest;
        Insert: Omit<SampleRequest, 'id' | 'created_at'>;
        Update: Partial<Omit<SampleRequest, 'id' | 'created_at'>>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id'>;
        Update: Partial<Omit<Customer, 'id'>>;
      };
      subscribers: {
        Row: Subscriber;
        Insert: Omit<Subscriber, 'id' | 'subscribed_at'>;
        Update: Partial<Omit<Subscriber, 'id' | 'subscribed_at'>>;
      };
    };
    Views: {
      public_dispensary_locations: {
        Row: DispensaryLocation;
      };
    };
  };
}
