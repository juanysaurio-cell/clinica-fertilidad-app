import { FertilityService } from '../types';

export type HomeStackParamList = {
  HomeScreen: undefined;
  DetailScreen: { id: string; item?: FertilityService };
  CreateScreen: undefined;
};

export type RootTabParamList = {
  HomeTab: undefined;
  SavedTab: undefined;
};