// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { useItems } from '../hooks/useItems';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data = [], isLoading, isError, error, refetch, isFetching } = useItems();

  const filteredServices = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.statusText}>Cargando tratamientos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>No se pudieron cargar los tratamientos</Text>
        <Text style={styles.statusText}>{error?.message || 'Error de conexión'}</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.retryBtn}
          onPress={() => refetch()}
        >
          <Text style={styles.btnText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.topSection}>
        <View style={styles.topHeader}>
          <Text style={styles.countText}>
            {filteredServices.length}{' '}
            {filteredServices.length === 1 ? 'tratamiento' : 'tratamientos'}
          </Text>
          <Pressable
            accessibilityRole="button"
            style={styles.newBtn}
            onPress={() => navigation.navigate('CreateScreen')}
          >
            <Text style={styles.btnText}>+ Agregar</Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tratamiento o categoría..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94A3B8"
        />
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isFetching}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.statusText}>
              No hay tratamientos que coincidan con la búsqueda.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            style={styles.card}
            onPress={() => navigation.navigate('DetailScreen', { id: item.id, item })}
          >
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.footerRow}>
                <Text style={styles.duration}>
                  Duración: {item.durationWeeks} sem
                </Text>
                <Pressable
                  accessibilityRole="button"
                  style={styles.consultBtn}
                  onPress={() =>
                    navigation.navigate('DetailScreen', { id: item.id, item })
                  }
                >
                  <Text style={styles.btnText}>Consultar</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F8FAFC' },
  topSection: { padding: 14, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  countText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  newBtn: { backgroundColor: '#0284C7', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  searchInput: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, fontSize: 14, color: '#0F172A' },
  listContent: { padding: 16, flexGrow: 1 },
  emptyBox: { paddingVertical: 40, alignItems: 'center' },
  statusText: { fontSize: 14, color: '#64748B', marginTop: 8, textAlign: 'center' },
  errorTitle: { fontSize: 16, fontWeight: '800', color: '#DC2626', textAlign: 'center' },
  retryBtn: { backgroundColor: '#0284C7', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8, marginTop: 14 },
  card: { backgroundColor: '#FFF', borderRadius: 14, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  image: { width: '100%', height: 155 },
  cardContent: { padding: 15 },
  category: { fontSize: 11, fontWeight: '700', color: '#0284C7', textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  description: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  duration: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  consultBtn: { backgroundColor: '#0284C7', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});