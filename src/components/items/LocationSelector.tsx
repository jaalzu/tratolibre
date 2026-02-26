'use client'

import { useState, useEffect } from 'react'
import { Flex, Text, NativeSelect, Input, Field } from '@chakra-ui/react'

interface Province {
  id: string
  nombre: string
}

interface Municipality {
  id: string
  nombre: string
}

interface LocationSelectorProps {
  errors?: {
    province?: { message?: string }
    city?: { message?: string }
    location?: { message?: string }
  }
  register: any
  setValue: any
}

export const LocationSelector = ({ errors, register, setValue }: LocationSelectorProps) => {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [selectedProvince, setSelectedProvince] = useState('')

  const inputStyles = {
    borderColor: 'neutral.500',
    borderRadius: 'lg',
    h: '44px',
    px: '3',
    _focus: { borderColor: 'brand.default', boxShadow: 'none' },
  }

  useEffect(() => {
    fetch('https://apis.datos.gob.ar/georef/api/provincias?orden=nombre&campos=id,nombre&max=100')
      .then(r => r.json())
      .then(d => setProvinces(d.provincias ?? []))
  }, [])

  useEffect(() => {
    if (!selectedProvince) {
      setMunicipalities([])
      return
    }
    fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${selectedProvince}&orden=nombre&campos=id,nombre&max=200`)
      .then(r => r.json())
      .then(d => setMunicipalities(d.municipios ?? []))
  }, [selectedProvince])

  return (
    <Flex direction="column" gap={3}>
      <Text fontSize="sm" fontWeight="bold" color="neutral.700">Ubicación</Text>

      <Flex gap={3} direction={{ base: 'column', md: 'row' }}>
        {/* Provincia */}
        <Field.Root invalid={!!errors?.province} flex={1}>
          <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Provincia *</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...register('province')}
              {...inputStyles}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setValue('province', e.target.value)
                setValue('city', '')
                setSelectedProvince(e.target.value)
              }}
            >
              <option value="">Elegí una provincia...</option>
              {provinces.map(p => (
                <option key={p.id} value={p.nombre}>{p.nombre}</option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
          {errors?.province && <Field.ErrorText fontSize="xs">{errors.province.message}</Field.ErrorText>}
        </Field.Root>

        {/* Ciudad */}
        <Field.Root flex={1}>
          <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Ciudad <Text as="span" color="neutral.400">(opcional)</Text></Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...register('city')}
              {...inputStyles}
              disabled={!selectedProvince}
            >
              <option value="">{selectedProvince ? 'Elegí una ciudad...' : 'Primero elegí provincia'}</option>
              {municipalities.map(m => (
                <option key={m.id} value={m.nombre}>{m.nombre}</option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Field.Root>
      </Flex>

      {/* Barrio/Zona */}
      <Field.Root>
        <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Barrio / Zona <Text as="span" color="neutral.400">(opcional)</Text></Field.Label>
        <Input
          {...register('location')}
          placeholder="Ej: Palermo, Centro, Villa Urquiza..."
          {...inputStyles}
        />
      </Field.Root>
    </Flex>
  )
}