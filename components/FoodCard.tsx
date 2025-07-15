import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Food } from '@/types/food';
import Colors from '@/constants/colors';

interface FoodCardProps {
  food: Food;
  onPress: (food: Food) => void;
}

export default function FoodCard({ food, onPress }: FoodCardProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(food)}
    >
      <View style={styles.imageContainer}>
        {food.image ? (
          <Image source={{ uri: food.image }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: Colors.lightGray }]} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.calories}>{food.calories} cal per {food.servingSize}</Text>
        <View style={styles.macros}>
          <Text style={styles.macro}>P: {food.protein}g</Text>
          <Text style={styles.macro}>C: {food.carbs}g</Text>
          <Text style={styles.macro}>F: {food.fat}g</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  calories: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 4,
  },
  macros: {
    flexDirection: 'row',
    gap: 8,
  },
  macro: {
    fontSize: 12,
    color: Colors.muted,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});