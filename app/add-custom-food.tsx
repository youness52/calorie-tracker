import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  ScrollView,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNutritionStore } from '@/store/nutrition-store';
import { FoodCategory } from '@/types/food';
import Colors from '@/constants/colors';

const CATEGORIES: { label: string; value: FoodCategory }[] = [
  { label: 'Protein', value: 'protein' },
  { label: 'Carbs', value: 'carbs' },
  { label: 'Fruit', value: 'fruit' },
  { label: 'Vegetable', value: 'vegetable' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Snack', value: 'snack' },
  { label: 'Beverage', value: 'beverage' },
  { label: 'Other', value: 'other' },
];

export default function AddCustomFoodScreen() {
  const router = useRouter();
  const { addCustomFood } = useNutritionStore();
  
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [category, setCategory] = useState<FoodCategory>('other');
  const [imageUrl, setImageUrl] = useState('');
  
  const handleSave = () => {
    if (!name || !calories || !servingSize) {
      Alert.alert('Missing Information', 'Please fill in at least the name, calories, and serving size.');
      return;
    }
    
    const newFood = {
      name,
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      servingSize,
      category,
      image: imageUrl || undefined,
    };
    
    addCustomFood(newFood);
    Alert.alert('Success', 'Food added to your custom foods.');
    router.back();
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Add Custom Food',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </Pressable>
          )
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food Name*</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Homemade Granola"
              placeholderTextColor={Colors.muted}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories (per serving)*</Text>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              placeholder="e.g. 250"
              placeholderTextColor={Colors.muted}
            />
          </View>
          
          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                placeholder="e.g. 10"
                placeholderTextColor={Colors.muted}
              />
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
                placeholder="e.g. 30"
                placeholderTextColor={Colors.muted}
              />
            </View>
          </View>
          
          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
                placeholder="e.g. 12"
                placeholderTextColor={Colors.muted}
              />
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Serving Size*</Text>
              <TextInput
                style={styles.input}
                value={servingSize}
                onChangeText={setServingSize}
                placeholder="e.g. 1/2 cup"
                placeholderTextColor={Colors.muted}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat.value}
                  style={[
                    styles.categoryButton,
                    category === cat.value && styles.selectedCategoryButton
                  ]}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text 
                    style={[
                      styles.categoryText,
                      category === cat.value && styles.selectedCategoryText
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URL (optional)</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor={Colors.muted}
            />
          </View>
          
          <Pressable 
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Food</Text>
          </Pressable>
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
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  categoriesContainer: {
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});