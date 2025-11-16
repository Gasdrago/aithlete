
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image, Alert, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { TAB_BAR_HEIGHT } from "@/components/FloatingTabBar";

export default function BodyProjectionScreen() {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [projections, setProjections] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3' | '6' | '12'>('6');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setProjections(null);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Camera permission is required to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setProjections(null);
    }
  };

  const generateProjection = () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please upload or take a photo first.");
      return;
    }

    setIsGenerating(true);

    // Simulate AI body projection generation
    setTimeout(() => {
      setProjections({
        '3': selectedImage, // In real app, this would be AI-generated
        '6': selectedImage,
        '12': selectedImage,
      });
      setIsGenerating(false);
      Alert.alert(
        "Projection Complete",
        "Your body transformation projections have been generated!",
        [{ text: "OK" }]
      );
    }, 3000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_HEIGHT + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Body Projection</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>
          See your future physique with AI-powered predictions
        </Text>

        {/* Upload Section */}
        {!selectedImage && (
          <View style={styles.uploadSection}>
            <View style={styles.uploadPlaceholder}>
              <IconSymbol
                ios_icon_name="photo"
                android_material_icon_name="photo_camera"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.uploadText}>Upload or take a full-body photo</Text>
            </View>

            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <IconSymbol
                  ios_icon_name="camera.fill"
                  android_material_icon_name="camera_alt"
                  size={24}
                  color={colors.background}
                />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <IconSymbol
                  ios_icon_name="photo.fill"
                  android_material_icon_name="photo_library"
                  size={24}
                  color={colors.background}
                />
                <Text style={styles.uploadButtonText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Image Preview */}
        {selectedImage && !projections && (
          <View style={styles.previewSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            </View>

            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
              onPress={generateProjection}
              disabled={isGenerating}
            >
              <Text style={styles.generateButtonText}>
                {isGenerating ? "Generating Projections..." : "Generate AI Projection"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Projections Display */}
        {projections && (
          <View style={styles.projectionsSection}>
            <Text style={styles.projectionsTitle}>Your Transformation Journey</Text>

            {/* Timeframe Selector */}
            <View style={styles.timeframeSelector}>
              {(['3', '6', '12'] as const).map((months) => (
                <TouchableOpacity
                  key={months}
                  style={[
                    styles.timeframeButton,
                    selectedTimeframe === months && styles.timeframeButtonActive,
                  ]}
                  onPress={() => setSelectedTimeframe(months)}
                >
                  <Text
                    style={[
                      styles.timeframeButtonText,
                      selectedTimeframe === months && styles.timeframeButtonTextActive,
                    ]}
                  >
                    {months} Months
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Before/After Comparison */}
            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Before</Text>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.comparisonImage} />
                </View>
              </View>

              <View style={styles.comparisonDivider}>
                <IconSymbol
                  ios_icon_name="arrow.right"
                  android_material_icon_name="arrow_forward"
                  size={32}
                  color={colors.text}
                />
              </View>

              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>After {selectedTimeframe} Months</Text>
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: projections[selectedTimeframe] }} 
                    style={styles.comparisonImage} 
                  />
                  <View style={styles.aiOverlay}>
                    <Text style={styles.aiOverlayText}>AI Generated</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Metrics Prediction */}
            <View style={styles.metricsCard}>
              <Text style={styles.metricsTitle}>Predicted Changes</Text>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Muscle Gain</Text>
                <Text style={styles.metricValue}>+{selectedTimeframe === '3' ? '2' : selectedTimeframe === '6' ? '4' : '8'} kg</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Body Fat Loss</Text>
                <Text style={styles.metricValue}>-{selectedTimeframe === '3' ? '3' : selectedTimeframe === '6' ? '6' : '12'}%</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Estimated Workouts</Text>
                <Text style={styles.metricValue}>{selectedTimeframe === '3' ? '36' : selectedTimeframe === '6' ? '72' : '144'}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/workout')}>
              <Text style={styles.actionButtonText}>Start Training Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => {
              setSelectedImage(null);
              setProjections(null);
            }}>
              <Text style={styles.secondaryButtonText}>Try Another Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 32,
  },
  uploadSection: {
    marginBottom: 32,
  },
  uploadPlaceholder: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginTop: 16,
    textAlign: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: colors.text,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    color: colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  previewSection: {
    marginBottom: 32,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    resizeMode: 'cover',
  },
  changePhotoButton: {
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
  },
  changePhotoText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textDecorationLine: 'underline',
  },
  generateButton: {
    backgroundColor: colors.text,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  projectionsSection: {
    marginBottom: 32,
  },
  projectionsTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 24,
    textAlign: 'center',
  },
  timeframeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  timeframeButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  timeframeButtonText: {
    color: colors.text,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  timeframeButtonTextActive: {
    color: colors.background,
  },
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  comparisonItem: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  comparisonImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    resizeMode: 'cover',
  },
  comparisonDivider: {
    width: 40,
    alignItems: 'center',
  },
  aiOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiOverlayText: {
    fontSize: 10,
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metricsCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  actionButton: {
    backgroundColor: colors.text,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
});
