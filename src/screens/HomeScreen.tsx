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
  phone: string;
  role: string;
}

// Lista ampliada a 15 especialistas con el formato simple/inicial
const DOCTORS: Doctor[] = [
  { id: '1', name: 'Dra. Marcela Restrepo', phone: '3001234567', role: 'Medicina Reproductiva' },
  { id: '2', name: 'Dr. Alejandro Vargas', phone: '3109876543', role: 'Embriología Clínica' },
  { id: '3', name: 'Dra. Sofía Benítez', phone: '3205554433', role: 'Endocrinología Ginecológica' },
  { id: '4', name: 'Dr. Carlos Mendoza', phone: '3154443322', role: 'Urología y Andrología' },
  { id: '5', name: 'Dra. Camila Osorio', phone: '3187778899', role: 'Genética Médica' },
  { id: '6', name: 'Dr. Fernando Gómez', phone: '3012223344', role: 'Cirugía Reproductiva' },
  { id: '7', name: 'Dra. Valentina Ríos', phone: '3123334455', role: 'Preservación de la Fertilidad' },
  { id: '8', name: 'Dr. Javier Morales', phone: '3145556677', role: 'Inmunología Reproductiva' },
  { id: '9', name: 'Dra. Lucía Paredes', phone: '3167778899', role: 'Ecografía Especializada' },
  { id: '10', name: 'Dr. Roberto Silva', phone: '3190001122', role: 'Embriólogo Senior' },
  { id: '11', name: 'Dra. Natalia Castro', phone: '3051112233', role: 'Psicología Reproductiva' },
  { id: '12', name: 'Dr. Gabriel Torres', phone: '3174445566', role: 'Inseminación Asistida' },
  { id: '13', name: 'Dra. Diana Salazar', phone: '3118889900', role: 'Nutrición Reproductiva' },
  { id: '14', name: 'Dr. Mauricio Fuentes', phone: '3023334455', role: 'Andrología Clínica' },
  { id: '15', name: 'Dra. Patricia Herrera', phone: '3226667788', role: 'Coordinadora de Ovodonación' },
];

export const HomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'staff'>('categories');
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
      (d) => d.name.toLowerCase().includes(lower) || d.role.toLowerCase().includes(lower) || d.phone.includes(lower)
    );
  }, [doctorQuery]);

  // ==========================================
  // VISTAS DE LAS PESTAÑAS
  // ==========================================

  // Pestaña 1: Categorías
  const renderCategoriesView = () => {
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

  // Pestaña 2: Personal Clínico (Formato compacto original con avatar de iniciales)
  const renderStaffView = () => (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.moduleContainer}>
          <Text style={styles.sectionTitle}>Personal Clínico</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar especialista o teléfono..."
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
                <View style={styles.doctorAvatar}>
                  <Text style={styles.avatarLetter}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.textFlex}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.role}</Text>
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
      
      <View style={styles.mainContent}>
        {activeTab === 'categories' && renderCategoriesView()}
        {activeTab === 'staff' && renderStaffView()}
      </View>

      {/* MENÚ DE NAVEGACIÓN INFERIOR (2 pestañas) */}
      <View style={styles.navigationBar}>
        <Pressable
          style={[styles.navButton, activeTab === 'categories' && styles.navButtonActive]}
          onPress={() => setActiveTab('categories')}
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

  separator: { height: 12 },
  textFlex: { flex: 1 },

  searchInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#1E293B', marginBottom: 16 },
  
  // Estilos de la tarjeta compacta de doctor (como al inicio)
  doctorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  doctorAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarLetter: { fontSize: 16, fontWeight: '700', color: '#0284C7' },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  itemCategory: { fontSize: 12, color: '#64748B', marginTop: 2, textTransform: 'uppercase', fontWeight: '600' },
  doctorPhone: { fontSize: 13, color: '#0284C7', fontWeight: '600', marginTop: 2 },
  
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 4 },

  // Estilos de la página de Detalle
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

  navigationBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingVertical: 10, paddingHorizontal: 8 },
  navButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  navButtonActive: { backgroundColor: '#E0F2FE' },
  navText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  navTextActive: { color: '#0284C7', fontWeight: '700' },
});