import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/RootNavigator';
import { useSavedStore } from '../stores/savedStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'DetailScreen'>;

export const DetailScreen: React.FC<Props> = ({ route }) => {
  const { item } = route.params;
  
  // Forzamos la suscripción directa al arreglo de guardados para que React reaccione sí o sí al cambio
  const savedItems = useSavedStore((state) => state.savedItems);
  const addItem = useSavedStore((state) => state.addItem);
  const removeItem = useSavedStore((state) => state.removeItem);
  
  const saved = savedItems.some((i) => String(i.id) === String(item.id));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.category}>{item.category}</Text>
            {saved && <Text style={styles.badgeText}>Guardado en Favoritos</Text>}
          </View>
          
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.duration}>⏱️ Duración estimada: {item.durationWeeks} semanas</Text>

          <Text style={styles.sectionTitle}>Descripción General</Text>
          <Text style={styles.text}>{item.description}</Text>

          {item.detailedDescription && (
            <>
              <Text style={styles.sectionTitle}>Detalles Clínicos del Procedimiento</Text>
              <Text style={styles.text}>{item.detailedDescription}</Text>
            </>
          )}

          <Pressable
            style={[styles.mainButton, saved ? styles.removeMainBtn : styles.saveMainBtn]}
            onPress={() => (saved ? removeItem(item.id) : addItem(item))}
          >
            <Text style={styles.mainButtonText}>
              {saved ? 'Eliminar Tratamiento' : 'Guardar Tratamiento'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  image: { width: '100%', height: 220 },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  category: { fontSize: 12, fontWeight: '700', color: '#0284C7', textTransform: 'uppercase' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#059669', backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginTop: 4, marginBottom: 8 },
  duration: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginTop: 16, marginBottom: 6 },
  text: { fontSize: 15, color: '#334155', lineHeight: 22 },
  mainButton: { marginTop: 30, padding: 16, borderRadius: 12, alignItems: 'center' },
  saveMainBtn: { backgroundColor: '#0284C7' },
  removeMainBtn: { backgroundColor: '#EF4444' },
  mainButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});