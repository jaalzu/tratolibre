'use client'

import { chakra, HTMLChakraProps } from '@chakra-ui/react'

export interface CardProps extends HTMLChakraProps<'div'> {
  asChild?: boolean
}

const StyledCard = chakra('div', {
  base: {
    bg: 'white',
    borderWidth: '1px',
    borderColor: 'neutral.100',
    borderRadius: 'lg',
    boxShadow: 'base',
    p: '5',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
})

export function Card({ children, ...props }: CardProps) {
  return (
    <StyledCard {...props}>
      {children}
    </StyledCard>
  )
}