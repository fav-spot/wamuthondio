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
      accessories_sales: {
        Row: {
          amount_paid: number | null
          balance_owed: number | null
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          id: string
          item_name: string | null
          mpesa_ref: string | null
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          quantity: number | null
          sale_date: string | null
          total_amount: number | null
          unit_price: number | null
        }
        Insert: {
          amount_paid?: number | null
          balance_owed?: number | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          item_name?: string | null
          mpesa_ref?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          quantity?: number | null
          sale_date?: string | null
          total_amount?: number | null
          unit_price?: number | null
        }
        Update: {
          amount_paid?: number | null
          balance_owed?: number | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          item_name?: string | null
          mpesa_ref?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          quantity?: number | null
          sale_date?: string | null
          total_amount?: number | null
          unit_price?: number | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          role?: string | null
        }
        Relationships: []
      }
      balance_payments: {
        Row: {
          amount_paid: number | null
          created_at: string
          customer_phone: string | null
          id: string
          mpesa_ref: string | null
          notes: string | null
          payment_method: string | null
          received_by: string | null
          remaining_balance: number | null
          sale_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          customer_phone?: string | null
          id?: string
          mpesa_ref?: string | null
          notes?: string | null
          payment_method?: string | null
          received_by?: string | null
          remaining_balance?: number | null
          sale_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          customer_phone?: string | null
          id?: string
          mpesa_ref?: string | null
          notes?: string | null
          payment_method?: string | null
          received_by?: string | null
          remaining_balance?: number | null
          sale_id?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          added_by: string | null
          brand_colour: string
          brand_name: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_brand_locked: boolean
        }
        Insert: {
          added_by?: string | null
          brand_colour?: string
          brand_name: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_brand_locked?: boolean
        }
        Update: {
          added_by?: string | null
          brand_colour?: string
          brand_name?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_brand_locked?: boolean
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          customer_area: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          is_frequent: boolean | null
          last_purchase_date: string | null
          loyalty_offer_sent: boolean | null
          notes: string | null
          outstanding_balance: number | null
          preferred_brand: string | null
          total_purchases: number | null
          total_spent: number | null
        }
        Insert: {
          created_at?: string
          customer_area?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          is_frequent?: boolean | null
          last_purchase_date?: string | null
          loyalty_offer_sent?: boolean | null
          notes?: string | null
          outstanding_balance?: number | null
          preferred_brand?: string | null
          total_purchases?: number | null
          total_spent?: number | null
        }
        Update: {
          created_at?: string
          customer_area?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          is_frequent?: boolean | null
          last_purchase_date?: string | null
          loyalty_offer_sent?: boolean | null
          notes?: string | null
          outstanding_balance?: number | null
          preferred_brand?: string | null
          total_purchases?: number | null
          total_spent?: number | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          inquiry_type: string
          message: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          inquiry_type?: string
          message?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          inquiry_type?: string
          message?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount_paid: number | null
          balance_owed: number | null
          brand_given: string | null
          brand_received: string | null
          created_at: string
          customer_area: string | null
          customer_name: string | null
          customer_phone: string | null
          cylinder_size: string | null
          id: string
          mpesa_ref: string | null
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          quantity: number | null
          receipt_sent: boolean | null
          sale_date: string | null
          sale_time: string | null
          served_by: string | null
          total_amount: number | null
          transaction_type: string | null
          unit_price: number | null
        }
        Insert: {
          amount_paid?: number | null
          balance_owed?: number | null
          brand_given?: string | null
          brand_received?: string | null
          created_at?: string
          customer_area?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          cylinder_size?: string | null
          id?: string
          mpesa_ref?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          quantity?: number | null
          receipt_sent?: boolean | null
          sale_date?: string | null
          sale_time?: string | null
          served_by?: string | null
          total_amount?: number | null
          transaction_type?: string | null
          unit_price?: number | null
        }
        Update: {
          amount_paid?: number | null
          balance_owed?: number | null
          brand_given?: string | null
          brand_received?: string | null
          created_at?: string
          customer_area?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          cylinder_size?: string | null
          id?: string
          mpesa_ref?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          quantity?: number | null
          receipt_sent?: boolean | null
          sale_date?: string | null
          sale_time?: string | null
          served_by?: string | null
          total_amount?: number | null
          transaction_type?: string | null
          unit_price?: number | null
        }
        Relationships: []
      }
      stock_log: {
        Row: {
          brand: string | null
          created_at: string
          current_stock: number | null
          cylinder_size: string | null
          id: string
          log_date: string | null
          logged_by: string | null
          movement_type: string | null
          notes: string | null
          quantity_in: number | null
          quantity_out: number | null
        }
        Insert: {
          brand?: string | null
          created_at?: string
          current_stock?: number | null
          cylinder_size?: string | null
          id?: string
          log_date?: string | null
          logged_by?: string | null
          movement_type?: string | null
          notes?: string | null
          quantity_in?: number | null
          quantity_out?: number | null
        }
        Update: {
          brand?: string | null
          created_at?: string
          current_stock?: number | null
          cylinder_size?: string | null
          id?: string
          log_date?: string | null
          logged_by?: string | null
          movement_type?: string | null
          notes?: string | null
          quantity_in?: number | null
          quantity_out?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_media: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number | null
          file_name: string | null
          file_url: string | null
          id: string
          is_active: boolean | null
          section: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          section?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          section?: string | null
          uploaded_by?: string | null
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
    }
    Enums: {
      app_role: "admin" | "staff"
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
      app_role: ["admin", "staff"],
    },
  },
} as const
