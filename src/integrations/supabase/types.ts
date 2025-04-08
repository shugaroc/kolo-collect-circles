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
      user_wallets: {
        Row: {
          available_balance: number
          created_at: string
          fixed_balance: number
          id: string
          is_frozen: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          fixed_balance?: number
          id?: string
          is_frozen?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          fixed_balance?: number
          id?: string
          is_frozen?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          community_id: string | null
          created_at: string
          description: string | null
          id: string
          recipient_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          community_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recipient_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          community_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recipient_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_penalty: {
        Args: { p_user_id: string; p_community_id: string; p_amount: number }
        Returns: boolean
      }
      deposit_funds: {
        Args: { p_user_id: string; p_amount: number }
        Returns: boolean
      }
      fix_funds: {
        Args: { p_user_id: string; p_amount: number; p_release_date: string }
        Returns: boolean
      }
      is_community_admin: {
        Args: { community_id: string }
        Returns: boolean
      }
      process_contribution: {
        Args: {
          p_user_id: string
          p_community_id: string
          p_amount: number
          p_cycle_id: string
        }
        Returns: boolean
      }
      process_payout: {
        Args: { p_user_id: string; p_community_id: string; p_amount: number }
        Returns: boolean
      }
      withdraw_funds: {
        Args: { p_user_id: string; p_amount: number }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      community_status: ["Active", "Locked", "Completed"],
      positioning_mode: ["Random", "Fixed"],
    },
  },
} as const
