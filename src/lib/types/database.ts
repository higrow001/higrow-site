export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      notifications: {
        Row: {
          id: string
          workshop_new: Json[]
          workshop_readed: Json[]
          user_id: string | null
        }
        Insert: {
          id?: string
          workshop_new?: Json[]
          workshop_readed?: Json[]
          user_id?: string | null
        }
        Update: {
          id?: string
          workshop_new?: Json[]
          workshop_readed?: Json[]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          display_name: string
          email: string
          id: string
          organized_workshops: string[]
          participated_workshops: string[]
          wishlist_workshops: string[]
          photo_url: string | null
        }
        Insert: {
          display_name: string
          email: string
          id: string
          organized_workshops?: string[]
          participated_workshops?: string[]
          wishlist_workshops?: string[]
          photo_url?: string | null
        }
        Update: {
          display_name?: string
          email?: string
          id?: string
          organized_workshops?: string[]
          participated_workshops?: string[]
          wishlist_workshops?: string[]
          photo_url?: string | null
        }
        Relationships: []
      }
      workshops: {
        Row: {
          announcements: Json[] | null
          application_closing_date: string
          approved: boolean
          bank_details: Json | null
          category: string
          contact_email: string
          created_at: string
          created_by: string
          workshop_info: string
          host_here: boolean
          ext_event_link: string | null
          event_location: string | null
          id: string
          instructor_info: string
          instructor_name: string
          is_paid: boolean
          mode: string
          name: string
          other_category: string | null
          participants: Json[] | null
          payment_records: Json | null
          requested_participants: Json[] | null
          session_end_time: string
          session_start_time: string
          social_links: string[]
          tagline: string
          thumbnail_url: string | null
          workshop_amount: number | null
          workshop_ending_date: string
          workshop_starting_date: string
        }
        Insert: {
          announcements?: Json[] | null
          application_closing_date: string
          approved?: boolean
          bank_details?: Json | null
          category: string
          contact_email: string
          created_at?: string
          created_by: string
          workshop_info: string
          host_here: boolean
          ext_event_link?: string | null
          event_location?: string | null
          id?: string
          instructor_info: string
          instructor_name: string
          is_paid: boolean
          mode: string
          name: string
          other_category?: string | null
          participants?: Json[] | null
          payment_records?: Json | null
          requested_participants?: Json[] | null
          session_end_time: string
          session_start_time: string
          social_links: string[]
          tagline: string
          thumbnail_url?: string | null
          workshop_amount?: number | null
          workshop_ending_date: string
          workshop_starting_date: string
        }
        Update: {
          announcements?: Json[] | null
          application_closing_date?: string
          approved?: boolean
          bank_details?: Json | null
          category?: string
          contact_email?: string
          created_at?: string
          created_by?: string
          workshop_info?: string
          host_here?: boolean
          ext_event_link?: string | null
          event_location?: string | null
          id?: string
          instructor_info?: string
          instructor_name?: string
          is_paid?: boolean
          mode?: string
          name?: string
          other_category?: string | null
          participants?: Json[] | null
          payment_records?: Json | null
          requested_participants?: Json[] | null
          session_end_time?: string
          session_start_time?: string
          social_links?: string[]
          tagline?: string
          thumbnail_url?: string | null
          workshop_amount?: number | null
          workshop_ending_date?: string
          workshop_starting_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshops_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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
