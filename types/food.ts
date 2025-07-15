export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  category: FoodCategory;
  image?: string;
}

export type FoodCategory = 
  | 'protein'
  | 'carbs'
  | 'fruit'
  | 'vegetable'
  | 'dairy'
  | 'snack'
  | 'beverage'
  | 'other';

export interface FoodEntry {
  id: string;
  foodId: string;
  date: string;
  quantity: number;
  mealType: MealType;
  timestamp: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entries: FoodEntry[];
}

export interface NutritionGoals {
  caloriesGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}