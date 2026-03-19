# UI / UX Design System – MVP Rental Platform (Chakra Edition)

> Documento único de referencia para construir el MVP sin caos, sin sobre-arquitectura y sin deuda visual.
> Enfoque: **simple → consistente → escalable**.

---

Fundations → sistema mínimo → componentes → layouts → UX → responsive → páginas → orden de construcción

# 0. Principio rector

> Primero funciona → después se ordena → después se escala → después se perfecciona.

Nada se implementa si no aporta valor real al producto.

---

# 1. Foundations (Base mínima del sistema)

## 🎨 Colores

### Brand

- Primary : #22c55e (color hover/green lighther: #60e491)
- Secondary: #f59e0b (color hover/lighther: #face85)
- Accent #3483fa (color hover/light #448dfc)

### Neutrales

- #fafafa → #e0e0e0 → #c6c5c5 → #ada9a9 → #958e8e → #7c7272 → #615858 → #463f3f → #2b2626 → #0f0d0d

### Semánticos

- Success : #16a34a
- Warning : #d00416
- Error : #d00416
- Info : #ffe100

### Estados

- Hover : depende el color uqe este pero siempre es el mismo color mas light
- Active : no se.
- Disabled : el mismo color pero apagado?
- Focus : same color mas brillante

---

## 🔤 Tipografía

### Fuente base

- Primary font: Geist
- Fallback stack: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Escala tipográfica

H1: 2.25rem (36px) → títulos principales / hero
H2: 1.875rem (30px) → secciones
H3: 1.5rem (24px) → cards / headers
H4: 1.25rem (20px) → subtítulos
Body: 1rem (16px) → texto base
Small: 0.875rem (14px) → labels, meta
Caption: 0.75rem (12px) → hints, ayudas

### Pesos

- Regular: 400
- Bold: 600

---

## 📏 Espaciado

Escala base:

Base unit: 4px

- Micro spacing: 4 / 8
- UI spacing: 12 / 16
- Section spacing: 24 / 32
- Layout spacing: 48 / 64
- Macro spacing: 96

---

## 🧱 Bordes

Radius:

- sm: 2px → inputs, badges, tags
- md: 4px → botones, cards pequeñas
- lg: 6px → cards, modals, containers

Border width:

- base: 1px → UI normal
- strong: 2px → foco, estados, énfasis

---

## 🌫️ Sombras

- Base shadow (cards, containers):
  0 1px 2px 0 rgba(0, 0, 0, 0.12)

- Focus shadow (interactive):
  0 0 0 2px rgba(34, 197, 94, 0.35) // usando tu primary #22c55e

---

## 🎯 Iconografía

Iconography system:

- Style: stroke
- Weight: 2px
- Sizes: 16 / 20 / 24 / 40
- Color: currentColor
- Library: boxicons

---

stripe

# 2. Sistema mínimo real (MVP)

> Solo lo necesario para no generar caos.

<!-- esto ya viene hecho con charka  -->

Componentes base reales:

- Button done
- Card done
- Container done
- Input done
- Badge listo

Estos son los únicos componentes base obligatorios del sistema.

---

# 3. Core Components (Semánticos del producto)

<!-- esto si tengo q diseñar yo  -->

> Estos ya representan dominio del negocio, no UI genérica.

- Navbar . Finalizado!
- ItemCard Done!
- ChatWindow listo
- ReviewForm
- StatusBadge listo
- ImageUpload listo

---

# 4. Layout Components

<!-- esto es una mezcla de core y lo q yo cree , quizas algunas cosas si tengo q hacerlas como el navbar o bottom bar  -->

- Navbar (desktop) done
- Bottom bar (mobile) done
- Sidebar (dashboard) listo
- Footer
- Containers
- Grids

---

# 5. UX Patterns

## Forms

- Inline validation → al escribir, mostrar errores o feedback sin tener que enviar el formulario.
- Error messages → usar Text con color feedback.error.
- Helper text → tips debajo del input (Text color neutro o secundario).
- Success feedback → feedback.success al completar correctamente.

## Loading States

- Global loading
- Section loading
- Button loading

## Empty States

- Sin objetos
- Sin mensajes
- Sin reservas
- Sin resultados

## Error States

- 404
- 500
- Network error

## Confirmations

- Destructive action modal
- Soft confirmation

---

# 6. Responsive System

## Breakpoints

- mobile: 0px – 639px
- tablet: 640px – 1023px
- laptop: 1024px – 1279px
- desktop: 1280px – 1535px
- large: 1536px +

## Mobile UX

- Bottom navigation
- Fullscreen modals

---

# 7. Accessibility

1. Colores y contraste
   Todos los textos y elementos interactivos cumplen ratio mínimo 4.5:1 contra fondo.
   Tokens de color (primary, secondary, accent, neutral) usados consistentemente.
   Feedback states (success, error, warning) contrastan suficiente.

2. Focus states
   Todos los botones, inputs, selects, links muestran focus visible (outline o ring).
   Focus sigue el flujo lógico de navegación (tab index correcto).
   Modales y dropdowns manejan focus trap para no perder el teclado.

3. Keyboard navigation
   Todos los botones y links son accesibles con Tab y activables con Enter o Space.
   Sidebars, navbars, tabs y grids permiten navegación completa sin mouse.
   Inputs y forms se pueden llenar y enviar solo con teclado.

4. ARIA roles y atributos
   Modales → role="dialog", aria-modal="true", título con aria-labelledby.
   Tabs → roles tablist, tab, tabpanel.
   Inputs → aria-label o <FormLabel> asociado correctamente.
   Status badges → aria-live si cambian dinámicamente (por ejemplo, reserva pendiente).

5. Screen readers
   Estructura de headings correcta (<h1>…<h2>…) para jerarquía.
   Imágenes y avatars → alt descriptivo o aria-hidden si decorativo.
   Elementos interactivos claros y semánticos (<button> vs <div>).

---

# 8. Naming System

- Component naming:
  Navbar → Barra de navegación principal (desktop)
  BottomNav → Barra inferior (mobile)
  ItemCard → Card con información de objeto
  ReservationForm → Formulario de reserva
  ChatWindow → Ventana de chat
  ReviewForm → Formulario de reseña
  StatusBadge → Badge de estado de reserva
  ImageUpload → Componente drag & drop de imágenes
  Button → Botones generales
  Input → Inputs de texto, email, password, number, date, select, textarea, search
  Card → ItemCard, ProfileCard, ReviewCard, InfoCard
  Badge / Chip → StatusBadge, CategoryBadge, TagChip
  Avatar → User avatar, Placeholder avatar, Group avatar
  Modal → Confirm modal, Info modal, Form modal, Fullscreen modal (mobile)
  Toast / Notification → Success, Error, Warning, Info
  Dropdown → Menu, Action dropdown, Select dropdown
  Tabs → Horizontal, Vertical
  Toggle → Switch, Checkbox, Radio
  Loader → Spinner, Skeleton card, Skeleton list, Skeleton form
  Pagination → Infinite scroll, Page buttons
  Breadcrumb → Hierarchical navigation
  Divider → Section divider, Content divider

- Variant naming
  Button:

* primary → bg: #22c55e / hover: #60e491 / color: white
* secondary → bg: #f59e0b / hover: #face85 / color: white
* accent → bg: #3483fa / hover: #448dfc / color: white
* ghost → bg: transparent / border: 1px solid currentColor / hover: bg-gray.50
* danger → bg: #d00416 / hover: #e94c4c / color: white
* link → bg: transparent / color: #3483fa / hover: underline

Card:

- standard → información básica
- featured → destacado / hero

Badge / Chip:

- status → colores según estado de reserva
- category → por categoría
- tag → general / etiqueta

Modal:

- confirm → confirmación destructiva
- info → mensaje informativo
- form → formulario
- fullscreen → mobile, ocupa toda la pantalla

* State naming
  Button:

- default
- hover
- active
- disabled
- loading

Input:

- default
- focus
- error
- disabled
- success

Card:

- default
- hover
- selected / active

Modal:

- open
- close
- loading

Dropdown / Tabs / Toggle:

- default
- active
- disabled
- focus

Toast / Notification:

- success
- error
- warning
- info

---

# 9. Design Tokens

Tokens base:

- colors.\*
  colors = {
  brand: {
  primary: "#22c55e",
  secondary: "#f59e0b",
  accent: "#3483fa",
  },
  neutral: {
  50: "#fafafa",
  100: "#e0e0e0",
  200: "#c6c5c5",
  300: "#ada9a9",
  400: "#958e8e",
  500: "#7c7272",
  600: "#615858",
  700: "#463f3f",
  800: "#2b2626",
  900: "#0f0d0d",
  },
  feedback: {
  success: "#16a34a",
  warning: "#d00416",
  error: "#d00416",
  info: "#ffe100",
  },
  };

- spacing.\*
  spacing = {
  micro: 4,
  small: 8,
  ui: 12,
  base: 16,
  section: 24,
  layout: 32,
  large: 48,
  xlarge: 64,
  macro: 96,
  };

- radius.\*
  radius = {
  sm: 2,
  md: 4,
  lg: 6,
  xl: 6,
  };

- font.\*
  font = {
  family: "Geist, sans-serif",
  weights: {
  regular: 400,
  bold: 700,
  },
  sizes: {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  small: 14,
  caption: 12,
  },
  };

- shadow.\*
  shadow = {
  sm: "0 1px 2px 0 rgba(0,0,0,0.12)", // para cards pequeñas
  md: "0 2px 3px 0 rgba(0,0,0,0.12)", // para cards más grandes o secciones
  };

- z-index.\*
  zIndex = {
  dropdown: 1000,
  modal: 1100,
  overlay: 1200,
  toast: 1300,
  };

---

# 10. Arquitectura de la App

## Páginas

- / — Landing (hero + categorías + últimos objetos)
- /register — Registro
- /login — Login
- /explore — Búsqueda con filtros + grid de objetos
- /Item/new — Formulario publicar objeto
- /Item/[id] — Detalle del objeto + ReservationForm
- /dashboard — Home con stats
- /dashboard/Items — Mis objetos
- /dashboard/reservations — Reservas como owner y renter
- /dashboard/messages — Lista de chats

---

# 11. Componentes custom a diseñar

## Navbar

- Estado de autenticación
- Navegación principal
- Responsive

## ItemCard

- Foto
- Título
- Precio
- Ciudad
- Rating

## ReservationForm

- Fechas
- Precio calculado
- Mensaje

## ChatWindow

- Burbuja de mensajes
- Input
- Estados

## ReviewForm

- Estrellas
- Comentario

## StatusBadge

- Colores por estado de reserva

## ImageUpload

- Drag & drop
- Preview
- Validación

---

# 12. Orden de construcción real

1. Foundations (theme)
2. Componentes base (Button, Card, Container, Input, Badge)
3. Navbar
4. ItemCard
5. ReservationForm
6. Pages principales
7. Dashboard
8. UX patterns
9. Responsive refinado
10. Accesibilidad

---

# 13. Regla madre

> Si un componente no se puede reutilizar, no es un componente. Es una excepción.

---

# Filosofía

- Simple
- Predecible
- Consistente
- Modular
- Escalable
- Accesible
- Mobile-first
- Product-first

---

Este documento no es teórico: es un mapa de construcción.
Se completa mientras se desarrolla la app.
No se fuerza: se deja crecer.
