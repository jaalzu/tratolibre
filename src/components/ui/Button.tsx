'use client'

import { chakra, HTMLChakraProps, RecipeProps } from '@chakra-ui/react'

// Definimos explícitamente qué variantes aceptamos para que no herede las de Chakra
export interface ButtonProps extends HTMLChakraProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber' | 'blue'
  size?: 'sm' | 'md' | 'lg'
  width?: 'full'
  loading?: boolean
  asChild?: boolean
}

const StyledButton = chakra('button', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    borderRadius: 'md',
    transition: 'all 0.2s',
    cursor: 'pointer',
    gap: '2',
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
    primary: {
      bg: 'brand.default',
      color: 'white',
      _hover: { bg: 'brand.hover' },
    },
    secondary: {
     border: '1.5px solid',
  borderColor: 'neutral.900',
  color: 'neutral.900',
  bg: 'transparent',
  _hover: { bg: 'neutral.50' },
    },
    ghost: {
      color: 'neutral.700',
      _hover: { bg: 'neutral.50' },
    },
    amber: {
      bg: 'secondary.default',
      color: 'white',
      _hover: { bg: 'secondary.hover' },
    },
    blue: {
      bg: 'accent.default',
      color: 'white',
      _hover: { bg: 'accent.hover' },
    },
    },
    size: {
      sm: { px: 3, py: 2, fontSize: 'sm' },
      md: { px: 4, py: 3, fontSize: 'md' },
      lg: { px: 6, py: 4, fontSize: 'lg' },
    },
    width: {
      full: { w: 'full' },
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export function Button({ loading, children, disabled, ...props }: ButtonProps) {
  return (
    <StyledButton disabled={loading || disabled} {...props}>
      {loading ? 'Cargando...' : children}
    </StyledButton>
  )
}