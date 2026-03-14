import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, SafeAreaView, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { analyzeFoodImage } from '@/utils/gemini';
import { saveImageLocally } from '@/utils/storage';
import Colors from '@/constants/colors';

export default function ScanScreen() {
    const router = useRouter();
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

            if (!result.canceled && result.assets && result.assets[0].base64 && result.assets[0].uri) {
                setScannedImage(result.assets[0].uri);
                setIsAnalyzing(true);
                try {
                    // Save local cached file to document storage first
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Ionicons name="sparkles" size={48} color={Colors.primary} />
                    <Text style={styles.title}>AI Food Scanner</Text>
                    <Text style={styles.subtitle}>Take a picture of your food to automatically estimate calories and macros.</Text>
                </View>

                <View style={styles.actions}>
                    <Pressable
                        style={[styles.button, isAnalyzing && styles.buttonDisabled]}
                        onPress={() => handleImagePick(true)}
                        disabled={isAnalyzing}
                    >
                        <Ionicons name="camera" size={32} color={Colors.background} />
                        <Text style={styles.buttonText}>Open Camera</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.button, styles.secondaryButton, isAnalyzing && styles.buttonDisabled]}
                        onPress={() => handleImagePick(false)}
                        disabled={isAnalyzing}
                    >
                        <Ionicons name="images" size={32} color={Colors.primary} />
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Upload from Gallery</Text>
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.muted,
        textAlign: 'center',
        lineHeight: 24,
    },
    actions: {
        gap: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        gap: 12,
    },
    secondaryButton: {
        backgroundColor: Colors.lightGray,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: Colors.background,
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: Colors.primary,
    },
    scanningOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: 24,
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
        resizeMode: 'cover',
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
});
