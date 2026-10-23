import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { FERTILITY_SERVICES } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { FertilityService } from '../types';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  imageUrl: string;
}

const DOCTORS: Doctor[] = [
  { id: '1', name: 'Dra. Marcela Restrepo', specialty: 'Medicina Reproductiva', phone: '3001234567', imageUrl: 'https://images.unsplash.com/photo-1594824813587-8e63a8a9bc47?w=400&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Dr. Alejandro Vargas', specialty: 'Embriología Clínica', phone: '3109876543', imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Dra. Sofía Benítez', specialty: 'Endocrinología Ginecológica', phone: '3205554433', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80' },
];

export const HomeScreen: React.FC = () => {
  // Pestañas: 'home' (vacía/inicio), 'categories' (categorías con buscador y detalle), 'staff' (personal clínico)
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'staff'>('categories');
  
  // Estado para manejar la "sub-página" o vista de detalle del tratamiento seleccionado
  const [selectedService, setSelectedService] = useState<FertilityService | null>(null);

  // --- CATEGORÍAS (Tratamientos) ---
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

  // --- PERSONAL CLÍNICO ---
  const [doctorQuery, setDoctorQuery] = useState<string>('');

  const filteredDoctors = useMemo(() => {
    if (!doctorQuery.trim()) return DOCTORS;
    const lower = doctorQuery.toLowerCase();
    return DOCTORS.filter(
      (d) => d.name.toLowerCase().includes(lower) || d.specialty.toLowerCase().includes(lower)
    );
  }, [doctorQuery]);

  // ==========================================
  // VISTAS DE LAS PESTAÑAS
  // ==========================================

  // Pestaña 1: Inicio (Vacía / Bienvenida limpia como pediste)
  const renderHomeWelcome = () => (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle}>Bienvenido a la Clínica</Text>
      <Text style={styles.welcomeSubtitle}>Selecciona una opción en el menú inferior para explorar las categorías de tratamientos o consultar nuestro personal clínico.</Text>
    </View>
  );

  // Pestaña 2: Categorías (Con Buscador y soporte para ver la página de Detalle)
  const renderCategoriesView = () => {
    // Si hay un servicio seleccionado, mostramos la "nueva página" de detalle
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

    // Vista principal de Categorías con su barra de búsqueda
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

  // Pestaña 3: Personal Clínico (Buscador de especialistas)
  const renderStaffView = () => (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.moduleContainer}>
          <Text style={styles.sectionTitle}>Personal Clínico</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar especialista o área..."
            placeholderTextColor="#8B949E"
            value={doctorQuery}
            onChangeText={setDoctorQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />

          <FlatList
            data={filteredDoctors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.doctorCard}>
                <Image source={{ uri: item.imageUrl }} style={styles.doctorAvatar} />
                <View style={styles.textFlex}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.specialty}</Text>
                  <Text style={styles.doctorPhone}>📞 {item.phone}</Text>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Sin resultados para "{doctorQuery}"</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content"  />
      
      {/* CONTENIDO SEGÚN LA PESTAÑA */}
      <View style={styles.mainContent}>
        {activeTab === 'home' && renderHomeWelcome()}
        {activeTab === 'categories' && renderCategoriesView()}
        {activeTab === 'staff' && renderStaffView()}
      </View>

      {/* MENÚ DE NAVEGACIÓN INFERIOR */}
      <View style={styles.navigationBar}>
        <Pressable
          style={[styles.navButton, activeTab === 'home' && styles.navButtonActive]}
          onPress={() => { setActiveTab('home'); setSelectedService(null); }}
        >
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Inicio</Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, activeTab === 'categories' && styles.navButtonActive]}
          onPress={() => { setActiveTab('categories'); }}
        >
          <Text style={[styles.navText, activeTab === 'categories' && styles.navTextActive]}>Categorías</Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, activeTab === 'staff' && styles.navButtonActive]}
          onPress={() => { setActiveTab('staff'); setSelectedService(null); }}
        >
          <Text style={[styles.navText, activeTab === 'staff' && styles.navTextActive]}>Personal Clínico</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  mainContent: { flex: 1 },
  moduleContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  
  welcomeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  welcomeTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 12, textAlign: 'center' },
  welcomeSubtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 22 },

  separator: { height: 12 },
  textFlex: { flex: 1 },

  searchInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#1E293B', marginBottom: 16 },
  
  doctorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  doctorAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 14 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  itemCategory: { fontSize: 12, color: '#64748B', marginTop: 2, textTransform: 'uppercase', fontWeight: '600' },
  doctorPhone: { fontSize: 13, color: '#0284C7', fontWeight: '600', marginTop: 2 },
  
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 4 },

  // Estilos de la página de Detalle
  detailContainer: { padding: 16 },
  backButton: { marginBottom: 16, backgroundColor: '#E0F2FE', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignSelf: 'flex-start' },
  backButtonText: { color: '#0284C7', fontWeight: '700', fontSize: 14 },
  detailImage: { width: '1005', height: 200, borderRadius: 16, marginBottom: 16, },
  detailContent: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  detailCategory: { fontSize: 12, fontWeight: '700', color: '#0284C7', marginBottom: 4, letterSpacing: 0.5 },
  detailTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  detailDuration: { fontSize: 14, color: '#059669', fontWeight: '700', marginBottom: 16 },
  detailSectionLabel: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginTop: 14, marginBottom: 6 },
  detailText: { fontSize: 14, color: '#475569', lineHeight: 22 },

  navigationBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingVertical: 10, paddingHorizontal: 8 },
  navButton: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  navButtonActive: { backgroundColor: '#E0F2FE' },
  navText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  navTextActive: { color: '#0284C7', fontWeight: '700' },
});