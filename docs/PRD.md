# 📄 PRD: Tratolibre

---

## 1. Resumen Ejecutivo

Plataforma de marketplace orientada a la publicación y venta de artículos nuevos y de segunda mano, diseñada para minimizar la fricción en el proceso de publicación y permitir a cualquier usuario listar productos de forma rápida, gratis y sin complejidad innecesaria.

El sistema prioriza la simplicidad, la velocidad de interacción y la accesibilidad, reduciendo las barreras típicas presentes en plataformas tradicionales de compra-venta.

| Aspecto       | Detalle                                                  |
| ------------- | -------------------------------------------------------- |
| Tipo          | Marketplace de bienes físicos                            |
| Mercado       | Compra-venta entre particulares                          |
| Plataforma    | Web (Responsive - Desktop/Mobile)                        |
| Estado actual | MVP avanzado con backend real, realtime y sistema social |

---

## 2. Stack Tecnológico

| Capa           | Tecnología                             |
| -------------- | -------------------------------------- |
| Framework      | Next.js 16 (App Router)                |
| Lenguaje       | TypeScript                             |
| Base de datos  | PostgreSQL (Supabase)                  |
| Cliente DB     | Supabase SDK                           |
| UI Components  | Chakra UI                              |
| Data Fetching  | React Query                            |
| Estado global  | Zustand                                |
| Formularios    | React Hook Form                        |
| Validación     | Zod                                    |
| Auth           | Supabase Auth (JWT & Cookies + Google) |
| Realtime       | Supabase Realtime                      |
| Observabilidad | Sentry                                 |
| Hosting        | Vercel                                 |

---

## 3. Usuarios

| Tipo de Usuario | Descripción                                   | Permisos Clave                                                                                                             |
| --------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Usuario General | Persona que desea vender o explorar productos | • Crear publicaciones<br>• Editar/eliminar publicaciones propias<br>• Interactuar con otros usuarios<br>• Gestionar perfil |

---

## 4. Funcionalidades Principales

### 4.1 Publicación de Productos

- Creación de publicaciones con flujo simplificado
- Subida de imágenes con compresión automática
- Descripción libre del producto
- Asociación a categorías
- Edición y eliminación de publicaciones

---

### 4.2 Exploración y Descubrimiento

- Listado global de productos
- Búsqueda por palabras clave
- Filtros básicos
- Navegación optimizada para performance

---

### 4.3 Interacción entre Usuarios

- Chat en tiempo real entre comprador y vendedor
- Sistema de notificaciones in-app
- Sistema de favoritos
- Sistema de reputación y valoraciones

---

### 4.4 Autenticación y Seguridad

- Registro y login con email y contraseña
- Login con proveedor externo (Google)
- Manejo de sesión mediante Supabase Auth (JWT & Cookies)

**Seguridad multi-capa:**

- Capa UI: validación y control de estado
- Capa servidor: Server Actions + protección de rutas
- Capa DB: Row Level Security (RLS)
- Control de acceso por usuario y roles

---

### 4.5 Moderación

- Herramientas para control de contenido
- Eliminación o edición de publicaciones
- Prevención de abuso mediante rate limiting

---

### 4.6 Manejo de Imágenes

- Subida desde cliente
- Compresión previa
- Optimización para performance y costos

---

## 5. Modelo de Datos (Esquema Inicial)

### User

Entidad que representa a un usuario del sistema.

- Puede crear publicaciones
- Puede interactuar con otros usuarios
- Posee reputación asociada

### Product

Entidad principal del marketplace.

- Contiene información del artículo
- Pertenece a un usuario

### Category

Clasificación de productos.

- Permite organizar y filtrar contenido

### Image

Representa archivos asociados a un producto.

- Relacionado a Product
- Almacenado en Supabase Storage

### Favorite

Relación entre usuario y productos guardados.

### Conversation / Message

Modelo para mensajería en tiempo real entre usuarios.

---

## 6. API y Acceso a Datos

El sistema utiliza Supabase como backend principal para:

- Autenticación
- Base de datos
- Realtime
- Storage

Se utilizan Server Actions y Route Handlers en Next.js para operaciones sensibles y mutaciones.

---

## 7. Requisitos No Funcionales

**Performance**

- Carga rápida de listados
- Optimización de imágenes
- Uso de cache (React Query)

**Seguridad**

- Control de acceso por usuario
- Protección de rutas privadas
- Validación cliente + servidor
- RLS en base de datos

**Escalabilidad**

- Arquitectura basada en features
- Separación de capas
- Bajo acoplamiento

**Mantenibilidad**

- Código tipado (TypeScript)
- Validaciones centralizadas
- Estructura modular

**UX**

- Flujo de publicación simple
- Baja fricción en onboarding
- Interfaz clara y directa

---

## 8. Exclusiones (No incluido en MVP)

- Sistema de pagos integrado
- Sistema de envíos
- Notificaciones por email
- Multi-idioma
- Modo offline
