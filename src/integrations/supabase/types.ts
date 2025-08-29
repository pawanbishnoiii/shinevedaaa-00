export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          category: string | null
          created_at: string | null
          data_type: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          data_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          data_type?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          key: string
          metadata: Json | null
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          key: string
          metadata?: Json | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          key?: string
          metadata?: Json | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string
          created_at: string | null
          id: string
          is_active: boolean | null
          subject: string
          template_key: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_html: string
          body_text: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject: string
          template_key: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_html?: string
          body_text?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject?: string
          template_key?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      footer_pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_active: boolean
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          assigned_to: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          email: string
          follow_up_date: string | null
          id: string
          inquiry_number: string | null
          inquiry_type: string
          internal_notes: string | null
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          priority: string | null
          product_id: string | null
          product_name: string | null
          quantity: string | null
          quantity_unit: string | null
          source: string | null
          status: string | null
          target_price: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          follow_up_date?: string | null
          id?: string
          inquiry_number?: string | null
          inquiry_type: string
          internal_notes?: string | null
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: string | null
          quantity_unit?: string | null
          source?: string | null
          status?: string | null
          target_price?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          follow_up_date?: string | null
          id?: string
          inquiry_number?: string | null
          inquiry_type?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: string | null
          quantity_unit?: string | null
          source?: string | null
          status?: string | null
          target_price?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiry_counter: {
        Row: {
          current_count: number | null
          id: number
          month: number | null
          year: number | null
        }
        Insert: {
          current_count?: number | null
          id?: number
          month?: number | null
          year?: number | null
        }
        Update: {
          current_count?: number | null
          id?: number
          month?: number | null
          year?: number | null
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          file_size: number | null
          file_type: string
          file_url: string
          filename: string
          folder: string | null
          id: string
          mime_type: string | null
          original_filename: string
          tags: string[] | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          filename: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          original_filename: string
          tags?: string[] | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          filename?: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          original_filename?: string
          tags?: string[] | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_usage: {
        Row: {
          created_at: string | null
          id: string
          media_id: string | null
          used_in_field: string
          used_in_id: string
          used_in_table: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_id?: string | null
          used_in_field: string
          used_in_id: string
          used_in_table: string
        }
        Update: {
          created_at?: string | null
          id?: string
          media_id?: string | null
          used_in_field?: string
          used_in_id?: string
          used_in_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_usage_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      page_analytics: {
        Row: {
          bounce_rate: number | null
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          page_path: string
          page_title: string | null
          referrer: string | null
          session_id: string | null
          time_on_page: number | null
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          bounce_rate?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          page_path: string
          page_title?: string | null
          referrer?: string | null
          session_id?: string | null
          time_on_page?: number | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          bounce_rate?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          session_id?: string | null
          time_on_page?: number | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      product_favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_favorites_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_type: Database["public"]["Enums"]["product_interaction_type"]
          product_id: string
          session_id: string | null
          user_id: string | null
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_type: Database["public"]["Enums"]["product_interaction_type"]
          product_id: string
          session_id?: string | null
          user_id?: string | null
          weight?: number
        }
        Update: {
          created_at?: string
          id?: string
          interaction_type?: Database["public"]["Enums"]["product_interaction_type"]
          product_id?: string
          session_id?: string | null
          user_id?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_product_interactions_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_interactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          product_id: string | null
          recommendation_type: string | null
          recommended_product_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          recommendation_type?: string | null
          recommended_product_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          recommendation_type?: string | null
          recommended_product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_recommendations_recommended_product_id_fkey"
            columns: ["recommended_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          certifications: string[] | null
          created_at: string | null
          currency: string | null
          description: string | null
          export_grade: string | null
          export_markets: string[] | null
          featured_rank: number | null
          features: string[] | null
          gallery_images: string[] | null
          hsn_code: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          lead_time: string | null
          minimum_order_quantity: string | null
          name: string
          origin: string | null
          packaging_details: string | null
          price_range: string | null
          quality_standards: string[] | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          shelf_life: string | null
          short_description: string | null
          slug: string
          sort_order: number | null
          specifications: Json | null
          stock_status: string | null
          unit_type: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          certifications?: string[] | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          export_grade?: string | null
          export_markets?: string[] | null
          featured_rank?: number | null
          features?: string[] | null
          gallery_images?: string[] | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          lead_time?: string | null
          minimum_order_quantity?: string | null
          name: string
          origin?: string | null
          packaging_details?: string | null
          price_range?: string | null
          quality_standards?: string[] | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          shelf_life?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          specifications?: Json | null
          stock_status?: string | null
          unit_type?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          certifications?: string[] | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          export_grade?: string | null
          export_markets?: string[] | null
          featured_rank?: number | null
          features?: string[] | null
          gallery_images?: string[] | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          lead_time?: string | null
          minimum_order_quantity?: string | null
          name?: string
          origin?: string | null
          packaging_details?: string | null
          price_range?: string | null
          quality_standards?: string[] | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          shelf_life?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          specifications?: Json | null
          stock_status?: string | null
          unit_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          email: string
          id: string
          is_verified: boolean | null
          name: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          id: string
          is_verified?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rajasthan_crops: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          region: string | null
          season: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          region?: string | null
          season?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          region?: string | null
          season?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      rajasthan_portfolio_sections: {
        Row: {
          content: string | null
          created_at: string
          gallery: Json | null
          id: string
          image_url: string | null
          is_active: boolean
          metadata: Json | null
          section_type: string
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          gallery?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          metadata?: Json | null
          section_type: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          gallery?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          metadata?: Json | null
          section_type?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rajasthan_stories: {
        Row: {
          content: string | null
          created_at: string
          district: string | null
          gallery: Json | null
          hero_image_url: string | null
          id: string
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
          video_url: string | null
          village: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          district?: string | null
          gallery?: Json | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          video_url?: string | null
          village?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          district?: string | null
          gallery?: Json | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          video_url?: string | null
          village?: string | null
        }
        Relationships: []
      }
      seo_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_value: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          metric_name: string
          metric_value?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          metric_name?: string
          metric_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_company: string | null
          client_country: string | null
          client_image_url: string | null
          client_name: string
          client_position: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          rating: number | null
          sort_order: number | null
          testimonial_text: string
          updated_at: string | null
        }
        Insert: {
          client_company?: string | null
          client_country?: string | null
          client_image_url?: string | null
          client_name: string
          client_position?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          sort_order?: number | null
          testimonial_text: string
          updated_at?: string | null
        }
        Update: {
          client_company?: string | null
          client_country?: string | null
          client_image_url?: string | null
          client_name?: string
          client_position?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          sort_order?: number | null
          testimonial_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          device: string | null
          event_type: string | null
          id: string
          page_title: string | null
          page_url: string | null
          product_id: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          event_type?: string | null
          id?: string
          page_title?: string | null
          page_url?: string | null
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          event_type?: string | null
          id?: string
          page_title?: string | null
          page_url?: string | null
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_inquiry_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { user_email?: string }
        Returns: boolean
      }
      keep_database_warm: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      interaction_type: "view" | "favorite" | "inquiry" | "share"
      product_interaction_type: "view" | "favorite" | "inquiry"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      interaction_type: ["view", "favorite", "inquiry", "share"],
      product_interaction_type: ["view", "favorite", "inquiry"],
    },
  },
} as const
