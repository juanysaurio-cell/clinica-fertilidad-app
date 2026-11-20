import { z } from 'zod';

export const itemSchema = z.object({
  title: z
    .string({ error: 'El nombre del tratamiento es obligatorio' })
    .trim()
    .min(3, 'El nombre del tratamiento debe tener al menos 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  category: z
    .string({ error: 'La categoría clínica es obligatoria' })
    .trim()
    .min(2, 'La categoría clínica es obligatoria'),
  durationWeeks: z.coerce
    .number({ error: 'Ingresa un número válido de semanas' })
    .int('La duración debe ser un número entero')
    .min(1, 'La duración mínima es de 1 semana')
    .max(52, 'La duración máxima es de 52 semanas'),
  description: z
    .string({ error: 'La descripción general es obligatoria' })
    .trim()
    .min(8, 'La descripción general debe tener al menos 8 caracteres'),
  detailedDescription: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
});

export type ItemFormInput = z.input<typeof itemSchema>;
export type ItemFormData = z.output<typeof itemSchema>;