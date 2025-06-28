import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface NutritionProgressBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit?: string;
}

export default function NutritionProgressBar({
  label,
  current,
  goal,
  color,
  unit = 'g',
}: NutritionProgressBarProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          {current.toFixed(1)}{unit} / {goal}{unit} ({percentage}%)
        </Text>
      </View>
      <View style={styles.progressBackground}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  values: {
    fontSize: 14,
    color: Colors.muted,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});