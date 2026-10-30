import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useSavedStore } from '../stores/savedStore';

export const FavoritesScreen = () => {
  const savedItems = useSavedStore((state) => state.savedItems);
  const removeItem = useSavedStore((state) => state.removeItem);
  const clearAll = useSavedStore((state) => state.clearAll);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tratamientos Guardados</Text>
        {savedItems.length > 0 && (
          <Pressable onPress={clearAll} style={styles.clearBtn}>
            <Text style={styles.clearText}>Limpiar todo</Text>
          </Pressable>
        )}
      </View>

      {savedItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No has guardado ningún tratamiento aún.</Text>
        </View>
      ) : (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <Pressable onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                <Text style={styles.removeText}>Eliminar</Text>
              </Pressable>
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  clearBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  clearText: { color: '#EF4444', fontWeight: '700', fontSize: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyText: { color: '#64748B', fontSize: 15 },
  itemCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  itemTitle: { fontWeight: '700', color: '#1E293B', fontSize: 15 },
  itemCategory: { fontSize: 12, color: '#64748B', marginTop: 2, textTransform: 'uppercase' },
  removeBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  removeText: { color: '#EF4444', fontWeight: '700', fontSize: 12 },
});