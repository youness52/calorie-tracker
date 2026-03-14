import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    SafeAreaView,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useNutritionStore } from '@/store/nutrition-store';
import Colors from '@/constants/colors';

export default function EditFoodEntryScreen() {
    const router = useRouter();
    const { entryId } = useLocalSearchParams<{ entryId: string }>();
    const { entries, getFoodById, editEntry } = useNutritionStore();

    const [quantity, setQuantity] = useState('1');
    const [foodName, setFoodName] = useState('');
    const [baseCalories, setBaseCalories] = useState(0);

    // Find the original entry
    const existingEntry = entries.find(e => e.id === entryId);

    useEffect(() => {
        if (existingEntry) {
            setQuantity(existingEntry.quantity.toString());

            const food = getFoodById(existingEntry.foodId);
            if (food) {
                setFoodName(food.name);
                setBaseCalories(food.calories);
            }
        }
    }, [existingEntry, getFoodById]);

    if (!existingEntry) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ title: 'Edit Entry' }} />
                <View style={styles.content}>
                    <Text style={styles.errorText}>Entry not found.</Text>
                    <Pressable style={styles.saveButton} onPress={() => router.back()}>
                        <Text style={styles.saveButtonText}>Go Back</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    const handleSave = () => {
        const numQuantity = parseFloat(quantity);

        if (isNaN(numQuantity) || numQuantity <= 0) {
            Alert.alert('Invalid Quantity', 'Please enter a valid quantity greater than 0.');
            return;
        }

        editEntry(existingEntry.id, {
            quantity: numQuantity
        });

        Alert.alert('Success', 'Food entry updated.');
        router.back();
    };

    const totalCalories = (baseCalories * (parseFloat(quantity) || 0)).toFixed(0);

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Edit Food Entry',
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={Colors.text} />
                        </Pressable>
                    )
                }}
            />
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.card}>
                        <Text style={styles.foodName}>{foodName}</Text>
                        <Text style={styles.totalCalories}>{totalCalories} Total Calories</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Quantity (Servings)</Text>
                            <TextInput
                                style={styles.input}
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="decimal-pad"
                                placeholder="e.g. 1.5"
                                placeholderTextColor={Colors.muted}
                                autoFocus
                            />
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.saveButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>Update Entry</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
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
    },
    backButton: {
        marginRight: 16,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    foodName: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    totalCalories: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '600',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 24,
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
        padding: 16,
        fontSize: 18,
        color: Colors.text,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
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
    errorText: {
        fontSize: 18,
        color: Colors.danger,
        textAlign: 'center',
        marginBottom: 20,
    }
});
