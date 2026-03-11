// features/reports/components/ReportButton.tsx
'use client'

import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { ReportModal } from './ReportModal'

interface ReportButtonProps {
  type: 'item' | 'conversation' | 'user'
  targetId: string
  label?: string
  color?: string
}

export function ReportButton({ type, targetId,label = 'Reportar' ,color = 'neutral.700'}: ReportButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Box
        as="button"
        fontSize="sm"
        textDecoration="underline"
        cursor="pointer"
        color={color}
        onClick={() => setOpen(true)}
        _hover={{ color: 'red.500' }}
        transition="color 0.2s"
      >
        {label}
      </Box>

      <ReportModal
        open={open}
        onClose={() => setOpen(false)}
        type={type}
        targetId={targetId}
      />
    </>
  )
}