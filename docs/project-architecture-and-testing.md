# Tratolibre - Arquitectura, decisiones y testing

## Vision general del proyecto

Tratolibre es un marketplace construido con Next.js App Router, React, TypeScript y Supabase. La idea de producto que se ve en el codigo es clara: publicar articulos rapido, descubrir productos, guardar favoritos, chatear con vendedores, recibir notificaciones, completar ventas y dejar reviews.

La arquitectura apunta a crecer sin que todo termine mezclado en `app/`. Las rutas viven en `app/`, pero la logica real esta mayormente separada en `src/features`, `src/lib` y `src/shared`.

## Decisiones de arquitectura visibles

### 1. App Router como capa de entrada

Carpetas principales:

- `app/(auth)`: paginas publicas de autenticacion: login, registro, forgot password y reset password.
- `app/(main)`: experiencia principal autenticada o publica del marketplace: home, busqueda, item detail, publicar item, favoritos, perfil, chat, admin y paginas legales.
- `app/api/upload`: endpoint de subida.
- `app/auth/callback`: callback de autenticacion.
- `app/layout.tsx`, `app/providers.tsx`, `app/ClientProviders.tsx`: composicion global de providers, tema, analitica y layout.
- `proxy.ts`: capa de proteccion/redireccion de rutas antes de llegar a la pagina.

La decision buena aca es que `app/` no intenta contener todo. Las paginas son una capa de composicion y delegan la mayor parte del trabajo a features.

### 2. Arquitectura por features

La carpeta mas importante es `src/features`. Esta organizada por dominio:

- `admin`: moderacion, reportes, metricas y acciones administrativas.
- `auth`: login, registro, logout, recuperacion de password, schemas, hooks y servicios.
- `chat`: conversaciones, mensajes, realtime, store, guards y componentes de UI.
- `favorites`: vista y hooks de favoritos.
- `items`: publicacion, detalle, favoritos, ventas, imagenes, formularios y carousels.
- `notifications`: campana, panel, queries, mutations y configuracion de labels.
- `profile`: perfil publico, perfil propio, edicion, stats, items y reviews.
- `reports`: modal y flujo para reportar contenido.
- `reviews`: reviews pendientes, envio de review y schemas.
- `search`: filtros, barra de busqueda, sort, provincias y resultados.

Esta decision es fuerte y correcta para un marketplace: cada dominio tiene sus propias acciones, servicios, hooks, componentes, schemas y tipos. Evita que `components/`, `hooks/` o `utils/` globales se vuelvan un deposito enorme.

### 3. Separacion de capas dentro de cada feature

Patron repetido:

- `actions`: Server Actions o funciones invocables desde la UI/server.
- `services`: reglas de aplicacion y coordinacion con infraestructura.
- `hooks`: estado e interacciones del cliente.
- `components`: UI de esa feature.
- `schemas`: validacion con Zod.
- `types`: tipos propios del dominio.
- `mappers`: transformacion entre formato de Supabase y formato de app.

Esto se ve especialmente en `auth`, `items`, `chat`, `profile`, `reports` y `reviews`.

La decision arquitectonica principal: no consumir Supabase directamente desde cualquier componente. Hay capas intermedias para validar, mapear y encapsular errores.

### 4. Infraestructura Supabase encapsulada

Carpetas principales:

- `src/lib/supabase/client`: clientes `admin`, `browser`, `lazy` y `server`.
- `src/lib/supabase/core`: config, errores y tipos base.
- `src/lib/supabase/mappers`: transformaciones de tablas a modelos de app.
- `src/lib/supabase/repositories`: acceso a datos por recurso.
- `src/lib/supabase/services`: servicios de infraestructura para auth, items, messaging, notifications, profiles, purchases, reports y reviews.
- `src/lib/supabase/utils`: helpers de auth y rate limiter.
- `src/lib/supabase/database.types.ts`: tipos generados o mantenidos desde la DB.

Esta es una decision madura: Supabase queda como infraestructura, no como el centro de toda la app. Eso hace mas facil testear, cambiar queries y mantener reglas consistentes.

### 5. Estado del cliente

Se usan dos herramientas:

- React Query para cache, sincronizacion y fetching en cliente.
- Zustand para estado local de chat en `src/features/chat/store/chatStore.ts`.

Es una buena division: React Query para datos remotos; Zustand para estado de UI/interaccion que no conviene modelar como fetch.

### 6. Validacion con Zod

Hay schemas en features como:

- `src/features/auth/schemas`
- `src/features/items/schemas.ts`
- `src/features/profile/schemas.ts`
- `src/features/reports/schemas.ts`
- `src/features/reviews/schemas.ts`

La decision importante es validar en bordes: formularios, server actions y datos criticos. Los tests actuales tambien se apoyan mucho en estos schemas.

## Design system

### Stack visual

- Chakra UI v3 como base de componentes y sistema de tokens.
- CSS Modules en zonas visuales especificas, sobre todo landing/home y cards.
- Boxicons para iconografia.
- Assets reales en `public/hero`, `public/login`, `public/koala`, `public/svg`.

### Tokens principales

El sistema esta definido en `src/lib/theme.ts`.

Colores:

- `brand`: verde principal para accion positiva y marca.
- `secondary`: ambar/naranja para enfasis secundario.
- `accent`: azul para acciones o informacion destacada.
- `neutral`: escala gris desde blanco hasta casi negro.
- `feedback`: success, warning, error e info.

Tipografia:

- Geist como fuente principal.
- Escala simple: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`.
- Pesos: normal `400`, bold `600`.

Espaciado:

- Escala basada en 4px: `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, `24`.

Bordes:

- Radios chicos: `2px`, `4px`, `6px`.
- Esto da una identidad mas sobria y de producto, no tan redondeada.

Sombras:

- `base` para cards/contenedores.
- `focus` para accesibilidad visual.

### Componentes compartidos

Carpeta: `src/shared/components`.

Layout:

- `footer`: footer y contenido legal/institucional.
- `navigation`: navbar desktop, bottom nav mobile, categorias, links y chat nav link.

Sections:

- `Hero`, `LoggedInHero`, `HeroCarousel`, `CategoriesGrid`, skeletons.

UI base:

- `Button`
- `Card`
- `Badge`
- `Breadcrumb`
- `ConfirmDialog`
- `EmptyState`
- `FavoriteButton`
- `LazySection`
- `PageContainer`
- `ScrollToTop`
- `checkbox`
- `toaster`

Decision visible: hay un design system minimo y pragmatico. No intenta ser una libreria gigante; centraliza lo reutilizable y deja componentes de negocio dentro de cada feature.

## Carpetas del proyecto y que hacen

- `.github/workflows`: CI para Vitest y Playwright.
- `app`: rutas, layouts, loading/error/not-found y endpoints Next.
- `docs`: documentacion de producto, sistema de diseno y arquitectura.
- `e2e`: tests end-to-end con Playwright.
- `public`: imagenes, logos, assets de hero/login y SVGs.
- `src/features`: dominios de negocio.
- `src/lib`: infraestructura, tema, constantes, compresion y Supabase.
- `src/shared`: componentes y hooks compartidos entre features.
- `src/tests`: tests unitarios/action tests, mocks, factories y helpers.

## Testing actual

### Herramientas

- Vitest para unit tests y action tests.
- Testing Library para renderizar componentes con providers.
- jsdom como environment.
- Playwright para E2E.
- GitHub Actions corre primero unit/action tests y luego E2E.

Configs:

- `vitest.config.ts`: usa `jsdom`, `globals`, `src/tests/setup.ts`, alias `@`.
- `playwright.config.ts`: testDir `./e2e`, Chromium, retries en CI, screenshots en fallos, trace on first retry, webServer con `npm run dev`.
- `.github/workflows/ci.yml`: jobs separados para unit/action tests y e2e.

### Estado de verificacion local

Intentos realizados:

- `pnpm run test:run`: no termino dentro de 120 segundos.
- `pnpm exec vitest run --reporter=basic`: fallo con `fetch failed`.
- `.\node_modules\.bin\vitest.cmd run --reporter=basic`: fallo al cargar `vitest.config.ts` con `spawn EPERM` desde Vite/Rolldown.

Conclusion: en este entorno local los tests no llegaron a ejecutarse. Antes de medir cobertura real, hay que resolver el problema de ejecucion de Vitest en Windows/sandbox o confirmar que en CI Linux pasan correctamente.

## Carpetas y archivos de tests

### `src/tests`

Base de tests unitarios y de acciones.

Archivos:

- `setup.ts`: importa `@testing-library/jest-dom`.
- `constants/index.ts`: constantes compartidas para tests.

### `src/tests/actions`

Tests de Server Actions / acciones de aplicacion.

Archivos:

- `auth.actions.test.ts`
  - `loginAction`: email invalido, llamada correcta a Supabase, error de Supabase, redirect exitoso.
  - `registerAction`: password corta, regex, signUp correcto, email ya registrado, error generico, success.
  - `logoutAction`: signOut y redirect a login.

- `items.actions.test.ts`
  - `createItemAction`: error sin usuario, insercion y redirect.
  - `deleteItemAction`: error sin usuario, eliminacion y redirect, error del service.
  - `markAsSoldToAction`: error sin usuario, item inexistente, crea purchase y notificaciones.
  - `toggleFavoriteAction`: error sin usuario, agrega favorito si no existe.

- `notifications.actions.test.ts`
  - `createNotification`: inserta notificacion, loguea error si falla Supabase.
  - `getMyNotifications`: array vacio sin usuario, retorna notificaciones.
  - `getUnreadCount`: retorna count.
  - `markAllNotificationsRead`: update con filtros correctos.

- `reviews.actions.test.ts`
  - `submitReviewAction`: sin usuario, datos invalidos, compra inexistente, usuario no participante, success con notificacion, error por review duplicada.

### `src/tests/unit`

Tests unitarios puros.

Archivos:

- `auth.schemas.test.ts`
  - `loginSchema`
  - `loginServerSchema`
  - `registerSchema`
  - Cubre emails, password, regex y validacion de nombres.

- `item.schemas.test.ts`
  - `ItemSchema`
  - Cubre titulo, descripcion, precio, estado, imagenes y ciudad opcional.

- `review.schemas.test.ts`
  - `ReviewSchema`
  - Cubre rating, role, UUID, comentario y limites.

- `notifications.test.ts`
  - `getNotificationConfig`
  - Cubre labels/configs para tipos conocidos y tipo desconocido.

### `src/tests/factories`

Factories para datos de prueba.

Archivos:

- `item.factory.ts`
- `notification.factory.ts`
- `review.factory.ts`
- `user.factory.ts`

Decision buena: evita repetir objetos enormes en cada test y facilita variar campos.

### `src/tests/helpers`

Helpers de render y builders.

Archivos:

- `builders.ts`: builders de datos.
- `index.tsx`: `renderWithProviders`, monta `QueryClientProvider` y `ChakraProvider` con `system`.

Decision buena: los componentes se testean en un entorno parecido al real.

### `src/tests/mocks`

Mocks de dependencias externas.

Archivos:

- `next.ts`: mocks relacionados con Next.
- `supabase.ts`: `createSupabaseMock`, builder chainable para `select`, `insert`, `update`, `delete`, `eq`, `order`, `single`, storage y auth.

Decision buena: permite testear acciones sin tocar la DB real.

### `e2e`

Tests end-to-end con Playwright.

Archivos:

- `auth.spec.ts`
  - Login exitoso.
  - Login incorrecto muestra error.
  - Usuario no autenticado redirige a login.
  - Login persiste entre paginas.
  - Registro exitoso esta comentado.

- `items.spec.ts`
  - No autenticado no puede publicar.
  - Navega al formulario de publicar.
  - No avanza si el primer step tiene errores.
  - Avanza cuando campos son validos.
  - Completa parte del formulario correctamente y formatea precio.

- `chat.spec.ts`
  - No autenticado no accede al chat.
  - Navega al chat desde un item.
  - Ve bandeja de entrada.
  - Envia mensaje.

- `debug-login.spec.ts`
  - Test de debug para inspeccionar login.
  - Recomendacion: sacarlo de CI o marcarlo como herramienta local si no aporta cobertura estable.

- `example.spec.ts`
  - Tests default tipo plantilla.
  - Recomendacion: eliminar o reemplazar por smoke tests reales de Tratolibre.

- `helpers/auth.ts`
  - Login reutilizable.

- `helpers/items.ts`
  - Helper para llenar formulario de item.

## Que esta bien en los tests

- Hay cobertura real de validaciones criticas con Zod.
- Hay action tests para auth, items, notifications y reviews.
- Hay E2E de flujos principales: login, proteccion de rutas, publicar item y chat.
- Hay factories, builders y mocks: eso muestra intencion de mantener tests escalables.
- CI separa unit/action tests de E2E, lo cual ayuda a detectar rapido si falla logica o navegador.

## Problemas y deuda actual de testing

### 1. Falta cobertura de componentes

Aunque existe `renderWithProviders`, casi no hay tests de componentes. Faltan tests para:

- Formularios: `LoginForm`, `RegisterForm`, `NewItemForm`, `EditProfileForm`, `ReportModal`, `ReviewModal`.
- UI critica: `ItemCard`, `FavoriteButton`, `NotificationBell`, `ChatInput`, `ChatMessages`.
- Navegacion: `Navbar`, `BottomNav`, `CategoriesDrawer`.

Impacto: se puede romper UI o interaccion sin que Vitest lo detecte.

### 2. Falta cobertura de hooks

No se ven tests especificos para hooks:

- `useLogin`, `useRegister`, `useLogout`
- `useNewItemForm`, `useImageUpload`, `useInfiniteItems`
- `useChat`, `useSendMessage`, `useTypingIndicator`, `usePresence`
- `useNotifications`, `useNotificationsData`
- `useSearchFilters`, `useSearchResults`
- `useEditProfile`

Impacto: mucha logica de cliente queda validada solo indirectamente por E2E.

### 3. Falta cobertura fuerte en search

La feature `search` tiene filtros, sort, provincias, panel responsive y query params, pero no aparece cubierta por unit/action/e2e.

Urgente cubrir:

- Construccion de filtros.
- Parseo/sync con URL.
- Ordenamiento.
- Estado empty.
- Mobile drawer.
- Resultados con query, categoria, provincia y precio.

### 4. Falta cobertura de profile

`profile` tiene bastante logica y cero tests visibles.

Urgente cubrir:

- Query de perfil propio.
- Query de perfil publico.
- Update profile.
- Avatar.
- Stats.
- Tabs de items/reviews.
- Validacion de formulario.

### 5. Falta cobertura de reports/admin

Hay feature de reportes y admin, pero los tests actuales se concentran en notifications/reviews/items/auth.

Urgente cubrir:

- Crear reporte.
- Validacion de motivo.
- Modal de reporte.
- Listado admin de reportes.
- Filtros admin.
- Acciones admin: resolver, descartar, borrar contenido si aplica.

### 6. E2E depende de estado real

Playwright usa credenciales de test y Supabase real por env vars. Eso sirve para confianza, pero puede ser fragil si:

- El usuario de test cambia.
- La DB tiene datos inesperados.
- Hay rate limits.
- Los tests crean datos y no limpian.
- El chat necesita items/conversaciones preexistentes.

Mejora: crear seed controlado o API/helper de setup y cleanup por test.

### 7. Hay tests de debug/template en E2E

- `debug-login.spec.ts` parece herramienta temporal.
- `example.spec.ts` parece scaffold default.

Esto ensucia el objetivo de la suite. En CI conviene tener solo tests de producto.

### 8. No hay coverage configurado

No se ve script de coverage. Falta medir:

- Line coverage.
- Branch coverage.
- Coverage por feature.
- Umbrales minimos.

### 9. No hay tests de repositorios/mappers de Supabase

Hay muchos mappers y repositories en `src/lib/supabase`, pero no aparecen tests directos.

Urgente cubrir:

- Mappers de item, profile, conversation, message, notification, purchase, report, review.
- Repositories con mocks de Supabase.
- Manejo de errores normalizados.

### 10. Falta accesibilidad automatizada

No hay tests de accesibilidad. Para este producto importan:

- Formularios con labels.
- Modales con roles correctos.
- Navegacion por teclado.
- Botones con nombres accesibles.
- Estados de error anunciables.

## Prioridad urgente para mejorar tests

### Prioridad 1 - limpiar y estabilizar E2E

1. Eliminar o aislar `e2e/example.spec.ts`.
2. Convertir `e2e/debug-login.spec.ts` en herramienta local o sacarlo de CI.
3. Agregar seed/cleanup para items, chats y reviews.
4. Evitar `waitForTimeout` salvo casos inevitables; preferir asserts sobre UI/red.
5. Hacer que cada E2E cree o encuentre sus datos de forma deterministica.

### Prioridad 2 - cubrir features sin tests

1. `search`: unit tests de filtros + E2E de busqueda.
2. `profile`: action/service tests + componente de editar perfil.
3. `reports`: action tests + modal.
4. `admin`: filtros, acciones y permisos.
5. `chat`: mas unit tests de hooks/store, no depender solo de E2E.

### Prioridad 3 - componentes criticos

Agregar tests con Testing Library para:

- `LoginForm`
- `RegisterForm`
- `NewItemForm`
- `ItemCard`
- `FavoriteButton`
- `NotificationBell`
- `ReportModal`
- `ReviewModal`
- `ChatInput`
- `SearchFilterBar`

### Prioridad 4 - infraestructura y mappers

Agregar unit tests para:

- `src/lib/supabase/mappers/*`
- `src/lib/supabase/repositories/*`
- servicios de error mapping como `item-error.mapper.ts`
- `rate-limiter`
- auth helpers

### Prioridad 5 - coverage y calidad CI

Agregar scripts:

```json
{
  "test:coverage": "vitest run --coverage",
  "test:watch": "vitest",
  "test:e2e:headed": "playwright test --headed"
}
```

Y considerar thresholds iniciales realistas:

- 60% global al principio.
- 80% en schemas, mappers y services.
- 70% en actions.

## Plan recomendado de trabajo

1. Semana 1: limpiar E2E y agregar seed/cleanup.
2. Semana 1: tests unitarios de `search` y `profile`.
3. Semana 2: tests de componentes criticos de forms.
4. Semana 2: tests de reports/admin.
5. Semana 3: mappers/repositories y coverage.
6. Semana 3: accesibilidad basica en forms y modales.

## Resumen ejecutivo

Tratolibre tiene una arquitectura bastante bien pensada: rutas limpias en `app`, dominios separados en `src/features`, infraestructura Supabase encapsulada en `src/lib`, UI compartida en `src/shared` y design system con tokens reales en Chakra.

El testing ya tiene una base buena, especialmente en schemas, actions y E2E principales. Lo urgente no es empezar de cero, sino profesionalizar la suite: limpiar tests temporales, hacer E2E deterministico, cubrir features sin tests (`search`, `profile`, `reports`, `admin`) y empezar a testear componentes/hooks criticos.
