# TratoLibre — Roadmap de Construcción
> Plataforma de alquiler y venta de objetos entre personas  
> Stack: Next.js 14 · Supabase · TypeScript · Tailwind · Stripe · Vercel

---

## FASE 0 — Prerrequisitos ✅
- [x] Node.js instalado (18+)
- [x] Git instalado
- [x] Cuenta en Supabase
- [x] Cuenta en Vercel
- [x] Cuenta en GitHub
- [ ] Cuenta en Stripe (modo test por ahora)
- [ ] Cuenta en Resend (emails)

---

## FASE 1 — Setup del proyecto
- [x] `npx create-next-app@latest` ejecutado
- [x] Dependencias instaladas (`npm install ...`)
- [x ] `.env.local` creado con keys de Supabase
- [ x] Clientes Supabase creados (`lib/supabase/client.ts` y `server.ts`)
- [ x] Estructura de carpetas feature-based creada
- [x ] `tailwind.config.ts` con paleta TratoLibre
- [ ] `lib/utils.ts` con `cn()`, `formatCurrency()`, `formatDate()`
- [x ] Middleware de protección de rutas (`proxy.ts`)
- [x ] `npm run dev` levanta sin errores

---

## FASE 2 — Supabase: Base de datos
- [x ] Proyecto creado en supabase.com
- [ x] SQL ejecutado: tabla `profiles`
- [ x] SQL ejecutado: tabla `Items` (con campos `listing_type`: rent/sell/both, `price_per_day`, `sale_price`)
- [x ] SQL ejecutado: tabla `reservations`
- [x ] SQL ejecutado: tabla `messages`
- [ x] SQL ejecutado: tabla `reviews`
- [ x] SQL ejecutado: tabla `state_records`
- [ x] SQL ejecutado: tabla `contracts`
- [ x] SQL ejecutado: tabla `deposits`
- [x ] RLS habilitado en todas las tablas
- [x ] Todas las policies de RLS aplicadas
- [x ] Trigger: crear perfil automático al registrarse
- [x ] Trigger: actualizar rating al crear review
- [ x] Storage buckets creados: `Item-images`, `profile-avatars`, `state-records`
- [ x] Policies de Storage aplicadas
- [ x] Types de Supabase generados (`types/database.ts`)

---

## FASE 3 — Autenticación
- [ x] `lib/supabase/client.ts` — cliente browser
- [ x] `lib/supabase/server.ts` — cliente server
- [x ] `middleware.ts` — protección de rutas
- [x ] Server Action: `registerAction`
- [x ] Server Action: `loginAction`
- [x ] Server Action: `logoutAction`
- [x ] Página `/register` funcional
- [x ] Página `/login` funcional
- [x ] Redirect post-login al dashboard
- [x ] Redirect rutas protegidas al login
- [ ] Perfil de usuario editable (nombre, foto, bio)

---

## FASE 4 — Módulo de Objetos
- [ ] Schema Zod del objeto (con `listing_type`, `price_per_day`, `sale_price`)
- [ ] Categorías definidas (abierto a cualquier objeto)
- [ ] Server Action: `createItemAction`
- [ ] Server Action: `updateItemAction`
- [ ] Server Action: `deleteItemAction`
- [ ] Upload de fotos a Supabase Storage (`/api/upload`)
- [ ] Página `/Item/new` — formulario publicar objeto
- [ ] Página `/Item/[id]` — detalle del objeto
- [ ] Página `/dashboard/Items` — mis objetos
- [ ] Componente `ImageUpload` (drag & drop, hasta 8 fotos)

---

## FASE 5 — Búsqueda y Descubrimiento
- [ ] Índices full-text en Supabase (`pg_trgm`)
- [ ] Hook `useItems` con filtros (texto, categoría, ciudad, precio, tipo: alquiler/venta)
- [ ] Página `/explore` — listado con filtros
- [ ] Componente `ItemCard` (foto, título, precio, tipo, rating)
- [ ] Filtro por tipo de publicación (alquiler / venta / ambos)
- [ ] Ordenamiento (precio, más nuevo, rating)
- [ ] Landing page `/` con destacados y categorías

---

## FASE 6 — Reservas (para alquiler)
- [ ] Schema Zod de reserva
- [ ] Server Action: `createReservationAction`
- [ ] Server Action: `updateReservationStatusAction`
- [ ] Flujo completo: pending → accepted → active → completed
- [ ] Cancelación con política simple
- [ ] Página `/dashboard/reservations` — mis reservas
- [ ] Componente `ReservationFlow` (selector fechas + precio calculado)
- [ ] Componente `StatusBadge` (colores por estado)

---

## FASE 6B — Compras (para venta)
- [ ] Flujo de compra: interesado contacta → owner confirma → marcado como vendido
- [ ] Estado `sold` en el objeto
- [ ] Página de confirmación de compra
- [ ] Objeto se marca como no disponible tras venta

---

## FASE 7 — Mensajería en tiempo real
- [ ] Hook `useChat` con Supabase Realtime
- [ ] Mensajes llegan sin recargar página
- [ ] Componente `ChatWindow`
- [ ] Página `/dashboard/messages`
- [ ] Badge de mensajes no leídos en navbar
- [ ] Chat disponible para reservas Y para consultas de compra

---

## FASE 8 — Confianza y Reputación
- [ ] Server Action: `createReviewAction` (solo post-completed)
- [ ] Reviews mutuas (owner califica renter, renter califica owner)
- [ ] Componente `StarRating` (interactivo y display)
- [ ] Server Action: `createStateRecordAction` (fotos antes/después)
- [ ] Contrato digital generado automáticamente al aceptar reserva
- [ ] PDF descargable del contrato

---

## FASE 9 — Pagos con Stripe
- [ ] `lib/stripe.ts` configurado
- [ ] `/api/stripe/create-intent` — depósito con hold
- [ ] `/api/stripe/webhook` — escucha eventos
- [ ] Flujo de depósito en UI (modal con Stripe Elements)
- [ ] Liberación de depósito post-devolución aprobada
- [ ] Modo test funcionando end-to-end
- [ ] Cambio a modo LIVE antes del launch

---

## FASE 10 — UI/UX y Diseño
- [ ] Paleta de colores definida (verde TratoLibre)
- [ ] Componentes UI base: Button, Input, Select, Modal, Toast
- [ ] Componente `Navbar` con auth state
- [ ] Componente `Footer`
- [ ] Componente `AvatarWithRating`
- [ ] Componente `PriceDisplay` (precio/día o precio de venta)
- [ ] Componente `CategoryGrid` para landing
- [ ] Responsive mobile completo
- [ ] Dark mode (opcional, post-MVP)

---

## FASE 11 — Testing
- [ ] Auth: registro, login, logout, rutas protegidas
- [ ] Objetos: publicar, editar, eliminar, no puede ser del mismo owner
- [ ] Alquiler: flujo completo pending → completed
- [ ] Compra: flujo completo contacto → vendido
- [ ] Chat: tiempo real, privacidad entre partes
- [ ] Reviews: solo post-completed, no se puede repetir
- [ ] Stripe: depósito en test mode, webhook recibido
- [ ] Mobile: todos los flujos en pantalla chica

---

## FASE 12 — Deploy y Producción
- [ ] Repo en GitHub con rama `main`
- [ ] Proyecto conectado en Vercel
- [ ] Variables de entorno cargadas en Vercel
- [ ] Primer deploy exitoso en Vercel
- [ ] Dominio propio configurado (tratolibre.com / .com.ar)
- [ ] HTTPS activo
- [ ] Stripe webhook apuntando al dominio de producción
- [ ] Stripe en modo LIVE
- [ ] Backup automático de Supabase habilitado
- [ ] Términos y condiciones publicados
- [ ] **🚀 LAUNCH**

---

## Progreso general
| Fase | Estado |
|------|--------|
| 0 — Prerrequisitos | ✅ Completa |
| 1 — Setup proyecto | 🟡 En progreso |
| 2 — Supabase DB | ⬜ Pendiente |
| 3 — Auth | ⬜ Pendiente |
| 4 — Objetos | ⬜ Pendiente |
| 5 — Búsqueda | ⬜ Pendiente |
| 6 — Reservas | ⬜ Pendiente |
| 6B — Compras | ⬜ Pendiente |
| 7 — Mensajería | ⬜ Pendiente |
| 8 — Confianza | ⬜ Pendiente |
| 9 — Stripe | ⬜ Pendiente |
| 10 — UI/UX | ⬜ Pendiente |
| 11 — Testing | ⬜ Pendiente |
| 12 — Deploy | ⬜ Pendiente |

---

*Actualizar los checkboxes a medida que se completa cada ítem.*  
*TratoLibre · v1.0 · 2025*