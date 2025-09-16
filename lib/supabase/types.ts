export interface Event {
  id: string
  slug: string
  title: string
  description: string | null
  location: string | null
  event_date: string
  background_image_url: string | null
  logo_image_url: string | null
  button_text: string
  button_link_type: "signup" | "external"
  external_link: string | null
  brevo_list_id: number
  meta_pixel_id: string
  facebook_url: string | null
  instagram_url: string | null
  thankyou_description: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      events: {
        Row: Event
        Insert: Omit<Event, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Event, "id" | "created_at" | "updated_at">>
      }
    }
  }
}
