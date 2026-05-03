/**
 * 🔄 Mapper de Profiles
 * Transforma datos entre DB y Domain
 */

import type { Profile, ProfileInsert, ProfileUpdate } from "../core/types";

export interface ProfileDTO {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  location: string | null;
  province: string | null;
  rating: number | null;
  reviewsCount: number;
  verified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  phone?: string;
  location?: string;
  province?: string;
}

export const profileMapper = {
  // DB Row → DTO
  toDTO(profile: Profile): ProfileDTO {
    return {
      id: profile.id,
      name: profile.name,
      bio: profile.bio,
      avatarUrl: profile.avatar_url,
      phone: profile.phone,
      location: profile.location,
      province: profile.province,
      rating: profile.rating,
      reviewsCount: profile.reviews_count ?? 0,
      verified: profile.verified ?? false,
      role: profile.role,
      createdAt: new Date(profile.created_at!),
      updatedAt: profile.updated_at ? new Date(profile.updated_at) : null,
    };
  },

  // UpdateProfileInput → DB Update
  toUpdate(input: UpdateProfileInput): ProfileUpdate {
    return {
      name: input.name,
      bio: input.bio,
      phone: input.phone,
      location: input.location,
      province: input.province,
    };
  },

  // DTO público (sin datos sensibles)
  toPublicDTO(profile: Profile): Omit<ProfileDTO, "phone"> {
    const dto = this.toDTO(profile);
    const { phone, ...publicData } = dto;
    return publicData;
  },

  // Array
  toDTOArray(profiles: Profile[]): ProfileDTO[] {
    return profiles.map((p) => this.toDTO(p));
  },
};
