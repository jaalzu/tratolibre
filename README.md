# 🛒 Tratolibre

<p align="center">
  <img src="/public/readme-desktop.webp" alt="Desktop preview" width="70%" />
  <img src="/public/readme-mobile.webp" alt="Mobile preview" width="25%" />
</p>

Tratolibre es un marketplace moderno enfocado en la publicación rápida y sin fricción de artículos nuevos y de segunda mano. Está diseñado priorizando escalabilidad, rendimiento y una arquitectura desacoplada.

---

## Highlights

- Arquitectura basada en Features (FSD-like) con enfoque tipo Clean Architecture
- Separación de capas: dominio, aplicación e infraestructura
- Manejo de datos consistente: validación + transformación en frontend y backend
- Next.js App Router con Server / Client Components y Server Actions
- Seguridad multi-capa: Proxy + Server Actions + Row Level Security (RLS)
- Realtime con Supabase (chat y notificaciones sin polling)
- Data fetching desacoplado con React Query (cache + sincronización)
- Optimización de rendimiento: lazy loading, code splitting e imágenes optimizadas
- Uso de CSS Modules en la landing para mejorar carga inicial
- Testing: Vitest (unit) + Playwright (E2E)
- CI/CD automatizado con Vercel

---

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Supabase (Auth, PostgreSQL, Realtime, Storage)
- **Estado:** React Query + Zustand
- **UI:** Chakra UI + CSS Modules
- **Testing:** Vitest, Testing Library, Playwright
- **Deploy & CI/CD:** Vercel , Github

---

## Features

### Marketplace

- Publicación, edición y eliminación de productos
- Subida y optimización de imágenes
- Búsqueda y filtrado

### Interacción

- Chat en tiempo real comprador/vendedor
- Notificaciones in-app
- Sistema de favoritos
- Sistema de reputación

### Plataforma

- Autenticación (email + Google)
- Protección de rutas y sesiones SSR
- Moderación de contenido
- Sistema de roles y autorización

---

## Futuras features

- Pagos integrados
- Sistema de envíos
- Notificaciones por email
- Recomendaciones

---

## 🔧 Setup

```bash
git clone https://github.com/tu-usuario/tratolibre.git
cd tratolibre
npm install
npm run dev
```

---

## 🔐 Environment

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
