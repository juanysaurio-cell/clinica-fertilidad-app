import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { CreateFertilityServiceInput, FertilityService } from '../types';
import { SERVICES_QUERY_KEY } from './useItems';

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation<FertilityService, Error, CreateFertilityServiceInput>({
    mutationFn: async (newService) => {
      await api.post('/posts', {
        title: newService.title,
        body: newService.description,
        category: newService.category,
        durationWeeks: newService.durationWeeks,
      });

      const createdTreatment: FertilityService = {
        id: `custom-${Date.now()}`,
        title: newService.title,
        category: newService.category,
        description: newService.description,
        detailedDescription: newService.detailedDescription,
        durationWeeks: newService.durationWeeks,
        imageUrl:
          newService.imageUrl ||
          'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
      };

      return createdTreatment;
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