/**
 * 🎯 Service de Purchases
 * Lógica de negocio para compras/ventas
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { PurchasesRepository } from "../repositories/purchases";
import { ItemsRepository } from "../repositories/items";
import {
  purchaseMapper,
  type PurchaseWithDetailsDTO,
  type CreatePurchaseInput,
} from "../mappers/purchase";
import {
  UnauthorizedError,
  NotFoundError,
  DatabaseError,
} from "../core/errors";

export class PurchasesService {
  private repository: PurchasesRepository;
  private itemsRepo: ItemsRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new PurchasesRepository(supabase);
    this.itemsRepo = new ItemsRepository(supabase);
  }

  /**
   * Obtener compras de un usuario
   */
  async getBuyerPurchases(
    buyerId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<PurchaseWithDetailsDTO[]> {
    const purchases = await this.repository.findByBuyer(buyerId, options);
    return purchaseMapper.toDTOWithDetailsArray(purchases);
  }

  /**
   * Obtener ventas de un usuario
   */
  async getSellerSales(
    sellerId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<PurchaseWithDetailsDTO[]> {
    const sales = await this.repository.findBySeller(sellerId, options);
    return purchaseMapper.toDTOWithDetailsArray(sales);
  }

  /**
   * Crear solicitud de compra
   */
  async create(
    input: CreatePurchaseInput,
    buyerId: string,
  ): Promise<PurchaseWithDetailsDTO> {
    // Verificar que el item exista y esté disponible
    const item = await this.itemsRepo.findById(input.itemId);
    if (!item) throw new NotFoundError("Item", input.itemId);
    if (!item.available) {
      throw new DatabaseError("Este item ya no está disponible");
    }
    if (item.sold) {
      throw new DatabaseError("Este item ya fue vendido");
    }

    // No puede comprar su propio item
    if (item.owner_id === buyerId) {
      throw new UnauthorizedError("No podés comprar tu propio item");
    }

    // Verificar que no haya una compra pendiente
    const existing = await this.repository.findByItem(input.itemId);
    if (existing) {
      throw new DatabaseError(
        "Ya existe una solicitud de compra para este item",
      );
    }

    const insertData = purchaseMapper.toInsert(input, buyerId);
    const created = await this.repository.create(insertData);

    // Marcar item como no disponible
    await this.itemsRepo.update(input.itemId, { available: false });

    // Obtener la compra con detalles
    const purchases = await this.repository.findByBuyer(buyerId, { limit: 1 });
    const purchase = purchases.find((p) => p.id === created.id);

    if (!purchase) throw new NotFoundError("Purchase", created.id);

    return purchaseMapper.toDTOWithDetails(purchase);
  }

  /**
   * Confirmar compra (marcar como completada)
   */
  async confirm(
    purchaseId: string,
    userId: string,
  ): Promise<PurchaseWithDetailsDTO> {
    const purchase = await this.repository.findById(purchaseId);
    if (!purchase) throw new NotFoundError("Purchase", purchaseId);

    // Solo el vendedor puede confirmar
    if (purchase.owner_id !== userId) {
      throw new UnauthorizedError("Solo el vendedor puede confirmar la compra");
    }

    // Actualizar estado
    const updated = await this.repository.updateStatus(purchaseId, "completed");

    // Marcar item como vendido
    await this.itemsRepo.markAsSold(purchase.item_id);

    const purchases = await this.repository.findBySeller(userId, { limit: 1 });
    const updatedPurchase = purchases.find((p) => p.id === purchaseId);

    if (!updatedPurchase) throw new NotFoundError("Purchase", purchaseId);

    return purchaseMapper.toDTOWithDetails(updatedPurchase);
  }

  /**
   * Cancelar compra
   */
  async cancel(purchaseId: string, userId: string): Promise<void> {
    const purchase = await this.repository.findById(purchaseId);
    if (!purchase) throw new NotFoundError("Purchase", purchaseId);

    // Tanto comprador como vendedor pueden cancelar
    if (purchase.buyer_id !== userId && purchase.owner_id !== userId) {
      throw new UnauthorizedError(
        "No tenés permisos para cancelar esta compra",
      );
    }

    // Actualizar estado
    await this.repository.updateStatus(purchaseId, "cancelled");

    // Volver a hacer disponible el item
    await this.itemsRepo.update(purchase.item_id, { available: true });
  }

  /**
   * Obtener estadísticas de ventas
   */
  async getSellerStats(sellerId: string) {
    return this.repository.getSellerStats(sellerId);
  }
}
