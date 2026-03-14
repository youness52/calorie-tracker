import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { foods } from '@/mocks/foods';
import { Food, FoodCategory, MealType } from '@/types/food';
import { useNutritionStore } from '@/store/nutrition-store';
import FoodCard from '@/components/FoodCard';
import Colors from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { analyzeFoodImage } from '@/utils/gemini';
import { saveImageLocally } from '@/utils/storage';

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

export default function AddFoodScreen() {
  const router = useRouter();
  const { mealType, date } = useLocalSearchParams<{ mealType: MealType; date: string }>();
  const { customFoods } = useNutritionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isAnalyzing) {
      scanAnimation.setValue(0);
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      scanAnimation.stopAnimation();
      scanAnimation.setValue(0);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isAnalyzing, scanAnimation]);

  const handleImagePick = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission needed', `Please grant ${useCamera ? 'camera' : 'photo library'} permissions to use this feature.`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        })
        : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        });

      if (!result.canceled && result.assets[0].base64 && result.assets[0].uri) {
        setScannedImage(result.assets[0].uri);
        setIsAnalyzing(true);
        try {
          // Persist the copied file locally first
          const persistentUri = await saveImageLocally(result.assets[0].uri);

          const aiResult = await analyzeFoodImage(result.assets[0].base64);

          router.push({
            pathname: '/add-custom-food',
            params: {
              ...aiResult,
              imageUri: persistentUri,
            }
          });
        } catch (error) {
          Alert.alert('Analysis Failed', error instanceof Error ? error.message : 'Could not analyze the image.');
        } finally {
          setIsAnalyzing(false);
          setScannedImage(null);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while opening the camera or gallery.');
    }
  };

  const allFoods = [...foods, ...customFoods];

  const filteredFoods = allFoods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFoodPress = (food: Food) => {
    router.push({
      pathname: '/food-quantity',
      params: {
        foodId: food.id,
        mealType: mealType || 'breakfast',
        date: date || new Date().toISOString().split('T')[0]
      }
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `Add to ${mealType?.charAt(0).toUpperCase() + mealType?.slice(1) || 'Meal'}`,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </Pressable>
          )
        }}
      />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.muted}
            autoFocus
          />
        </View>

        <View style={styles.aiActionContainer}>
          <Pressable style={styles.aiButton} onPress={() => handleImagePick(true)} disabled={isAnalyzing}>
            <Ionicons name="camera" size={20} color={Colors.primary} />
            <Text style={styles.aiButtonText}>Scan Food</Text>
          </Pressable>
          <Pressable style={styles.aiButton} onPress={() => handleImagePick(false)} disabled={isAnalyzing}>
            <Ionicons name="images" size={20} color={Colors.primary} />
            <Text style={styles.aiButtonText}>Upload Photo</Text>
          </Pressable>
        </View>

        {isAnalyzing && scannedImage && (
          <View style={styles.scanningOverlay}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: scannedImage }} style={styles.scannedImagePreview} />
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 250], // Match image height roughly
                        })
                      }
                    ]
                  }
                ]}
              />
            </View>
            <Text style={styles.scanningText}>Identifying Food...</Text>
            <Text style={styles.scanningSubtext}>Our AI is analyzing the nutritional content</Text>
          </View>
        )}

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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    height: 48,
    marginBottom: 16,
  },
  aiActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  aiButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    gap: 8,
  },
  aiButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 24,
    borderRadius: 12,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    position: 'relative',
    backgroundColor: Colors.lightGray,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  scannedImagePreview: {
    width: '100%',
    height: '100%',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  scanningText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  scanningSubtext: {
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  categoriesContainer: {
    paddingBottom: 16,
    gap: 8,
  },
  categoryButton: {
    height: 25,
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