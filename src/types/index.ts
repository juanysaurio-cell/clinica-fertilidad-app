export interface FertilityService {
  id: string;
  title: string;
  category: string;
  description: string;
  detailedDescription?: string;
  durationWeeks: number;
  imageUrl: string;
  isPopular?: boolean;
}