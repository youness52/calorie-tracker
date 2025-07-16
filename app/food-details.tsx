import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNutritionStore } from '@/store/nutrition-store';
import { getCurrentDate } from '@/utils/date-utils';
import Colors from '@/constants/colors';

export default function FoodDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getFoodById, removeCustomFood, customFoods } = useNutritionStore();

  const food = getFoodById(id);

  if (!food) {
    return (
      <View style={styles.container}>
        <Text>Food not found</Text>
      </View>
    );
  }

  const handleAddFood = () => {
    router.push({
      pathname: '/food-quantity',
      params: { 
        foodId: food.id, 
        mealType: 'breakfast', 
        date: getCurrentDate()
      }
    });
  };

  const handleRemoveFood = () => {
    const isCustomFood = customFoods.some(f => f.id === food.id);
    if (isCustomFood) {
      removeCustomFood(food.id);
      router.back();
    } else {
      Alert.alert('Cannot remove', 'This food is a predefined item and cannot be removed.');
    }
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
          )
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {food.image && (
          <Image source={{ uri: food.image }} style={styles.foodImage} />
        )}
        
        <View style={styles.card}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.category}>{food.category.charAt(0).toUpperCase() + food.category.slice(1)}</Text>
          <Text style={styles.servingSize}>Serving size: {food.servingSize}</Text>
          
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
        
        <View style={styles.macroBreakdownCard}>
          <Text style={styles.breakdownTitle}>Macronutrient Breakdown</Text>
          
          <View style={styles.macroBarContainer}>
            {food.protein > 0 && (
              <View 
                style={[
                  styles.macroBar, 
                  { 
                    width: `${(food.protein * 4 / (food.protein * 4 + food.carbs * 4 + food.fat * 9)) * 100}%`,
                    backgroundColor: Colors.primary 
                  }
                ]} 
              />
            )}
            {food.carbs > 0 && (
              <View 
                style={[
                  styles.macroBar, 
                  { 
                    width: `${(food.carbs * 4 / (food.protein * 4 + food.carbs * 4 + food.fat * 9)) * 100}%`,
                    backgroundColor: Colors.secondary 
                  }
                ]} 
              />
            )}
            {food.fat > 0 && (
              <View 
                style={[
                  styles.macroBar, 
                  { 
                    width: `${(food.fat * 9 / (food.protein * 4 + food.carbs * 4 + food.fat * 9)) * 100}%`,
                    backgroundColor: '#4763ffff' 
                  }
                ]} 
              />
            )}
          </View>
          
          <View style={styles.macroLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Protein ({Math.round((food.protein * 4 / (food.protein * 4 + food.carbs * 4 + food.fat * 9)) * 100)}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.secondary }]} />
              <Text style={styles.legendText}>Carbs ({Math.round((food.carbs * 4 / (food.protein * 4 + food.carbs * 4 + food.fat * 9)) * 100)}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4763ffff' }]} />
              <Text style={styles.legendText}>Fat ({Math.round((food.fat * 9 / (food.protein * 4 + food.carbs * 4 + food.fat * 9)) * 100)}%)</Text>
            </View>
          </View>


          
        </View>
        
        <Pressable 
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleAddFood}
        >
          <Ionicons name="add" size={20} color={Colors.background} />
          <Text style={styles.addButtonText}>Add to Today</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleRemoveFood}
        >
          <Text style={styles.removeButtonText}>Remove Food</Text>
        </Pressable>
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
  category: {
    fontSize: 16,
    color: Colors.muted,
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
  macroBreakdownCard: {
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
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  macroBarContainer: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
    marginBottom: 16,
  },
  macroBar: {
    height: '100%',
  },
  macroLegend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor:  '#FF4C4C',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
   addButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
