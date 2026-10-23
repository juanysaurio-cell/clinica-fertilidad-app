import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { FERTILITY_SERVICES } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { FertilityService } from '../types';

export const HomeScreen: React.FC = () => {
  const [selectedService, setSelectedService] = useState<FertilityService | null>(null);

  // --- ESTADOS: Categorías (Tratamientos) ---
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

  // ==========================================
  // VISTAS DE LA APLICACIÓN
  // ==========================================

  const renderCategoriesView = () => {
    // Vista de Detalle del Tratamiento Seleccionado
    if (selectedService) {
      return (
        <ScrollView contentContainerStyle={styles.detailContainer} showsVerticalScrollIndicator={false}>
          <Pressable style={styles.backButton} onPress={() => setSelectedService(null)}>
            <Text style={styles.backButtonText}>← Volver a Categorías</Text>
          </Pressable>

          <Image source={{ uri: selectedService.imageUrl }} style={styles.detailImage} resizeMode="cover" />
          
          <View style={styles.detailContent}>
            <Text style={styles.detailCategory}>{selectedService.category.toUpperCase()}</Text>
            <Text style={styles.detailTitle}>{selectedService.title}</Text>
            <Text style={styles.detailDuration}>⏱ Duración estimada: {selectedService.durationWeeks} semanas</Text>
            
            <Text style={styles.detailSectionLabel}>Descripción General</Text>
            <Text style={styles.detailText}>{selectedService.description}</Text>

            <Text style={styles.detailSectionLabel}>Detalles Clínicos del Procedimiento</Text>
            <Text style={styles.detailText}>
              {selectedService.detailedDescription || 'Información clínica especializada en proceso de actualización institucional.'}
            </Text>
          </View>
        </ScrollView>
      );
    }

    // Lista principal con Buscador y Tarjetas
    return (
      <View style={styles.moduleContainer}>
        <Text style={styles.sectionTitle}>Categorías de Tratamientos</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tratamiento o categoría..."
          placeholderTextColor="#8B949E"
          value={productQuery}
          onChangeText={setProductQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard item={item} onSelect={(srv) => setSelectedService(srv)} />
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
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content"  />
      <View style={styles.mainContent}>
        {renderCategoriesView()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  mainContent: { flex: 1 },
  moduleContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  separator: { height: 12 },
  searchInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#1E293B', marginBottom: 16 },
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 4 },

  // Estilos de la vista de detalle
  detailContainer: { padding: 16 },
  backButton: { marginBottom: 16, backgroundColor: '#E0F2FE', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignSelf: 'flex-start' },
  backButtonText: { color: '#0284C7', fontWeight: '700', fontSize: 14 },
  detailImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16 },
  detailContent: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  detailCategory: { fontSize: 12, fontWeight: '700', color: '#0284C7', marginBottom: 4, letterSpacing: 0.5 },
  detailTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  detailDuration: { fontSize: 14, color: '#059669', fontWeight: '700', marginBottom: 16 },
  detailSectionLabel: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginTop: 14, marginBottom: 6 },
  detailText: { fontSize: 14, color: '#475569', lineHeight: 22 },
});