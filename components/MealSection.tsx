import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodEntry, MealType } from '@/types/food';
import Colors from '@/constants/colors';
import FoodEntryItem from './FoodEntryItem';
import { useNutritionStore } from '@/store/nutrition-store';

interface MealSectionProps {
  title: string;
  mealType: MealType;
  date: string;
  onAddFood: (mealType: MealType) => void;
}

export default function MealSection({ 
  title, 
  mealType, 
  date, 
  onAddFood 
}: MealSectionProps) {
  const { entries, getFoodById } = useNutritionStore();
  
  const mealEntries = entries.filter(
    entry => entry.date === date && entry.mealType === mealType
  );
  
  const totalCalories = mealEntries.reduce((total, entry) => {
    const food = getFoodById(entry.foodId);
    return total + (food ? food.calories * entry.quantity : 0);
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.calories}>{totalCalories.toFixed(0)} calories</Text>
        </View>
        <Pressable 
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => onAddFood(mealType)}
        >
          <Ionicons name="add"  size={20} color={Colors.primary} />
          <Text style={styles.addButtonText}>Add Food</Text>
        </Pressable>
      </View>
      
      <View style={styles.entriesContainer}>
        {mealEntries.length === 0 ? (
          <Text style={styles.emptyText}>No foods added yet</Text>
        ) : (
          mealEntries.map(entry => (
            <FoodEntryItem key={entry.id} entry={entry} />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  calories: {
    fontSize: 14,
    color: Colors.muted,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  entriesContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    color: Colors.muted,
    fontStyle: 'italic',
  },
});