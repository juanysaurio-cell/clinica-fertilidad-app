import { FertilityService } from '../types';

export type HomeStackParamList = {
  HomeScreen: undefined;
  DetailScreen: { item: FertilityService };
};

export type RootTabParamList = {
  HomeStack: undefined;
  FavoritesScreen: undefined;
};