import { z } from 'zod'

const BLOCKED_WORDS = [
  // roles de autoridad
  'admin', 'soporte', 'moderador', 'oficial', 'staff',
  'tratolibre', 'root', 'superuser', 'bot', 'sistema',
  // insultos argentinos comunes
  'pelotudo', 'boludo', 'forro', 'hijo de puta', 'hdp',
  'puta', 'concha', 'chota', 'pija', 'culo', 'cagar',
  'cagon', 'cagón', 'ortiva', 'mogolico', 'mogólico',
  'tarado', 'idiota', 'estupido', 'estúpido', 'imbecil',
  'imbécil', 'garca', 'cretino', 'cretino', 'mierda',
  'gil', 'nabo', 'sorete', 'salame', 'otario', 'cornudo',
  'trucho', 'chorro', 'negro', 'puto', 'trolo', 'marica','trolo','gay'
]

export const nameSchema = z.string()
  .min(2,  'Mínimo 2 caracteres')
  .max(30, 'Máximo 30 caracteres')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'Solo se permiten letras y espacios')
  .refine(val => !BLOCKED_WORDS.some(w => val.toLowerCase().includes(w)), 'Ese nombre no está permitido')
  .refine(val => val.trim().split(/\s+/).length <= 4, 'El nombre no puede tener más de 4 palabras')
  .transform(val => val.trim().replace(/\s+/g, ' '))