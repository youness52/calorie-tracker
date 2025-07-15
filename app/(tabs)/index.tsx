import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentDate, getFormattedDate } from '@/utils/date-utils';
import { MealType } from '@/types/food';
import Colors from '@/constants/colors';
import MealSection from '@/components/MealSection';
import DailyNutritionSummary from '@/components/DailyNutritionSummary';
import WeeklyCalorieChart from '@/components/WeeklyCalorieChart';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  
  const handleAddFood = (mealType: MealType) => {
    router.push({
      pathname: '/add-food',
      params: { mealType, date: selectedDate }
    });
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.dateText}>{getFormattedDate(new Date(selectedDate))}</Text>
      
      <DailyNutritionSummary date={selectedDate} />
      
      <WeeklyCalorieChart 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
      />
      
      <View style={styles.mealsContainer}>
        <MealSection 
          title="Breakfast" 
          mealType="breakfast" 
          date={selectedDate} 
          onAddFood={handleAddFood} 
        />
        
        <MealSection 
          title="Lunch" 
          mealType="lunch" 
          date={selectedDate} 
          onAddFood={handleAddFood} 
        />
        
        <MealSection 
          title="Dinner" 
          mealType="dinner" 
          date={selectedDate} 
          onAddFood={handleAddFood} 
        />
        
        <MealSection 
          title="Snacks" 
          mealType="snack" 
          date={selectedDate} 
          onAddFood={handleAddFood} 
        />
      </View>
    </ScrollView>
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
  dateText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  mealsContainer: {
    marginTop: 16,
  },
});