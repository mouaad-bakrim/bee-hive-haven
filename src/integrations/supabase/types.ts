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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          type?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_email: string | null
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
          status: string
        }
        Insert: {
          author_email?: string | null
          author_name: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          status?: string
        }
        Update: {
          author_email?: string | null
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_views_daily: {
        Row: {
          count: number | null
          id: string
          post_id: string
          view_date: string
        }
        Insert: {
          count?: number | null
          id?: string
          post_id: string
          view_date?: string
        }
        Update: {
          count?: number | null
          id?: string
          post_id?: string
          view_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_views_daily_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          category: string
          content: string | null
          cover_url: string | null
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string | null
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          articles_per_page: number | null
          comments_enabled: boolean | null
          comments_moderation: boolean | null
          contact_email: string | null
          created_at: string
          facebook_enabled: boolean | null
          facebook_url: string | null
          favicon_url: string | null
          google_analytics_id: string | null
          hero_cta_text: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: number
          instagram_enabled: boolean | null
          instagram_url: string | null
          logo_url: string | null
          maintenance_mode: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          newsletter_enabled: boolean | null
          newsletter_subtitle: string | null
          newsletter_title: string | null
          primary_color: string | null
          public_registration: boolean | null
          show_author: boolean | null
          show_bee_animations: boolean | null
          show_buzz_section: boolean | null
          show_categories_filter: boolean | null
          show_chatbot: boolean | null
          show_date: boolean | null
          show_hero: boolean | null
          show_newsletter: boolean | null
          show_related_articles: boolean | null
          show_share_buttons: boolean | null
          site_name: string | null
          slogan: string | null
          tiktok_enabled: boolean | null
          tiktok_url: string | null
          twitter_enabled: boolean | null
          twitter_url: string | null
          umami_website_id: string | null
          updated_at: string
          whatsapp_enabled: boolean | null
          whatsapp_number: string | null
          youtube_enabled: boolean | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          articles_per_page?: number | null
          comments_enabled?: boolean | null
          comments_moderation?: boolean | null
          contact_email?: string | null
          created_at?: string
          facebook_enabled?: boolean | null
          facebook_url?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          hero_cta_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: number
          instagram_enabled?: boolean | null
          instagram_url?: string | null
          logo_url?: string | null
          maintenance_mode?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          newsletter_enabled?: boolean | null
          newsletter_subtitle?: string | null
          newsletter_title?: string | null
          primary_color?: string | null
          public_registration?: boolean | null
          show_author?: boolean | null
          show_bee_animations?: boolean | null
          show_buzz_section?: boolean | null
          show_categories_filter?: boolean | null
          show_chatbot?: boolean | null
          show_date?: boolean | null
          show_hero?: boolean | null
          show_newsletter?: boolean | null
          show_related_articles?: boolean | null
          show_share_buttons?: boolean | null
          site_name?: string | null
          slogan?: string | null
          tiktok_enabled?: boolean | null
          tiktok_url?: string | null
          twitter_enabled?: boolean | null
          twitter_url?: string | null
          umami_website_id?: string | null
          updated_at?: string
          whatsapp_enabled?: boolean | null
          whatsapp_number?: string | null
          youtube_enabled?: boolean | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          articles_per_page?: number | null
          comments_enabled?: boolean | null
          comments_moderation?: boolean | null
          contact_email?: string | null
          created_at?: string
          facebook_enabled?: boolean | null
          facebook_url?: string | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          hero_cta_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: number
          instagram_enabled?: boolean | null
          instagram_url?: string | null
          logo_url?: string | null
          maintenance_mode?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          newsletter_enabled?: boolean | null
          newsletter_subtitle?: string | null
          newsletter_title?: string | null
          primary_color?: string | null
          public_registration?: boolean | null
          show_author?: boolean | null
          show_bee_animations?: boolean | null
          show_buzz_section?: boolean | null
          show_categories_filter?: boolean | null
          show_chatbot?: boolean | null
          show_date?: boolean | null
          show_hero?: boolean | null
          show_newsletter?: boolean | null
          show_related_articles?: boolean | null
          show_share_buttons?: boolean | null
          site_name?: string | null
          slogan?: string | null
          tiktok_enabled?: boolean | null
          tiktok_url?: string | null
          twitter_enabled?: boolean | null
          twitter_url?: string | null
          umami_website_id?: string | null
          updated_at?: string
          whatsapp_enabled?: boolean | null
          whatsapp_number?: string | null
          youtube_enabled?: boolean | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_post_view: { Args: { p_post_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
