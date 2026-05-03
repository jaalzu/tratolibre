/**
 * 🎯 Service de Items
 * Lógica de negocio para publicaciones
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { ItemsRepository } from "../repositories/items";
import {
  itemMapper,
  type CreateItemInput,
  type UpdateItemInput,
  type ItemDTO,
  type ItemWithOwnerDTO,
} from "../mappers/item";
import { checkRateLimit, RATE_LIMITS } from "../utils/rate-limiter";
import { UnauthorizedError, NotFoundError } from "../core/errors";

export class ItemsService {
  private repository: ItemsRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new ItemsRepository(supabase);
  }

  /**
   * Obtener item por ID
   */
  async getById(itemId: string): Promise<ItemDTO> {
    const item = await this.repository.findById(itemId);
    if (!item) throw new NotFoundError("Item", itemId);
    return itemMapper.toDTO(item);
  }

  /**
   * Obtener item con información del dueño
   */
  async getByIdWithOwner(itemId: string): Promise<ItemWithOwnerDTO> {
    const item = await this.repository.findWithOwner(itemId);
    if (!item) throw new NotFoundError("Item", itemId);
    return itemMapper.toDTOWithOwner(item);
  }

  /**
   * Obtener items disponibles (feed principal)
   */
  async getAvailable(options?: { limit?: number; offset?: number }) {
    const items = await this.repository.findAvailable(options);
    return itemMapper.toDTOArray(items);
  }

  /**
   * Obtener items por categoría
   */
  async getByCategory(
    category: string,
    options?: { limit?: number; offset?: number },
  ) {
    const items = await this.repository.findByCategory(category, options);
    return itemMapper.toDTOArray(items);
  }

  /**
   * Obtener items por provincia
   */
  async getByProvince(
    province: string,
    options?: { limit?: number; offset?: number },
  ) {
    const items = await this.repository.findByProvince(province, options);
    return itemMapper.toDTOArray(items);
  }

  /**
   * Obtener items de un usuario
   */
  async getByOwnerId(
    ownerId: string,
    options?: { limit?: number; offset?: number },
  ) {
    const items = await this.repository.findByOwnerId(ownerId, options);
    return itemMapper.toDTOArray(items);
  }

  /**
   * Buscar items por texto
   */
  async search(query: string, options?: { limit?: number; offset?: number }) {
    const items = await this.repository.search(query, options);
    return itemMapper.toDTOArray(items);
  }

  /**
   * Obtener items similares
   */
  async getSimilar(itemId: string, category: string, limit = 6) {
    const items = await this.repository.findSimilar(itemId, category, limit);
    return itemMapper.toDTOArray(items);
  }

  /**
   * Crear nuevo item
   */
  async create(input: CreateItemInput, userId: string): Promise<ItemDTO> {
    // Rate limiting
    await checkRateLimit(
      this.supabase,
      userId,
      "create_item",
      RATE_LIMITS.CREATE_ITEM,
    );

    const insertData = itemMapper.toInsert(input, userId);
    const created = await this.repository.create(insertData);
    return itemMapper.toDTO(created);
  }

  /**
   * Actualizar item
   */
  async update(
    itemId: string,
    input: UpdateItemInput,
    userId: string,
  ): Promise<ItemDTO> {
    // Verificar ownership
    const item = await this.repository.findById(itemId);
    if (!item) throw new NotFoundError("Item", itemId);
    if (item.owner_id !== userId) {
      throw new UnauthorizedError(
        "No podés editar publicaciones de otros usuarios",
      );
    }

    const updateData = itemMapper.toUpdate(input);
    const updated = await this.repository.update(itemId, updateData);
    return itemMapper.toDTO(updated);
  }

  /**
   * Eliminar item
   */
  async delete(itemId: string, userId: string): Promise<void> {
    // Verificar ownership
    const item = await this.repository.findById(itemId);
    if (!item) throw new NotFoundError("Item", itemId);
    if (item.owner_id !== userId) {
      throw new UnauthorizedError(
        "No podés eliminar publicaciones de otros usuarios",
      );
    }

    await this.repository.delete(itemId);
  }

  /**
   * Incrementar vistas
   */
  async incrementViews(itemId: string): Promise<void> {
    await this.repository.incrementViews(itemId);
  }

  /**
   * Marcar como vendido
   */
  async markAsSold(itemId: string, userId: string): Promise<ItemDTO> {
    const item = await this.repository.findById(itemId);
    if (!item) throw new NotFoundError("Item", itemId);
    if (item.owner_id !== userId) {
      throw new UnauthorizedError(
        "No podés marcar como vendido items de otros usuarios",
      );
    }

    const updated = await this.repository.markAsSold(itemId);
    return itemMapper.toDTO(updated);
  }

  /**
   * Cambiar disponibilidad
   */
  async toggleAvailability(itemId: string, userId: string): Promise<ItemDTO> {
    const item = await this.repository.findById(itemId);
    if (!item) throw new NotFoundError("Item", itemId);
    if (item.owner_id !== userId) {
      throw new UnauthorizedError("No podés modificar items de otros usuarios");
    }

    const updated = await this.repository.update(itemId, {
      available: !item.available,
    });
    return itemMapper.toDTO(updated);
  }
}
