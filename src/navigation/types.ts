// src/navigation/types.ts
import { FertilityService } from '../types';

export type HomeStackParamList = {
  HomeScreen: undefined;
  DetailScreen: { id: string; item?: FertilityService };
  CreateScreen: undefined;
  EditScreen: { id: string; item?: FertilityService };
};

export type RootTabParamList = {
  HomeTab: undefined;
  SavedTab: undefined;
};