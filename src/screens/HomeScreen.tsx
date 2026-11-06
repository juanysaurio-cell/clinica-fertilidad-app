import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, TextInput, SafeAreaView } from 'react-native';
import { mockFertilityServices } from '../data/mockData';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/RootNavigator';
import { useSavedStore } from '../stores/savedStore';
import { FertilityService } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useSavedStore((state) => state.addItem);
  const removeItem = useSavedStore((state) => state.removeItem);
  const isItemSaved = useSavedStore((state) => state.isItemSaved);

  const filteredServices = mockFertilityServices.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
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
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }: { item: FertilityService }) => {
          const saved = isItemSaved(item.id);
          return (
            <Pressable
              style={styles.card}
              // ¡Aquí es donde ocurre la magia! Al presionar la tarjeta o consultar, viaja al DetailScreen con el objeto 'item'
              onPress={() => navigation.navigate('DetailScreen', { item })}
            >
              {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
              <View style={styles.cardContent}>
                <View style={styles.headerRow}>
                  <Text style={styles.category}>{item.category}</Text>
                  {saved && <Text style={styles.badgeText}>Guardado</Text>}
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.footerRow}>
                  <Text style={styles.duration}>⏱️ {item.durationWeeks} semanas aprox.</Text>
                  <Pressable
                    style={[styles.actionBtn, saved ? styles.removeBtn : styles.saveBtn]}
                    onPress={() => navigation.navigate('DetailScreen', { item })}
                  >
                    <Text style={[styles.actionText, saved ? styles.removeText : styles.saveText]}>
                      Consultar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  searchContainer: { padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  searchInput: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, fontSize: 14, color: '#0F172A' },
  card: { backgroundColor: '#FFF', borderRadius: 14, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  image: { width: '100%', height: 160 },
  cardContent: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  category: { fontSize: 11, fontWeight: '700', color: '#0284C7', textTransform: 'uppercase' },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#059669', backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  title: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  description: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  duration: { fontSize: 13, color: '#64748B' },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#0284C7' },
  saveBtn: { backgroundColor: '#0284C7' },
  removeBtn: { backgroundColor: '#0284C7' },
  actionText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  saveText: { color: '#FFF' },
  removeText: { color: '#FFF' },
});