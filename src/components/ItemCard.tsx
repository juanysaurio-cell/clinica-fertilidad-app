import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { FertilityService } from '../types';

interface ItemCardProps {
  item: FertilityService;
  onSelect: (item: FertilityService) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          {item.isPopular && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Destacado</Text>
            </View>
          )}
        </View>

        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.durationText}>⏱ {item.durationWeeks} semanas aprox.</Text>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.actionButtonText}>Consultar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  contentContainer: {
    padding: 16,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0369A1',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  descriptionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  durationText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonPressed: {
    backgroundColor: '#0369A1',
    opacity: 0.8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});