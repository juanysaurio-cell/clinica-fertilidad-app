import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSavedStore } from '../stores/savedStore';

export const SavedScreen = () => {
  const savedItems = useSavedStore((state) => state.savedItems);
  const removeItem = useSavedStore((state) => state.removeItem);
  const clearAll = useSavedStore((state) => state.clearAll);

  const confirmClearAll = () => {
    if (Platform.OS === 'web') {
      clearAll();
      return;
    }

    Alert.alert(
      'Limpiar todo',
      '¿Deseas eliminar todos los tratamientos guardados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpiar', style: 'destructive', onPress: clearAll },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tratamientos Guardados</Text>
        {savedItems.length > 0 && (
          <Pressable
            accessibilityRole="button"
            onPress={confirmClearAll}
            style={styles.clearBtn}
          >
            <Text style={styles.clearText}>Limpiar todo</Text>
          </Pressable>
        )}
      </View>

      {savedItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No has guardado ningún tratamiento aún.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemCategory}>
                  {item.category} • {item.durationWeeks} sem
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => removeItem(item.id)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>Eliminar</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  clearBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearText: { color: '#DC2626', fontWeight: '700', fontSize: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { color: '#64748B', fontSize: 15, textAlign: 'center' },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  itemInfo: { flex: 1, paddingRight: 10 },
  itemTitle: { fontWeight: '700', color: '#1E293B', fontSize: 15, marginBottom: 2 },
  itemCategory: { fontSize: 12, color: '#64748B', textTransform: 'uppercase' },
  removeBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeText: { color: '#DC2626', fontWeight: '700', fontSize: 12 },
});