import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNutritionStore } from '@/store/nutrition-store';
import NutritionProgressBar from './NutritionProgressBar';
import Colors from '@/constants/colors';

interface DailyNutritionSummaryProps {
  date: string;
}

export default function DailyNutritionSummary({ date }: DailyNutritionSummaryProps) {
  const { getDailyTotals, goals } = useNutritionStore();
  const { calories, protein, carbs, fat } = getDailyTotals(date);
  
  const caloriesPercentage = Math.round((calories / goals.caloriesGoal) * 100);
  const caloriesRemaining = goals.caloriesGoal - calories;
  
  return (
    <View style={styles.container}>
      <View style={styles.caloriesSummary}>
        <View style={styles.caloriesTextContainer}>
          <Text style={styles.caloriesConsumed}>{calories.toFixed(0)}</Text>
          <Text style={styles.caloriesLabel}>calories consumed</Text>
        </View>
        <View style={styles.caloriesRemainingContainer}>
          <Text style={styles.caloriesRemainingValue}>
            {caloriesRemaining > 0 
              ? `${caloriesRemaining.toFixed(0)} remaining` 
              : `${Math.abs(caloriesRemaining).toFixed(0)} over`}
          </Text>
          <Text style={styles.caloriesGoal}>Goal: {goals.caloriesGoal}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <NutritionProgressBar 
          label="Protein" 
          current={protein} 
          goal={goals.proteinGoal} 
          color={Colors.primary} 
        />
        <NutritionProgressBar 
          label="Carbs" 
          current={carbs} 
          goal={goals.carbsGoal} 
          color={Colors.secondary} 
        />
        <NutritionProgressBar 
          label="Fat" 
          current={fat} 
          goal={goals.fatGoal} 
          color="#FFB347" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  caloriesSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  caloriesTextContainer: {
    flex: 1,
  },
  caloriesConsumed: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
  },
  caloriesLabel: {
    fontSize: 14,
    color: Colors.muted,
  },
  caloriesRemainingContainer: {
    alignItems: 'flex-end',
  },
  caloriesRemainingValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  caloriesGoal: {
    fontSize: 14,
    color: Colors.muted,
  },
  progressContainer: {
    gap: 8,
  },
});