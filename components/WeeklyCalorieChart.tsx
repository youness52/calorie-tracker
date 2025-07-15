import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNutritionStore } from '@/store/nutrition-store';
import { getDaysOfWeek, getShortDayName, getDayOfMonth } from '@/utils/date-utils';
import Colors from '@/constants/colors';

interface WeeklyCalorieChartProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function WeeklyCalorieChart({ 
  selectedDate, 
  onSelectDate 
}: WeeklyCalorieChartProps) {
  const { getDailyTotals, goals } = useNutritionStore();
  const daysOfWeek = getDaysOfWeek();
  
  const maxCalories = goals.caloriesGoal * 1.2; // For scaling the chart
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Overview</Text>
      <View style={styles.chartContainer}>
        {daysOfWeek.map((date) => {
          const calories = getDailyTotals(date).calories;
          const percentage = Math.max(5, (calories / maxCalories) * 100);
          const isSelected = date === selectedDate;
          const isToday = date === daysOfWeek[daysOfWeek.length - 1];
          
          return (
            <Pressable 
              key={date}
              style={styles.dayColumn}
              onPress={() => onSelectDate(date)}
            >
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${percentage}%`,
                      backgroundColor: isSelected 
                        ? Colors.primary 
                        : calories > goals.caloriesGoal 
                          ? Colors.warning 
                          : Colors.secondary
                    }
                  ]} 
                />
              </View>
              <Text style={[
                styles.dayText,
                isSelected && styles.selectedDayText
              ]}>
                {getShortDayName(date)}
              </Text>
              <Text style={[
                styles.dateText,
                isSelected && styles.selectedDateText,
                isToday && styles.todayText
              ]}>
                {getDayOfMonth(date)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
    justifyContent: 'space-between',
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    height: 100,
    width: '60%',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  dayText: {
    fontSize: 12,
    color: Colors.muted,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedDayText: {
    color: Colors.primary,
  },
  selectedDateText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  todayText: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
});