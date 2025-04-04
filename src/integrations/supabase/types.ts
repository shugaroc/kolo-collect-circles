export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      communities: {
        Row: {
          admin_id: string
          backup_fund: number
          backup_fund_percentage: number
          contribution_goal: number
          created_at: string
          description: string | null
          first_cycle_min: number
          id: string
          is_private: boolean
          max_members: number
          member_count: number
          min_contribution: number
          name: string
          positioning_mode: Database["public"]["Enums"]["positioning_mode"]
          status: Database["public"]["Enums"]["community_status"]
          total_contribution: number
          updated_at: string
        }
        Insert: {
          admin_id: string
          backup_fund?: number
          backup_fund_percentage?: number
          contribution_goal?: number
          created_at?: string
          description?: string | null
          first_cycle_min?: number
          id?: string
          is_private?: boolean
          max_members?: number
          member_count?: number
          min_contribution?: number
          name: string
          positioning_mode?: Database["public"]["Enums"]["positioning_mode"]
          status?: Database["public"]["Enums"]["community_status"]
          total_contribution?: number
          updated_at?: string
        }
        Update: {
          admin_id?: string
          backup_fund?: number
          backup_fund_percentage?: number
          contribution_goal?: number
          created_at?: string
          description?: string | null
          first_cycle_min?: number
          id?: string
          is_private?: boolean
          max_members?: number
          member_count?: number
          min_contribution?: number
          name?: string
          positioning_mode?: Database["public"]["Enums"]["positioning_mode"]
          status?: Database["public"]["Enums"]["community_status"]
          total_contribution?: number
          updated_at?: string
        }
        Relationships: []
      }
      community_activity_logs: {
        Row: {
          action: string
          community_id: string
          created_at: string
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          community_id: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          community_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_activity_logs_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_cycles: {
        Row: {
          community_id: string
          cycle_number: number
          end_date: string | null
          id: string
          is_complete: boolean
          start_date: string
        }
        Insert: {
          community_id: string
          cycle_number: number
          end_date?: string | null
          id?: string
          is_complete?: boolean
          start_date?: string
        }
        Update: {
          community_id?: string
          cycle_number?: number
          end_date?: string | null
          id?: string
          is_complete?: boolean
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_cycles_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          contribution_paid: number
          id: string
          joined_at: string
          payment_plan: Json | null
          penalty: number
          position: number
          status: string
          user_id: string
        }
        Insert: {
          community_id: string
          contribution_paid?: number
          id?: string
          joined_at?: string
          payment_plan?: Json | null
          penalty?: number
          position: number
          status?: string
          user_id: string
        }
        Update: {
          community_id?: string
          contribution_paid?: number
          id?: string
          joined_at?: string
          payment_plan?: Json | null
          penalty?: number
          position?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_mid_cycles: {
        Row: {
          amount: number | null
          cycle_id: string
          id: string
          is_complete: boolean
          payout_date: string
          payout_member_id: string | null
        }
        Insert: {
          amount?: number | null
          cycle_id: string
          id?: string
          is_complete?: boolean
          payout_date: string
          payout_member_id?: string | null
        }
        Update: {
          amount?: number | null
          cycle_id?: string
          id?: string
          is_complete?: boolean
          payout_date?: string
          payout_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_mid_cycles_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "community_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_mid_cycles_payout_member_id_fkey"
            columns: ["payout_member_id"]
            isOneToOne: false
            referencedRelation: "community_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_community_admin: {
        Args: {
          community_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      community_status: "Active" | "Locked" | "Completed"
      positioning_mode: "Random" | "Fixed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
