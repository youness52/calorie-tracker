import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNutritionStore } from '@/store/nutrition-store';
import { MealType } from '@/types/food';
import Colors from '@/constants/colors';

export default function FoodQuantityScreen() {
  const router = useRouter();
  const { foodId, mealType, date } = useLocalSearchParams<{
    foodId: string;
    mealType: MealType;
    date: string;
  }>();

  const { getFoodById, addEntry } = useNutritionStore();
  const [quantity, setQuantity] = useState(1);

  const food = getFoodById(foodId);

  if (!food) {
    return (
      <View style={styles.container}>
        <Text>Food not found</Text>
      </View>
    );
  }

  const totalCalories = food.calories * quantity;
  const totalProtein = food.protein * quantity;
  const totalCarbs = food.carbs * quantity;
  const totalFat = food.fat * quantity;

  const handleDecreaseQuantity = () => {
    if (quantity > 0.25) {
      setQuantity(prev => Math.round((prev - 0.25) * 100) / 100);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => Math.round((prev + 0.25) * 100) / 100);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: food.name,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {food.image && (
          <Image source={{ uri: food.image }} style={styles.foodImage} />
        )}

        <View style={styles.card}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.servingSize}>{food.servingSize}</Text>

          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{food.calories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{food.protein}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{food.carbs}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{food.fat}g</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </View>

        <View style={styles.quantityCard}>
          <Text style={styles.quantityTitle}>Number of Servings</Text>

          <View style={styles.quantityControls}>
            <Pressable
              style={({ pressed }) => [
                styles.quantityButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleDecreaseQuantity}
            >
              <Feather name="minus" size={20} color={Colors.text} />
            </Pressable>

            <Text style={styles.quantityValue}>{quantity}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.quantityButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleIncreaseQuantity}
            >
              <Ionicons name="add" size={20} color={Colors.text} />
            </Pressable>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Nutrition</Text>
            <View style={styles.totalRow}>
              <Text style={styles.totalItem}>Calories: {totalCalories.toFixed(0)}</Text>
              <Text style={styles.totalItem}>Protein: {totalProtein.toFixed(1)}g</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalItem}>Carbs: {totalCarbs.toFixed(1)}g</Text>
              <Text style={styles.totalItem}>Fat: {totalFat.toFixed(1)}g</Text>
            </View>
          </View>
        </View>

        <View style={styles.mealButtonsContainer}>
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(type => (
            <Pressable
              key={type}
              onPress={() => {
                addEntry({
                  foodId: food.id,
                  date,
                  mealType: type,
                  quantity,
                });
                router.push('/foods');
              }}
              style={({ pressed }) => [
                styles.mealButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.mealButtonText}>
                Add to {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    marginRight: 16,
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foodName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 16,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  nutritionLabel: {
    fontSize: 14,
    color: Colors.muted,
  },
  quantityCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  quantityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginHorizontal: 24,
    minWidth: 40,
    textAlign: 'center',
  },
  totalContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalItem: {
    fontSize: 14,
    color: Colors.text,
  },
  mealButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  mealButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: Colors.primary,
    padding: 12,
    marginTop: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  mealButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});
