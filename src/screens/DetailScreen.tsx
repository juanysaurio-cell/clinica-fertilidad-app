import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { useItemById } from '../hooks/useItems';
import { useSavedStore } from '../stores/savedStore';
import { FertilityService } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'DetailScreen'>;

export const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, item: initialItem } = route.params;
  const { data, isLoading, isError, refetch } = useItemById(id);

  const savedItems = useSavedStore((state) => state.savedItems);
  const addItem = useSavedStore((state) => state.addItem);
  const removeItem = useSavedStore((state) => state.removeItem);

  const service: FertilityService | undefined = data
    ? {
        ...initialItem,
        ...data,
        title: data.title || initialItem?.title || 'Tratamiento de Fertilidad',
        category: data.category || initialItem?.category || 'Reproducción Asistida',
        description: data.description || initialItem?.description || '',
        detailedDescription:
          data.detailedDescription || initialItem?.detailedDescription,
        durationWeeks: data.durationWeeks || initialItem?.durationWeeks || 4,
        imageUrl: data.imageUrl || initialItem?.imageUrl,
      }
    : initialItem;

  const isSaved = service
    ? savedItems.some((saved) => String(saved.id) === String(service.id))
    : false;

  const handleToggleSaved = () => {
    if (!service) return;
    if (isSaved) {
      removeItem(service.id);
    } else {
      addItem({
        ...service,
        id: String(service.id),
      });
    }
  };

  if (isLoading && !service) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.statusText}>Cargando información del tratamiento...</Text>
      </View>
    );
  }

  if (isError && !service) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Error al cargar el detalle</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.retryBtn}
          onPress={() => refetch()}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!service) return null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {service.imageUrl && (
          <Image source={{ uri: service.imageUrl }} style={styles.image} />
        )}
        <View style={styles.content}>
          <Text style={styles.category}>{service.category}</Text>
          <Text style={styles.title}>{service.title}</Text>
          <Text style={styles.duration}>
            Duración estimada: {service.durationWeeks} semanas
          </Text>

          <Text style={styles.sectionTitle}>Descripción General</Text>
          <Text style={styles.text}>{service.description}</Text>

          {service.detailedDescription && (
            <>
              <Text style={styles.sectionTitle}>
                Detalles Clínicos del Procedimiento
              </Text>
              <Text style={styles.text}>{service.detailedDescription}</Text>
            </>
          )}

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.editBtn,
              pressed && styles.pressedBtn,
            ]}
            onPress={() =>
              navigation.navigate('EditScreen', {
                id: service.id,
                item: service,
              })
            }
          >
            <Text style={styles.saveBtnText}>Editar Tratamiento</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.saveBtn,
              isSaved ? styles.removeSaveBtn : styles.addSaveBtn,
              pressed && styles.pressedBtn,
            ]}
            onPress={handleToggleSaved}
          >
            <Text style={styles.saveBtnText}>
              {isSaved ? 'Eliminar Tratamiento' : 'Guardar Tratamiento'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 48 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  image: { width: '100%', height: 190 },
  content: { padding: 20 },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  duration: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 6,
  },
  text: { fontSize: 15, color: '#334155', lineHeight: 22 },
  editBtn: {
    marginTop: 24,
    backgroundColor: '#0F766E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  saveBtn: {
    marginTop: 12,
    marginBottom: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  addSaveBtn: { backgroundColor: '#0284C7' },
  removeSaveBtn: { backgroundColor: '#DC2626' },
  pressedBtn: { opacity: 0.85 },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  statusText: { fontSize: 14, color: '#64748B', marginTop: 8 },
  errorTitle: { fontSize: 16, fontWeight: '700', color: '#DC2626', marginBottom: 10 },
  retryBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#FFF', fontWeight: '700' },
});