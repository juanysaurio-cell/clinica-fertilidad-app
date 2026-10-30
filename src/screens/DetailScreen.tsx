import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'DetailScreen'>;

export const DetailScreen: React.FC<Props> = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.detailContainer} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: item.imageUrl }} style={styles.detailImage} resizeMode="cover" />

      <View style={styles.detailContent}>
        <Text style={styles.detailCategory}>{item.category.toUpperCase()}</Text>
        <Text style={styles.detailTitle}>{item.title}</Text>
        <Text style={styles.detailDuration}>⏱ Duración estimada: {item.durationWeeks} semanas</Text>

        <Text style={styles.detailSectionLabel}>Descripción General</Text>
        <Text style={styles.detailText}>{item.description}</Text>

        <Text style={styles.detailSectionLabel}>Detalles Clínicos del Procedimiento</Text>
        <Text style={styles.detailText}>
          {item.detailedDescription || 'Información clínica especializada en proceso de actualización institucional.'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  detailContainer: { padding: 16, backgroundColor: '#F8FAFC' },
  detailImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16 },
  detailContent: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  detailCategory: { fontSize: 12, fontWeight: '700', color: '#0284C7', marginBottom: 4 },
  detailTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  detailDuration: { fontSize: 14, color: '#059669', fontWeight: '700', marginBottom: 16 },
  detailSectionLabel: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginTop: 14, marginBottom: 6 },
  detailText: { fontSize: 14, color: '#475569', lineHeight: 22 },
});