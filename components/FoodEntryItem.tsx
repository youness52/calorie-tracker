import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { FoodEntry } from '@/types/food';
import { useNutritionStore } from '@/store/nutrition-store';
import Colors from '@/constants/colors';

interface FoodEntryItemProps {
  entry: FoodEntry;
}

export default function FoodEntryItem({ entry }: FoodEntryItemProps) {
  const router = useRouter();
  const { getFoodById, removeEntry } = useNutritionStore();
  const food = getFoodById(entry.foodId);

  if (!food) return null;

  const totalCalories = food.calories * entry.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.details}>
          {entry.quantity} {entry.quantity === 1 ? 'serving' : 'servings'} • {totalCalories.toFixed(0)} cal
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => router.push({
            pathname: '/edit-food-entry',
            params: { entryId: entry.id }
          })}
        >
          <Feather name="edit-2" size={18} color={Colors.primary} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => removeEntry(entry.id)}
        >
          <Feather name="trash-2" size={18} color={Colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  details: {
    fontSize: 14,
    color: Colors.muted,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});