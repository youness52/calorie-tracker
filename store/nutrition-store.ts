import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food, FoodEntry, NutritionGoals } from '@/types/food';
import { foods } from '@/mocks/foods';

interface NutritionState {
  entries: FoodEntry[];
  customFoods: Food[];
  goals: NutritionGoals;
  
  // Actions
  addEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
  removeEntry: (id: string) => void;
  addCustomFood: (food: Omit<Food, 'id'>) => Food;
  removeCustomFood: (id: string) => void; // New action
  updateGoals: (goals: Partial<NutritionGoals>) => void;
  getEntriesByDate: (date: string) => FoodEntry[];
  getFoodById: (id: string) => Food | undefined;
  getDailyTotals: (date: string) => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  clearEntriesForDate: (date: string) => void;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      entries: [],
      customFoods: [],
      goals: {
        caloriesGoal: 2000,
        proteinGoal: 150,
        carbsGoal: 200,
        fatGoal: 65,
      },

      addEntry: (entry) => {
        const newEntry = {
          ...entry,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
        };
        set((state) => ({
          entries: [...state.entries, newEntry],
        }));
      },

      removeEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      addCustomFood: (food) => {
        const newFood = {
          ...food,
          id: Math.random().toString(36).substring(2, 9),
        };
        set((state) => ({
          customFoods: [...state.customFoods, newFood],
        }));
        return newFood;
      },

      removeCustomFood: (id) => {
        set((state) => ({
          customFoods: state.customFoods.filter(food => food.id !== id),
        }));
      },

      updateGoals: (newGoals) => {
        set((state) => ({
          goals: { ...state.goals, ...newGoals },
        }));
      },

      getEntriesByDate: (date) => {
        return get().entries.filter((entry) => entry.date === date);
      },

      getFoodById: (id) => {
        const allFoods = [...foods, ...get().customFoods];
        return allFoods.find((food) => food.id === id);
      },

      getDailyTotals: (date) => {
        const entries = get().getEntriesByDate(date);
        return entries.reduce(
          (totals, entry) => {
            const food = get().getFoodById(entry.foodId);
            if (food) {
              totals.calories += food.calories * entry.quantity;
              totals.protein += food.protein * entry.quantity;
              totals.carbs += food.carbs * entry.quantity;
              totals.fat += food.fat * entry.quantity;
            }
            return totals;
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
      },

      clearEntriesForDate: (date) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.date !== date),
        }));
      },
    }),
    {
      name: 'nutrition-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
