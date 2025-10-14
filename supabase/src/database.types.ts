export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          address: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          created_by: string | null;
          email: string;
          id: string;
          is_personal_account: boolean;
          name: string;
          phone: string | null;
          picture_url: string | null;
          postal_code: string | null;
          public_data: Json;
          updated_at: string | null;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          email: string;
          id?: string;
          is_personal_account?: boolean;
          name: string;
          phone?: string | null;
          picture_url?: string | null;
          postal_code?: string | null;
          public_data?: Json;
          updated_at?: string | null;
          updated_by?: string | null;
          user_id?: string;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          email?: string;
          id?: string;
          is_personal_account?: boolean;
          name?: string;
          phone?: string | null;
          picture_url?: string | null;
          postal_code?: string | null;
          public_data?: Json;
          updated_at?: string | null;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          account_id: string;
          body: string;
          channel: Database["public"]["Enums"]["notification_channel"];
          created_at: string;
          dismissed: boolean;
          expires_at: string | null;
          id: number;
          link: string | null;
          type: Database["public"]["Enums"]["notification_type"];
        };
        Insert: {
          account_id: string;
          body: string;
          channel?: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          dismissed?: boolean;
          expires_at?: string | null;
          id?: never;
          link?: string | null;
          type?: Database["public"]["Enums"]["notification_type"];
        };
        Update: {
          account_id?: string;
          body?: string;
          channel?: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          dismissed?: boolean;
          expires_at?: string | null;
          id?: never;
          link?: string | null;
          type?: Database["public"]["Enums"]["notification_type"];
        };
        Relationships: [
          {
            foreignKeyName: "notifications_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          order_id: string;
          price_amount: number | null;
          product_id: string;
          quantity: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          order_id: string;
          price_amount?: number | null;
          product_id: string;
          quantity?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          order_id?: string;
          price_amount?: number | null;
          product_id?: string;
          quantity?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          account_id: string;
          city: string | null;
          country: string | null;
          currency: string;
          id: string;
          postal_code: string | null;
          shipping_address: string | null;
          status: Database["public"]["Enums"]["payment_status"];
          total_amount: number;
        };
        Insert: {
          account_id: string;
          city?: string | null;
          country?: string | null;
          currency: string;
          id: string;
          postal_code?: string | null;
          shipping_address?: string | null;
          status: Database["public"]["Enums"]["payment_status"];
          total_amount: number;
        };
        Update: {
          account_id?: string;
          city?: string | null;
          country?: string | null;
          currency?: string;
          id?: string;
          postal_code?: string | null;
          shipping_address?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          total_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: "orders_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          delivery_date: string;
          description: string | null;
          id: string;
          image_url: string | null;
          name: string;
          price: number;
          stock: number;
        };
        Insert: {
          delivery_date: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          price: number;
          stock: number;
        };
        Update: {
          delivery_date?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          price?: number;
          stock?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      user_account_workspace: {
        Row: {
          id: string | null;
          name: string | null;
          picture_url: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_account_owner: {
        Args: { account_id: string };
        Returns: boolean;
      };
      upsert_order: {
        Args: {
          currency: string;
          line_items: Json;
          status: Database["public"]["Enums"]["payment_status"];
          target_account_id: string;
          target_customer_id: string;
          target_order_id: string;
          total_amount: number;
        };
        Returns: {
          account_id: string;
          city: string | null;
          country: string | null;
          currency: string;
          id: string;
          postal_code: string | null;
          shipping_address: string | null;
          status: Database["public"]["Enums"]["payment_status"];
          total_amount: number;
        };
      };
    };
    Enums: {
      notification_channel: "in_app" | "email";
      notification_type: "info" | "warning" | "error";
      payment_status: "pending" | "succeeded" | "failed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      notification_channel: ["in_app", "email"],
      notification_type: ["info", "warning", "error"],
      payment_status: ["pending", "succeeded", "failed"],
    },
  },
} as const;
