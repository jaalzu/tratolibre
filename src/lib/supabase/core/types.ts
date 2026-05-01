/**
 * 📝 Tipos generados automáticamente desde Supabase
 * Generados con: supabase gen types typescript
 */

export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "../database.types";

// Re-exportamos los tipos más usados para acceso fácil
import type { Database } from "../database.types";

export type Item = Database["public"]["Tables"]["items"]["Row"];
export type ItemInsert = Database["public"]["Tables"]["items"]["Insert"];
export type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type Purchase = Database["public"]["Tables"]["purchases"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type Report = Database["public"]["Tables"]["reports"]["Row"];
