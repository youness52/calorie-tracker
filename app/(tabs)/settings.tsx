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
import { useNutritionStore } from '@/store/nutrition-store';
import Colors from '@/constants/colors';

export default function SettingsScreen() {
  const { goals, updateGoals } = useNutritionStore();
  
  const [caloriesGoal, setCaloriesGoal] = useState(goals.caloriesGoal.toString());
  const [proteinGoal, setProteinGoal] = useState(goals.proteinGoal.toString());
  const [carbsGoal, setCarbsGoal] = useState(goals.carbsGoal.toString());
  const [fatGoal, setFatGoal] = useState(goals.fatGoal.toString());
  
  const handleSave = () => {
    const newGoals = {
      caloriesGoal: parseInt(caloriesGoal) || 2000,
      proteinGoal: parseInt(proteinGoal) || 150,
      carbsGoal: parseInt(carbsGoal) || 200,
      fatGoal: parseInt(fatGoal) || 65,
    };
    
    updateGoals(newGoals);
    Alert.alert('Success', 'Your nutrition goals have been updated.');
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nutrition Goals</Text>
      
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Calories</Text>
          <TextInput
            style={styles.input}
            value={caloriesGoal}
            onChangeText={setCaloriesGoal}
            keyboardType="numeric"
            placeholder="e.g. 2000"
            placeholderTextColor={Colors.muted}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            value={proteinGoal}
            onChangeText={setProteinGoal}
            keyboardType="numeric"
            placeholder="e.g. 150"
            placeholderTextColor={Colors.muted}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Carbs (g)</Text>
          <TextInput
            style={styles.input}
            value={carbsGoal}
            onChangeText={setCarbsGoal}
            keyboardType="numeric"
            placeholder="e.g. 200"
            placeholderTextColor={Colors.muted}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fat (g)</Text>
          <TextInput
            style={styles.input}
            value={fatGoal}
            onChangeText={setFatGoal}
            keyboardType="numeric"
            placeholder="e.g. 65"
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
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Calorie Tracking</Text>
        <Text style={styles.infoText}>
          Tracking your daily nutrition intake helps you maintain a balanced diet and reach your health goals.
        </Text>
        <Text style={styles.infoText}>
          The recommended macronutrient distribution is:
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Protein: 10-35% of daily calories</Text>
          <Text style={styles.bulletPoint}>• Carbohydrates: 45-65% of daily calories</Text>
          <Text style={styles.bulletPoint}>• Fat: 20-35% of daily calories</Text>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  card: {
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
  inputGroup: {
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
  infoCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  bulletPoints: {
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
});