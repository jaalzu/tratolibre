"use server";

import { createClient } from "@/lib/supabase/client/server";
import { getReviewsByProfile } from "../../services/review-service";

export async function getReviewsByProfileAction(profileId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await getReviewsByProfile(supabase, profileId);

    if (error) throw new Error(error);

    return data ?? [];
  } catch (err) {
    console.error(`Error fetching reviews for profile ${profileId}:`, err);

    return [];
  }
}
