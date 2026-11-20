export interface FertilityService {
  id: string;
  title: string;
  category: string;
  description: string;
  detailedDescription?: string;
  durationWeeks: number;
  imageUrl?: string;
}

export type Item = FertilityService;
export type CreateItemPayload = Omit<FertilityService, 'id'>;
export type UpdateItemPayload = Partial<CreateItemPayload>;