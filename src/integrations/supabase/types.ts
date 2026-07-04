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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      beat_licenses: {
        Row: {
          beat_id: string
          created_at: string
          id: string
          is_exclusive: boolean
          license_type: string
          name: string
          price: number
          terms: string | null
        }
        Insert: {
          beat_id: string
          created_at?: string
          id?: string
          is_exclusive?: boolean
          license_type: string
          name: string
          price: number
          terms?: string | null
        }
        Update: {
          beat_id?: string
          created_at?: string
          id?: string
          is_exclusive?: boolean
          license_type?: string
          name?: string
          price?: number
          terms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beat_licenses_beat_id_fkey"
            columns: ["beat_id"]
            isOneToOne: false
            referencedRelation: "beats"
            referencedColumns: ["id"]
          },
        ]
      }
      beat_likes: {
        Row: {
          beat_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          beat_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          beat_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "beat_likes_beat_id_fkey"
            columns: ["beat_id"]
            isOneToOne: false
            referencedRelation: "beats"
            referencedColumns: ["id"]
          },
        ]
      }
      beat_plays: {
        Row: {
          beat_id: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          beat_id: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          beat_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beat_plays_beat_id_fkey"
            columns: ["beat_id"]
            isOneToOne: false
            referencedRelation: "beats"
            referencedColumns: ["id"]
          },
        ]
      }
      beat_purchases: {
        Row: {
          amount: number
          beat_id: string
          buyer_id: string
          completed_at: string | null
          created_at: string
          currency: string
          id: string
          license_id: string | null
          license_type: string
          status: string
          stripe_session_id: string | null
        }
        Insert: {
          amount: number
          beat_id: string
          buyer_id: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          license_id?: string | null
          license_type: string
          status?: string
          stripe_session_id?: string | null
        }
        Update: {
          amount?: number
          beat_id?: string
          buyer_id?: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          license_id?: string | null
          license_type?: string
          status?: string
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beat_purchases_beat_id_fkey"
            columns: ["beat_id"]
            isOneToOne: false
            referencedRelation: "beats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beat_purchases_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "beat_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      beats: {
        Row: {
          audio_path: string | null
          base_price: number
          bpm: number | null
          cover_url: string | null
          created_at: string
          description: string | null
          genre: string
          id: string
          likes_count: number
          mood: string | null
          music_key: string | null
          plays_count: number
          preview_url: string | null
          producer_id: string
          purchases_count: number
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          audio_path?: string | null
          base_price?: number
          bpm?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          genre?: string
          id?: string
          likes_count?: number
          mood?: string | null
          music_key?: string | null
          plays_count?: number
          preview_url?: string | null
          producer_id: string
          purchases_count?: number
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          audio_path?: string | null
          base_price?: number
          bpm?: number | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          genre?: string
          id?: string
          likes_count?: number
          mood?: string | null
          music_key?: string | null
          plays_count?: number
          preview_url?: string | null
          producer_id?: string
          purchases_count?: number
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_group: boolean
          last_message_at: string
          name: string | null
          owner_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_group?: boolean
          last_message_at?: string
          name?: string | null
          owner_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_group?: boolean
          last_message_at?: string
          name?: string | null
          owner_id?: string | null
        }
        Relationships: []
      }
      group_join_requests: {
        Row: {
          conversation_id: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          id: string
          message: string | null
          status: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          message?: string | null
          status?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          message?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      livestreams: {
        Row: {
          category: string
          ended_at: string | null
          host_id: string
          id: string
          is_live: boolean
          started_at: string
          thumbnail_url: string | null
          title: string
          viewer_count: number
          youtube_id: string | null
        }
        Insert: {
          category?: string
          ended_at?: string | null
          host_id: string
          id?: string
          is_live?: boolean
          started_at?: string
          thumbnail_url?: string | null
          title: string
          viewer_count?: number
          youtube_id?: string | null
        }
        Update: {
          category?: string
          ended_at?: string | null
          host_id?: string
          id?: string
          is_live?: boolean
          started_at?: string
          thumbnail_url?: string | null
          title?: string
          viewer_count?: number
          youtube_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_items: {
        Row: {
          added_at: string
          beat_id: string | null
          id: string
          item_type: string
          playlist_id: string
          position: number
          video_id: string | null
        }
        Insert: {
          added_at?: string
          beat_id?: string | null
          id?: string
          item_type: string
          playlist_id: string
          position?: number
          video_id?: string | null
        }
        Update: {
          added_at?: string
          beat_id?: string | null
          id?: string
          item_type?: string
          playlist_id?: string
          position?: number
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_items_beat_id_fkey"
            columns: ["beat_id"]
            isOneToOne: false
            referencedRelation: "beats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_items_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_items_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      producer_profiles: {
        Row: {
          banner_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          is_verified: boolean
          payout_email: string | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          is_verified?: boolean
          payout_email?: string | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_verified?: boolean
          payout_email?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      producer_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan: string
          producer_id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          producer_id: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          producer_id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      recently_played: {
        Row: {
          beat_id: string | null
          id: string
          item_type: string
          played_at: string
          user_id: string
          video_id: string | null
        }
        Insert: {
          beat_id?: string | null
          id?: string
          item_type: string
          played_at?: string
          user_id: string
          video_id?: string | null
        }
        Update: {
          beat_id?: string | null
          id?: string
          item_type?: string
          played_at?: string
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recently_played_beat_id_fkey"
            columns: ["beat_id"]
            isOneToOne: false
            referencedRelation: "beats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recently_played_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          category: string
          created_at: string
          creator: string
          duration: string | null
          id: string
          is_featured: boolean
          is_short: boolean
          title: string
          views_count: number
          youtube_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          creator: string
          duration?: string | null
          id?: string
          is_featured?: boolean
          is_short?: boolean
          title: string
          views_count?: number
          youtube_id: string
        }
        Update: {
          category?: string
          created_at?: string
          creator?: string
          duration?: string | null
          id?: string
          is_featured?: boolean
          is_short?: boolean
          title?: string
          views_count?: number
          youtube_id?: string
        }
        Relationships: []
      }
      watch_later: {
        Row: {
          added_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          added_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          added_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_later_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_group_request: {
        Args: { _request_id: string }
        Returns: undefined
      }
      has_active_producer_sub: { Args: { _user: string }; Returns: boolean }
      has_purchased_beat: {
        Args: { _beat: string; _user: string }
        Returns: boolean
      }
      is_conversation_owner: {
        Args: { _conv: string; _user: string }
        Returns: boolean
      }
      is_conversation_participant: {
        Args: { _conv: string; _user: string }
        Returns: boolean
      }
      reject_group_request: {
        Args: { _request_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
