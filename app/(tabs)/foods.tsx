import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  Pressable,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { foods } from '@/mocks/foods';
import { Food, FoodCategory } from '@/types/food';
import { useNutritionStore } from '@/store/nutrition-store';
import FoodCard from '@/components/FoodCard';
import Colors from '@/constants/colors';

const CATEGORIES: { label: string; value: FoodCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Protein', value: 'protein' },
  { label: 'Carbs', value: 'carbs' },
  { label: 'Fruits', value: 'fruit' },
  { label: 'Vegetables', value: 'vegetable' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Snacks', value: 'snack' },
  { label: 'Beverages', value: 'beverage' },
  { label: 'Other', value: 'other' },
];

export default function FoodsScreen() {
  const router = useRouter();
  const { customFoods } = useNutritionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');

  const allFoods = useMemo(() => [...foods, ...customFoods], [customFoods]);

  const filteredFoods = useMemo(() => {
    return allFoods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allFoods, searchQuery, selectedCategory]);

  const handleFoodPress = useCallback((food: Food) => {
    router.push({
      pathname: '/food-details',
      params: { id: food.id }
    });
  }, [router]);

  const handleAddCustomFood = useCallback(() => {
    router.push('/add-custom-food');
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={Colors.muted} />

          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.muted}
          />
        </View>
        <Pressable 
          style={styles.addButton}
          onPress={handleAddCustomFood}
        >
         <Feather name="plus" size={24} color={Colors.background} />

        </Pressable>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map(category => (
          <Pressable
            key={category.value}
            style={[
              styles.categoryButton,
              selectedCategory === category.value && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category.value)}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.value && styles.selectedCategoryText
              ]}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodCard food={item} onPress={handleFoodPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No foods found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingBottom: 20,
    marginBottom:0,
    gap: 10,
  },
  categoryButton: {
    height:25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedCategoryText: {
    color: Colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
  },
});
