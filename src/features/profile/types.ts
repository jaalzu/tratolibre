import { Database } from "@/lib/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileWithStats = {
  profile: Profile;
  items: any[];
  salesCount: number;
  purchasesCount: number;
};

export type ProfileWithReviews = ProfileWithStats & {
  reviews: any[];
};

export type EditProfileDefaultValues = {
  name?: string | null;
  location?: string | null;
  province?: string | null;
  avatar?: string | null;
};
