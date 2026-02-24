import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
 brand: {
  50:      { value: '#f0fdf4' }, // muy clarito
  100:     { value: '#dcfce7' }, // clarito
  default: { value: '#22c55e' }, // main
  hover:   { value: '#16a34a' }, // más oscuro
  dark:    { value: '#15803d' }, // muy oscuro
},
 secondary: {
  50:      { value: '#fffbeb' },
  100:     { value: '#fef3c7' },
  default: { value: '#f59e0b' },
  hover:   { value: '#d97706' },
  dark:    { value: '#b45309' },
},
accent: {
  50:      { value: '#eff6ff' },
  100:     { value: '#dbeafe' },
  default: { value: '#3483fa' },
  hover:   { value: '#2563eb' },
  dark:    { value: '#1d4ed8' },
},
  neutral: {
    50:  { value: '#ffffff' },
    100: { value: '#e0e0e0' },
    200: { value: '#c6c5c5' },
    300: { value: '#ada9a9' },
    400: { value: '#958e8e' },
    500: { value: '#7c7272' },
    600: { value: '#615858' },
    700: { value: '#463f3f' },
    800: { value: '#2b2626' },
    900: { value: '#0f0d0d' },
  },
  feedback: {
    success: { value: '#16a34a' },
    warning: { value: '#d00416' },
    error:   { value: '#d00416' },
    info:    { value: '#ffe100' },
  },
},
      fonts: {
        heading: { value: 'var(--font-geist-sans), system-ui, sans-serif' },
        body:    { value: 'var(--font-geist-sans), system-ui, sans-serif' },
      },
      fontSizes: {
        xs:  { value: '0.75rem' },
        sm:  { value: '0.875rem' },
        md:  { value: '1rem' },
        lg:  { value: '1.25rem' },
        xl:  { value: '1.5rem' },
        '2xl': { value: '1.875rem' },
        '3xl': { value: '2.25rem' },
      },
      fontWeights: {
        normal: { value: 400 },
        bold:   { value: 600 },
      },
      spacing: {
        1:  { value: '4px' },
        2:  { value: '8px' },
        3:  { value: '12px' },
        4:  { value: '16px' },
        6:  { value: '24px' },
        8:  { value: '32px' },
        12: { value: '48px' },
        16: { value: '64px' },
        24: { value: '96px' },
      },
      radii: {
        sm: { value: '2px' },
        md: { value: '4px' },
        lg: { value: '6px' },
      },
      shadows: {
        base:  { value: '0 1px 2px 0 rgba(0, 0, 0, 0.12)' },
        focus: { value: '0 0 0 2px rgba(34, 197, 94, 0.35)' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)