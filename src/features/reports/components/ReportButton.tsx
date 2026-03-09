// features/reports/components/ReportButton.tsx
'use client'

import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { ReportModal } from './ReportModal'

interface ReportButtonProps {
  type: 'item' | 'conversation' | 'user'
  targetId: string
  label?: string
}

export function ReportButton({ type, targetId,label = 'Reportar' }: ReportButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Box
        as="button"
        fontSize="sm"
        color="neutral.700"
        textDecoration="underline"
        cursor="pointer"
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