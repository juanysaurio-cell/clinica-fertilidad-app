import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { FERTILITY_SERVICES } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { FertilityService } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [services, setServices] = useState<FertilityService[]>(FERTILITY_SERVICES);
  const [productQuery, setProductQuery] = useState<string>('');

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setServices(FERTILITY_SERVICES);
    setIsRefreshing(false);
  }, []);

  const filteredServices = useMemo(() => {
    if (!productQuery.trim()) return services;
    const lower = productQuery.toLowerCase();
    return services.filter(
      (s) => s.title.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower)
    );
  }, [productQuery, services]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.moduleContainer}>
        <Text style={styles.sectionTitle}>Tratamientos de Fertilidad</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tratamiento o categoría..."
          placeholderTextColor="#8B949E"
          value={productQuery}
          onChangeText={setProductQuery}
          returnKeyType="search"
        />

        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onSelect={(srv) => navigation.navigate('DetailScreen', { item: srv })}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No hay resultados para "{productQuery}"</Text>
            </View>
          }
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  moduleContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  separator: { height: 12 },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 16,
  },
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
});