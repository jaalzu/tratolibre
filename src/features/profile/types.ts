import { Database } from "@/lib/supabase/database.types";

export type ActionResponse<T = void> =
  | { status: "success"; data?: T }
  | { status: "error"; message: string };

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

export type EditableProfileFields = Pick<
  Profile,
  "name" | "location" | "province" | "avatar_url"
>;

export type ProfileUpdateData = Partial<EditableProfileFields>;

export type EditProfileDefaultValues = Partial<
  Pick<Profile, "name" | "location" | "province" | "avatar_url">
>;
