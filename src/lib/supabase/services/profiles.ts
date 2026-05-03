/**
 * 🎯 Service de Profiles
 * Lógica de negocio para perfiles de usuario
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import { ProfilesRepository } from "../repositories/profiles";
import {
  profileMapper,
  type ProfileDTO,
  type UpdateProfileInput,
} from "../mappers/profile";
import { checkRateLimit, RATE_LIMITS } from "../utils/rate-limiter";
import { UnauthorizedError, NotFoundError } from "../core/errors";

export class ProfilesService {
  private repository: ProfilesRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new ProfilesRepository(supabase);
  }

  /**
   * Obtener perfil por ID
   */
  async getById(userId: string): Promise<ProfileDTO> {
    const profile = await this.repository.findById(userId);
    if (!profile) throw new NotFoundError("Profile", userId);
    return profileMapper.toDTO(profile);
  }

  /**
   * Obtener perfil público (sin datos sensibles)
   */
  async getPublicProfile(userId: string) {
    const profile = await this.repository.findById(userId);
    if (!profile) throw new NotFoundError("Profile", userId);
    return profileMapper.toPublicDTO(profile);
  }

  /**
   * Buscar perfiles por nombre
   */
  async searchByName(name: string) {
    const profiles = await this.repository.findByName(name);
    return profileMapper.toDTOArray(profiles);
  }

  /**
   * Obtener perfil con estadísticas
   */
  async getWithStats(userId: string) {
    const profile = await this.repository.findWithItemStats(userId);
    if (!profile) throw new NotFoundError("Profile", userId);

    return {
      ...profileMapper.toDTO(profile),
      stats: {
        totalItems: profile.items?.[0]?.count || 0,
        activeItems: profile.active_items?.[0]?.count || 0,
      },
    };
  }

  /**
   * Obtener vendedores destacados
   */
  async getFeaturedSellers(limit = 10) {
    const sellers = await this.repository.getFeaturedSellers(limit);
    return profileMapper.toDTOArray(sellers);
  }

  /**
   * Actualizar perfil
   */
  async update(
    userId: string,
    input: UpdateProfileInput,
    currentUserId: string,
  ): Promise<ProfileDTO> {
    // Verificar que sea el mismo usuario
    if (userId !== currentUserId) {
      throw new UnauthorizedError("No podés editar el perfil de otro usuario");
    }

    // Rate limiting
    await checkRateLimit(
      this.supabase,
      userId,
      "update_profile",
      RATE_LIMITS.UPDATE_PROFILE,
    );

    const updateData = profileMapper.toUpdate(input);
    const updated = await this.repository.update(userId, updateData);
    return profileMapper.toDTO(updated);
  }

  /**
   * Actualizar avatar
   */
  async updateAvatar(
    userId: string,
    avatarUrl: string,
    currentUserId: string,
  ): Promise<ProfileDTO> {
    if (userId !== currentUserId) {
      throw new UnauthorizedError("No podés editar el perfil de otro usuario");
    }

    const updated = await this.repository.update(userId, {
      avatar_url: avatarUrl,
    });
    return profileMapper.toDTO(updated);
  }

  /**
   * Verificar usuario (solo admin)
   */
  async verify(userId: string): Promise<ProfileDTO> {
    const updated = await this.repository.verify(userId);
    return profileMapper.toDTO(updated);
  }
}
