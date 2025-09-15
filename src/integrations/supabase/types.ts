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
      admin_activity_logs: {
        Row: {
          action_type: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      agri_blog_posts: {
        Row: {
          author: string
          author_type: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          publish_date: string
          read_time: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author: string
          author_type?: string
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          publish_date?: string
          read_time?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author?: string
          author_type?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          publish_date?: string
          read_time?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
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
      crop_portfolio: {
        Row: {
          bg_color_class: string | null
          color_class: string | null
          created_at: string | null
          description: string
          export_grades: string[] | null
          features: string[] | null
          hindi_name: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          moisture: string | null
          name: string
          packaging: string | null
          purity: string | null
          region: string
          season: string
          shelf_life: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          bg_color_class?: string | null
          color_class?: string | null
          created_at?: string | null
          description: string
          export_grades?: string[] | null
          features?: string[] | null
          hindi_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          moisture?: string | null
          name: string
          packaging?: string | null
          purity?: string | null
          region: string
          season: string
          shelf_life?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          bg_color_class?: string | null
          color_class?: string | null
          created_at?: string | null
          description?: string
          export_grades?: string[] | null
          features?: string[] | null
          hindi_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          moisture?: string | null
          name?: string
          packaging?: string | null
          purity?: string | null
          region?: string
          season?: string
          shelf_life?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      downloadable_resources: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_active: boolean | null
          is_public: boolean | null
          metadata: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          metadata?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          metadata?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_analytics: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          recipient_id: string | null
          user_agent: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          recipient_id?: string | null
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          recipient_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_analytics_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "email_campaign_recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      email_automation_rules: {
        Row: {
          created_at: string | null
          delay_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
          template_id: string | null
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delay_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          template_id?: string | null
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delay_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_id?: string | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_automation_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaign_recipients: {
        Row: {
          bounced_at: string | null
          campaign_id: string
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          recipient_email: string
          recipient_id: string | null
          recipient_type: string
          sent_at: string | null
          status: string | null
          tracking_id: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          bounced_at?: string | null
          campaign_id: string
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email: string
          recipient_id?: string | null
          recipient_type: string
          sent_at?: string | null
          status?: string | null
          tracking_id?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          bounced_at?: string | null
          campaign_id?: string
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email?: string
          recipient_id?: string | null
          recipient_type?: string
          sent_at?: string | null
          status?: string | null
          tracking_id?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaign_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          bounced_count: number | null
          clicked_count: number | null
          content: string
          created_at: string | null
          created_by: string | null
          delivered_count: number | null
          id: string
          name: string
          opened_count: number | null
          recipient_filters: Json | null
          recipient_type: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_id: string | null
          total_recipients: number | null
          unsubscribed_count: number | null
          updated_at: string | null
        }
        Insert: {
          bounced_count?: number | null
          clicked_count?: number | null
          content: string
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          id?: string
          name: string
          opened_count?: number | null
          recipient_filters?: Json | null
          recipient_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_id?: string | null
          total_recipients?: number | null
          unsubscribed_count?: number | null
          updated_at?: string | null
        }
        Update: {
          bounced_count?: number | null
          clicked_count?: number | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          id?: string
          name?: string
          opened_count?: number | null
          recipient_filters?: Json | null
          recipient_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_id?: string | null
          total_recipients?: number | null
          unsubscribed_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_queue: {
        Row: {
          attempts: number | null
          automation_rule_id: string | null
          campaign_id: string | null
          content_html: string
          content_text: string | null
          created_at: string | null
          id: string
          last_error: string | null
          max_attempts: number | null
          priority: number | null
          recipient_email: string
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_variables: Json | null
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          automation_rule_id?: string | null
          campaign_id?: string | null
          content_html: string
          content_text?: string | null
          created_at?: string | null
          id?: string
          last_error?: string | null
          max_attempts?: number | null
          priority?: number | null
          recipient_email: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_variables?: Json | null
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          automation_rule_id?: string | null
          campaign_id?: string | null
          content_html?: string
          content_text?: string | null
          created_at?: string | null
          id?: string
          last_error?: string | null
          max_attempts?: number | null
          priority?: number | null
          recipient_email?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_variables?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_queue_automation_rule_id_fkey"
            columns: ["automation_rule_id"]
            isOneToOne: false
            referencedRelation: "email_automation_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_queue_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          source: string | null
          status: string | null
          subscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string
          category: string | null
          created_at: string | null
          design_data: Json | null
          id: string
          is_active: boolean | null
          parent_template_id: string | null
          preheader: string | null
          preview_text: string | null
          subject: string
          template_key: string
          test_data: Json | null
          updated_at: string | null
          variables: Json | null
          version: number | null
        }
        Insert: {
          body_html: string
          body_text: string
          category?: string | null
          created_at?: string | null
          design_data?: Json | null
          id?: string
          is_active?: boolean | null
          parent_template_id?: string | null
          preheader?: string | null
          preview_text?: string | null
          subject: string
          template_key: string
          test_data?: Json | null
          updated_at?: string | null
          variables?: Json | null
          version?: number | null
        }
        Update: {
          body_html?: string
          body_text?: string
          category?: string | null
          created_at?: string | null
          design_data?: Json | null
          id?: string
          is_active?: boolean | null
          parent_template_id?: string | null
          preheader?: string | null
          preview_text?: string | null
          subject?: string
          template_key?: string
          test_data?: Json | null
          updated_at?: string | null
          variables?: Json | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates_enhanced: {
        Row: {
          body_html: string
          body_text: string
          created_at: string | null
          id: string
          is_active: boolean | null
          subject: string
          template_key: string
          template_name: string
          template_type: string | null
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
          template_name: string
          template_type?: string | null
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
          template_name?: string
          template_type?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      farmer_network: {
        Row: {
          address: string
          city: string
          contact_email: string
          contact_phone: string
          contract_status: string | null
          current_crops: string[] | null
          farmer_name: string
          farming_experience_years: number | null
          farming_type: string | null
          has_irrigation: boolean | null
          has_storage: boolean | null
          id: string
          interested_crops: string[] | null
          land_size_acres: number | null
          notes: string | null
          pincode: string
          registered_at: string | null
          state: string
          verification_documents: Json | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address: string
          city: string
          contact_email: string
          contact_phone: string
          contract_status?: string | null
          current_crops?: string[] | null
          farmer_name: string
          farming_experience_years?: number | null
          farming_type?: string | null
          has_irrigation?: boolean | null
          has_storage?: boolean | null
          id?: string
          interested_crops?: string[] | null
          land_size_acres?: number | null
          notes?: string | null
          pincode: string
          registered_at?: string | null
          state: string
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address?: string
          city?: string
          contact_email?: string
          contact_phone?: string
          contract_status?: string | null
          current_crops?: string[] | null
          farmer_name?: string
          farming_experience_years?: number | null
          farming_type?: string | null
          has_irrigation?: boolean | null
          has_storage?: boolean | null
          id?: string
          interested_crops?: string[] | null
          land_size_acres?: number | null
          notes?: string | null
          pincode?: string
          registered_at?: string | null
          state?: string
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      farmer_stories: {
        Row: {
          after_metric: string | null
          after_value: string | null
          before_metric: string | null
          before_value: string | null
          category: string
          created_at: string | null
          excerpt: string | null
          full_story: string
          id: string
          image_url: string | null
          improvement: string | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string
          name: string
          sort_order: number | null
          state: string
          title: string
          updated_at: string | null
        }
        Insert: {
          after_metric?: string | null
          after_value?: string | null
          before_metric?: string | null
          before_value?: string | null
          category?: string
          created_at?: string | null
          excerpt?: string | null
          full_story: string
          id?: string
          image_url?: string | null
          improvement?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location: string
          name: string
          sort_order?: number | null
          state: string
          title: string
          updated_at?: string | null
        }
        Update: {
          after_metric?: string | null
          after_value?: string | null
          before_metric?: string | null
          before_value?: string | null
          category?: string
          created_at?: string | null
          excerpt?: string | null
          full_story?: string
          id?: string
          image_url?: string | null
          improvement?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string
          name?: string
          sort_order?: number | null
          state?: string
          title?: string
          updated_at?: string | null
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
      gallery_images: {
        Row: {
          alt_text: string
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          license_type: string | null
          license_url: string | null
          metadata: Json | null
          photographer: string | null
          sort_order: number | null
          src: string
          title: string
          updated_at: string | null
        }
        Insert: {
          alt_text: string
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          license_type?: string | null
          license_url?: string | null
          metadata?: Json | null
          photographer?: string | null
          sort_order?: number | null
          src: string
          title: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          license_type?: string | null
          license_url?: string | null
          metadata?: Json | null
          photographer?: string | null
          sort_order?: number | null
          src?: string
          title?: string
          updated_at?: string | null
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
          is_video: boolean | null
          mime_type: string | null
          original_filename: string
          tags: string[] | null
          uploaded_by: string | null
          video_duration: number | null
          video_thumbnail_url: string | null
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
          is_video?: boolean | null
          mime_type?: string | null
          original_filename: string
          tags?: string[] | null
          uploaded_by?: string | null
          video_duration?: number | null
          video_thumbnail_url?: string | null
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
          is_video?: boolean | null
          mime_type?: string | null
          original_filename?: string
          tags?: string[] | null
          uploaded_by?: string | null
          video_duration?: number | null
          video_thumbnail_url?: string | null
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
      newsletter_subscriptions: {
        Row: {
          confirmed_at: string | null
          created_at: string | null
          email: string
          id: string
          metadata: Json | null
          name: string | null
          preferences: Json | null
          status: string | null
          subscription_source: string | null
          unsubscribe_token: string | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          metadata?: Json | null
          name?: string | null
          preferences?: Json | null
          status?: string | null
          subscription_source?: string | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          name?: string | null
          preferences?: Json | null
          status?: string | null
          subscription_source?: string | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          id: number
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          total: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      org_team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          department: string | null
          education: string | null
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          linkedin_url: string | null
          location: string | null
          name: string
          phone: string | null
          position: string
          sort_order: number | null
          specializations: string[] | null
          twitter_url: string | null
          updated_at: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          department?: string | null
          education?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          name: string
          phone?: string | null
          position: string
          sort_order?: number | null
          specializations?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          department?: string | null
          education?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          position?: string
          sort_order?: number | null
          specializations?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Relationships: []
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
      performance_metrics: {
        Row: {
          created_at: string | null
          device_type: string | null
          id: string
          metric_name: string
          metric_type: string
          metric_unit: string | null
          metric_value: number | null
          page_url: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          id?: string
          metric_name: string
          metric_type: string
          metric_unit?: string | null
          metric_value?: number | null
          page_url?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_unit?: string | null
          metric_value?: number | null
          page_url?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      portfolio_analytics: {
        Row: {
          action_type: string
          content_id: string | null
          content_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          content_id?: string | null
          content_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          content_id?: string | null
          content_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      portfolio_videos: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          metadata: Json | null
          sort_order: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_type: string | null
          video_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_type?: string | null
          video_url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_type?: string | null
          video_url?: string
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
          full_name: string | null
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
          full_name?: string | null
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
          full_name?: string | null
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
      search_analytics: {
        Row: {
          clicked_result: Json | null
          created_at: string | null
          id: string
          results_count: number | null
          search_filters: Json | null
          search_term: string
          search_type: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          clicked_result?: Json | null
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_term: string
          search_type?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_result?: Json | null
          created_at?: string | null
          id?: string
          results_count?: number | null
          search_filters?: Json | null
          search_term?: string
          search_type?: string | null
          session_id?: string | null
          user_id?: string | null
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
      seo_pages: {
        Row: {
          canonical_url: string | null
          change_frequency: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_modified: string | null
          meta_description: string | null
          meta_keywords: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_path: string
          page_title: string | null
          priority: number | null
          robots_meta: string | null
          structured_data: Json | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          change_frequency?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_modified?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path: string
          page_title?: string | null
          priority?: number | null
          robots_meta?: string | null
          structured_data?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          change_frequency?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_modified?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path?: string
          page_title?: string | null
          priority?: number | null
          robots_meta?: string | null
          structured_data?: Json | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
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
      smtp_configurations: {
        Row: {
          created_at: string | null
          encryption_type: string
          from_email: string
          from_name: string
          host: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          password_encrypted: string
          port: number
          test_sent_at: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          encryption_type: string
          from_email: string
          from_name: string
          host: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          password_encrypted: string
          port: number
          test_sent_at?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          encryption_type?: string
          from_email?: string
          from_name?: string
          host?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          password_encrypted?: string
          port?: number
          test_sent_at?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      smtp_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_encrypted: boolean | null
          setting_name: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_encrypted?: boolean | null
          setting_name: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_encrypted?: boolean | null
          setting_name?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      story_submissions: {
        Row: {
          admin_notes: string | null
          contact_email: string
          contact_phone: string | null
          crop_types: string[] | null
          farmer_name: string
          farming_experience: string | null
          id: string
          images: Json | null
          location: string
          reviewed_at: string | null
          reviewed_by: string | null
          state: string
          status: string | null
          story_content: string
          story_title: string
          submitted_at: string | null
          success_metrics: Json | null
        }
        Insert: {
          admin_notes?: string | null
          contact_email: string
          contact_phone?: string | null
          crop_types?: string[] | null
          farmer_name: string
          farming_experience?: string | null
          id?: string
          images?: Json | null
          location: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          state: string
          status?: string | null
          story_content: string
          story_title: string
          submitted_at?: string | null
          success_metrics?: Json | null
        }
        Update: {
          admin_notes?: string | null
          contact_email?: string
          contact_phone?: string | null
          crop_types?: string[] | null
          farmer_name?: string
          farming_experience?: string | null
          id?: string
          images?: Json | null
          location?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          state?: string
          status?: string | null
          story_content?: string
          story_title?: string
          submitted_at?: string | null
          success_metrics?: Json | null
        }
        Relationships: []
      }
      system_notifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          priority: string | null
          recipient_id: string | null
          recipient_type: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          priority?: string | null
          recipient_id?: string | null
          recipient_type?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          priority?: string | null
          recipient_id?: string | null
          recipient_type?: string | null
          title?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_encrypted: boolean | null
          is_public: boolean | null
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
          validation_rules: Json | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_encrypted?: boolean | null
          is_public?: boolean | null
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_encrypted?: boolean | null
          is_public?: boolean | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          added_at: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
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
      user_sessions: {
        Row: {
          device_info: Json | null
          ended_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          location_info: Json | null
          page_views: number | null
          session_id: string
          started_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          location_info?: Json | null
          page_views?: number | null
          session_id: string
          started_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          location_info?: Json | null
          page_views?: number | null
          session_id?: string
          started_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      increment_blog_view_count: {
        Args: { post_slug: string }
        Returns: undefined
      }
      increment_download_count: {
        Args: { resource_id: string }
        Returns: undefined
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
