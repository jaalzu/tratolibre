'use client'

import { useState, useEffect } from 'react'
import { Flex, Text, Input, Field } from '@chakra-ui/react'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { ItemInput } from '@/features/items/schemas'
import { FormSelect } from './FormSelect'

interface Province     { id: string; nombre: string }
interface Municipality { id: string; nombre: string }

interface LocationSelectorProps {
  errors?: {
    province?: { message?: string }
    city?:     { message?: string }
    location?: { message?: string }
  }
  register: UseFormRegister<ItemInput>
  setValue: UseFormSetValue<ItemInput>
}

const inputStyles = {
  borderColor: 'neutral.500',
  borderRadius: 'lg',
  h: '44px',
  px: '3',
  _focus: { borderColor: 'brand.default', boxShadow: 'none' },
}

export const LocationSelector = ({ errors, register, setValue }: LocationSelectorProps) => {
  const [provinces,        setProvinces]        = useState<Province[]>([])
  const [municipalities,   setMunicipalities]   = useState<Municipality[]>([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity,     setSelectedCity]     = useState('')

  useEffect(() => {
    fetch('https://apis.datos.gob.ar/georef/api/provincias?orden=nombre&campos=id,nombre&max=100')
      .then(r => r.json())
      .then(d => setProvinces(d.provincias ?? []))
  }, [])

  useEffect(() => {
    if (!selectedProvince) { setMunicipalities([]); return }
    fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${selectedProvince}&orden=nombre&campos=id,nombre&max=200`)
      .then(r => r.json())
      .then(d => setMunicipalities(d.municipios ?? []))
  }, [selectedProvince])

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedCity('')
    setValue('province', value)
    setValue('city', '')
  }

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
    setValue('city', value)
  }

  return (
    <Flex direction="column" gap={3}>
      <Text fontSize="sm" fontWeight="bold" color="neutral.700">Ubicación</Text>

      {/* Provincia + Ciudad + Barrio en una fila en desktop */}
      <Flex gap={3} direction={{ base: 'column', md: 'row' }}>

        <Field.Root invalid={!!errors?.province} w={{ base: 'full', md: '30%' }} flexShrink={0}>
          <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">Provincia *</Field.Label>
          <FormSelect
            value={selectedProvince}
            onChange={handleProvinceChange}
            options={provinces.map(p => ({ id: p.nombre, label: p.nombre }))}
            placeholder="Provincia..."
            invalid={!!errors?.province}
          />
          {errors?.province && <Field.ErrorText fontSize="xs">{errors.province.message}</Field.ErrorText>}
        </Field.Root>

        <Field.Root w={{ base: 'full', md: '30%' }} flexShrink={0}>
          <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">
            Ciudad <Text as="span" color="neutral.400">(opcional)</Text>
          </Field.Label>
          <FormSelect
            value={selectedCity}
            disabled={!selectedProvince}
            onChange={handleCityChange}
            options={municipalities.map(m => ({ id: m.nombre, label: m.nombre }))}
            placeholder={selectedProvince ? 'Ciudad...' : 'Primero provincia'}
          />
        </Field.Root>

        <Field.Root flex={1}>
          <Field.Label fontSize="xs" fontWeight="medium" color="neutral.700">
            Barrio / Zona <Text as="span" color="neutral.400">(opcional)</Text>
          </Field.Label>
          <Input
            {...register('location')}
            placeholder="Ej: Palermo, Centro..."
            {...inputStyles}
          />
        </Field.Root>

      </Flex>
    </Flex>
  )
}