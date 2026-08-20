# TRATOLIBRE DESIGN SYSTEM (Figma Ready)

## 1. Tokens Base
- **Brand**: Primary `#22c55e`, Secondary `#f59e0b`, Accent `#3483fa`
- **Neutral**: `50` `#fafafa` to `900` `#0f0d0d`
- **Feedback**: Success `#16a34a`, Error/Warning `#d00416`, Info `#ffe100`
- **Typography**: Geist (`400`, `600`). H1: 36px, H2: 30px, H3: 24px, H4: 20px, Body: 16px, Small: 14px, Caption: 12px
- **Spacing**: Base 4px. Micro: 4/8, UI: 12/16, Section: 24/32, Layout: 48/64, Macro: 96
- **Radius**: sm: 2px, md: 4px, lg: 6px
- **Shadow**: sm `0 1px 2px rgba(0,0,0,0.12)`, md `0 2px 3px rgba(0,0,0,0.12)`, Focus `0 0 0 2px rgba(34,197,94,0.35)`

## 2. Componentes & Variantes
- **Button**: 
  - *Variants*: primary, secondary, accent, ghost, danger, link
  - *States*: default, hover, active, disabled, loading (with spinner)
- **Input**: 
  - *Types*: text, email, password, number, date, select, textarea, search
  - *States*: default, focus, error, disabled, success
- **Card**: 
  - *Variants*: standard, featured, ItemCard (Photo, Title, Price, City, Rating), ProfileCard, ReviewCard
- **Badge / Chip**: 
  - *Variants*: status (reservation states), category, tag
- **Navigation**: 
  - *Variants*: Navbar (Desktop), BottomNav (Mobile), Sidebar (Dashboard)
- **Feedback**: 
  - *Components*: Toast (success, error, warning, info), StatusBadge, Loader (Spinner, Skeletons)
- **Overlays**: 
  - *Modals*: confirm, info, form, fullscreen (mobile)

## 3. Arquitectura (Figma Pages)
1. `01. Foundations` (Colors, Typography, Spacing, Shadows)
2. `02. Atoms` (Button, Input, Badge, Avatar, Divider)
3. `03. Molecules & Core` (ItemCard, Navbar, ChatWindow, ImageUpload)
4. `04. Organisms & Patterns` (ReservationForm, ReviewForm, Modals, Toasts)
5. `05. Templates / Pages` (Landing, Explore, Item Detail, Dashboard)

## 4. Breakpoints (Responsive)
- Mobile: `0 - 639px` | Tablet: `640 - 1023px` | Laptop: `1024 - 1279px` | Desktop: `1280px+`