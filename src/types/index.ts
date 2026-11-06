export interface FertilityService {
  id: string | number;
  title: string;
  description: string;
  detailedDescription?: string;
  category: string;
  durationWeeks: number;
  imageUrl?: string;
}