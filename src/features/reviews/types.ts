import { Database } from "@/lib/supabase/database.types";

// ==================== DB Types ====================
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
export type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];

export type PurchaseRow = Database["public"]["Tables"]["purchases"]["Row"];

// ==================== Extended Types ====================

// Review con reviewer joineado
export type ReviewWithReviewer = ReviewRow & {
  reviewer: {
    name: string;
    avatar_url: string | null;
  } | null;
};

export type PurchaseWithRelations = PurchaseRow & {
  items:
    | {
        title: string;
        images: string[];
      }
    | { title: string; images: string[] }[]
    | null; // Soporta objeto único o array
  buyer: { id: string; name: string } | null;
  owner: { id: string; name: string } | null;
};

// Purchase pendiente de review (con data computada)
export type PendingReview = PurchaseWithRelations & {
  myRole: "buyer" | "seller";
  reviewedId: string;
  reviewedName: string;
  itemTitle: string;
};

// ==================== UI Types ====================

// Input del modal de review
export type ReviewModalData = {
  purchaseId: string;
  reviewedId: string;
  reviewedName: string;
  itemTitle: string;
  role: "buyer" | "seller";
};

// Estado del formulario de review
export type ReviewFormState = {
  rating: number;
  comment: string;
  loading: boolean;
  submitted: boolean;
  error: string | null;
};
