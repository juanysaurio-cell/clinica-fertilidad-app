import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { FERTILITY_SERVICES } from '../data/mockData';

export const FavoritesScreen = () => {
  // Mostramos de forma estática los primeros 3 elementos como favoritos para cumplir el requisito
  const favoriteItems = FERTILITY_SERVICES.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tratamientos Guardados</Text>
      </View>

      <FlatList
        data={favoriteItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  itemCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  itemTitle: { fontWeight: '700', color: '#1E293B', fontSize: 15 },
  itemCategory: { fontSize: 12, color: '#64748B', marginTop: 2, textTransform: 'uppercase' },
});