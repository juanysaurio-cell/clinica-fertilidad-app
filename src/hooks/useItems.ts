import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import {
  FertilityService,
  CreateItemPayload,
  UpdateItemPayload,
} from '../types';

export const SERVICES_QUERY_KEY = ['fertility-services'];

interface RawServiceItem {
  id: string | number;
  title?: string;
  category?: string;
  description?: string;
  detailedDescription?: string;
  durationWeeks?: number;
  imageUrl?: string;
  isCustomCreated?: boolean;
}

const SPANISH_TREATMENTS: Array<Omit<FertilityService, 'id'>> = [
  {
    title: 'Fecundación In Vitro (FIV)',
    category: 'Alta Complejidad',
    description:
      'Fertilización de óvulos con espermatozoides en laboratorio y transferencia embrionaria.',
    detailedDescription:
      'Incluye estimulación ovárica controlada, punción folicular, cultivo embrionario en laboratorio de embriología y transferencia al útero bajo guía ecográfica.',
    durationWeeks: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Inseminación Artificial Intrauterina',
    category: 'Baja Complejidad',
    description:
      'Capacitación espermática y colocación directa en la cavidad uterina en el momento de la ovulación.',
    detailedDescription:
      'Procedimiento ambulatorio de corta duración, indicado en casos de factor cervical leve, infertilidad de origen desconocido o pareja del mismo sexo/donante.',
    durationWeeks: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Vitrificación de Óvulos',
    category: 'Preservación de Fertilidad',
    description:
      'Criopreservación ultrarrápida de ovocitos para posponer la maternidad con alta tasa de supervivencia.',
    detailedDescription:
      'Permite conservar la calidad ovocitaria futura mediante vitrificación en nitrógeno líquido tras un ciclo de estimulación y recuperación ovocitaria.',
    durationWeeks: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Diagnóstico Genético Preimplantacional (PGT)',
    category: 'Genética Reproductiva',
    description:
      'Evaluación cromosómica y genética de embriones antes de su transferencia uterina.',
    detailedDescription:
      'Biopsia embrionaria en estadio de blastocisto para seleccionar embriones euploides y reducir el riesgo de aborto espontáneo o enfermedades hereditarias.',
    durationWeeks: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Estimulación Ovárica Controlada',
    category: 'Inducción y Seguimiento',
    description:
      'Tratamiento hormonal monitoreado por ecografía para madurar folículos ováricos.',
    detailedDescription:
      'Ajuste progresivo de medicación con controles ecográficos seriados y perfil hormonal para optimizar la respuesta ovárica de forma segura.',
    durationWeeks: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Ovodonación',
    category: 'Reproducción Asistida',
    description:
      'Tratamiento de fertilidad utilizando óvulos de donante evaluada médica y genéticamente.',
    detailedDescription:
      'Preparación endometrial sincronizada con embriones fecundados en laboratorio y transferencia embrionaria bajo protocolo clínico especializado.',
    durationWeeks: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Evaluación Integral de Reserva Ovárica',
    category: 'Diagnóstico',
    description:
      'Estudio clínico, ecográfico y hormonal (AMH y recuento folicular) para conocer la fertilidad actual.',
    detailedDescription:
      'Consulta médica especializada, análisis de hormona antimülleriana y ecografía transvaginal para definir un plan reproductivo personalizado.',
    durationWeeks: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Seminograma y Capacitación Espermática',
    category: 'Fertilidad Masculina',
    description:
      'Análisis detallado de concentración, movilidad y morfología espermática.',
    detailedDescription:
      'Evaluación andrológica completa con informe de laboratorio y pruebas complementarias según criterio médico para orientar el tratamiento.',
    durationWeeks: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
  },
];

const mapToService = (raw: RawServiceItem, index = 0): FertilityService => {
  const numericId = Number(raw.id);
  const templateIndex =
    Number.isFinite(numericId) && numericId > 0
      ? (numericId - 1) % SPANISH_TREATMENTS.length
      : index % SPANISH_TREATMENTS.length;

  const fallback = SPANISH_TREATMENTS[templateIndex];

  if (raw.isCustomCreated || String(raw.id).startsWith('custom-')) {
    return {
      id: String(raw.id),
      title: raw.title || fallback.title,
      category: raw.category || fallback.category,
      description: raw.description || fallback.description,
      detailedDescription:
        raw.detailedDescription || raw.description || fallback.detailedDescription,
      durationWeeks: Number(raw.durationWeeks) || fallback.durationWeeks,
      imageUrl: raw.imageUrl || fallback.imageUrl,
    };
  }

  return {
    id: String(raw.id),
    title: fallback.title,
    category: raw.category || fallback.category,
    description: fallback.description,
    detailedDescription: fallback.detailedDescription,
    durationWeeks: Number(raw.durationWeeks) || fallback.durationWeeks,
    imageUrl: raw.imageUrl || fallback.imageUrl,
  };
};

export function useItems() {
  return useQuery<FertilityService[], Error>({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await api.get<RawServiceItem[]>('/posts?_limit=8');
      return data.map((item, idx) => mapToService(item, idx));
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useItemById(id: string) {
  const queryClient = useQueryClient();
  const isCustom = String(id).startsWith('custom-');

  return useQuery<FertilityService, Error>({
    queryKey: [...SERVICES_QUERY_KEY, id],
    queryFn: async () => {
      const cachedList =
        queryClient.getQueryData<FertilityService[]>(SERVICES_QUERY_KEY) ?? [];
      const localMatch = cachedList.find((item) => String(item.id) === String(id));
      if (localMatch) return localMatch;

      const { data } = await api.get<RawServiceItem>(`/posts/${id}`);
      return mapToService(data);
    },
    enabled: Boolean(id) && !isCustom,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation<FertilityService, Error, CreateItemPayload>({
    mutationFn: async (newService) => {
      await api.post('/posts', {
        title: newService.title,
        body: newService.description,
        category: newService.category,
        durationWeeks: newService.durationWeeks,
      });

      return {
        id: `custom-${Date.now()}`,
        title: newService.title,
        category: newService.category,
        description: newService.description,
        detailedDescription: newService.detailedDescription,
        durationWeeks: newService.durationWeeks,
        imageUrl:
          newService.imageUrl ??
          'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
      };
    },
    onSuccess: (createdItem) => {
      queryClient.setQueryData<FertilityService[]>(
        SERVICES_QUERY_KEY,
        (oldData = []) => [createdItem, ...oldData]
      );
      queryClient.setQueryData<FertilityService>(
        [...SERVICES_QUERY_KEY, createdItem.id],
        createdItem
      );
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation<
    FertilityService,
    Error,
    { id: string; payload: UpdateItemPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const numericId = Number(id);
      if (
        !String(id).startsWith('custom-') &&
        Number.isFinite(numericId) &&
        numericId > 0
      ) {
        await api.put(`/posts/${numericId}`, {
          id: numericId,
          title: payload.title,
          body: payload.description,
        });
      }

      const cachedList =
        queryClient.getQueryData<FertilityService[]>(SERVICES_QUERY_KEY) ?? [];
      const current =
        cachedList.find((item) => String(item.id) === String(id)) ??
        queryClient.getQueryData<FertilityService>([...SERVICES_QUERY_KEY, id]);

      return {
        id: String(id),
        title: payload.title ?? current?.title ?? 'Tratamiento',
        category: payload.category ?? current?.category ?? 'General',
        description: payload.description ?? current?.description ?? '',
        detailedDescription:
          payload.detailedDescription ?? current?.detailedDescription,
        durationWeeks: payload.durationWeeks ?? current?.durationWeeks ?? 4,
        imageUrl:
          payload.imageUrl ??
          current?.imageUrl ??
          'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
      };
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<FertilityService[]>(
        SERVICES_QUERY_KEY,
        (oldData = []) =>
          oldData.map((item) =>
            String(item.id) === String(updatedItem.id) ? updatedItem : item
          )
      );
      queryClient.setQueryData<FertilityService>(
        [...SERVICES_QUERY_KEY, updatedItem.id],
        updatedItem
      );
    },
  });
}