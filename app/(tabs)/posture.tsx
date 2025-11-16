
import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { BlurView } from "expo-blur";
import { TAB_BAR_HEIGHT } from "@/components/FloatingTabBar";

// AI-generated advice based on posture score
const getPostureAdvice = (score: number): string[] => {
  if (score >= 90) {
    return [
      "Excellent form! Your posture is nearly perfect.",
      "Maintain this alignment throughout your workout.",
      "Focus on controlled breathing to enhance stability.",
      "Keep your core engaged for optimal results."
    ];
  } else if (score >= 80) {
    return [
      "Good posture with minor adjustments needed.",
      "Engage your core muscles more actively.",
      "Ensure your shoulders are relaxed and down.",
      "Align your knees with your toes for better balance."
    ];
  } else if (score >= 70) {
    return [
      "Your form needs some improvement.",
      "Lower your shoulders and avoid hunching.",
      "Keep your spine neutral and aligned.",
      "Distribute your weight evenly on both feet."
    ];
  } else {
    return [
      "Significant posture corrections needed.",
      "Reset your position and start from neutral stance.",
      "Focus on proper alignment before continuing.",
      "Consider reviewing exercise form tutorials."
    ];
  }
};

export default function PostureScreen() {
  const theme = useTheme();
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [postureScore, setPostureScore] = useState<number | null>(null);
  const [advice, setAdvice] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.messageText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.permissionContainer}>
          <View style={styles.iconGlow}>
            <IconSymbol
              ios_icon_name="camera"
              android_material_icon_name="camera-alt"
              size={64}
              color={colors.text}
            />
          </View>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.messageText}>
            We need your permission to access the camera for real-time posture analysis
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const analyzePosture = () => {
    setIsAnalyzing(true);
    
    // Simulate AI posture analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      const generatedAdvice = getPostureAdvice(score);
      
      setPostureScore(score);
      setAdvice(generatedAdvice);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Posture Check</Text>
          <Text style={styles.subtitle}>AI-powered form analysis</Text>
        </View>

        {/* Camera Card with Liquid Glass */}
        <BlurView intensity={20} tint="dark" style={styles.cameraCard}>
          <View style={styles.glassOverlay} />
          <View style={styles.topEngravedLine} />
          
          <View style={styles.cameraContainer}>
            <CameraView 
              ref={cameraRef}
              style={styles.camera} 
              facing={facing}
            >
              {/* Overlay for posture guidance */}
              <View style={styles.overlay}>
                <View style={[
                  styles.guidanceFrame,
                  postureScore !== null && postureScore < 80 && styles.guidanceFrameWarning
                ]} />
                
                {postureScore !== null && (
                  <View style={styles.scoreOverlay}>
                    <Text style={[
                      styles.scoreText,
                      postureScore >= 90 && styles.scoreExcellent,
                      postureScore >= 80 && postureScore < 90 && styles.scoreGood,
                      postureScore < 80 && styles.scoreWarning
                    ]}>
                      {postureScore}%
                    </Text>
                  </View>
                )}
              </View>
            </CameraView>
          </View>
          
          <View style={styles.bottomEngravedLine} />
        </BlurView>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <View style={styles.controlIconContainer}>
              <IconSymbol
                ios_icon_name="camera-rotate"
                android_material_icon_name="flip-camera-ios"
                size={24}
                color={colors.text}
              />
            </View>
            <Text style={styles.controlButtonText}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]} 
            onPress={analyzePosture}
            disabled={isAnalyzing}
          >
            <IconSymbol
              ios_icon_name="body"
              android_material_icon_name="posture"
              size={20}
              color={colors.background}
            />
            <Text style={styles.analyzeButtonText}>
              {isAnalyzing ? "Analyzing..." : "Analyze Posture"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <View style={styles.controlIconContainer}>
              <IconSymbol
                ios_icon_name="info"
                android_material_icon_name="info"
                size={24}
                color={colors.text}
              />
            </View>
            <Text style={styles.controlButtonText}>Tips</Text>
          </TouchableOpacity>
        </View>

        {/* AI Advice Card */}
        {postureScore !== null && advice.length > 0 && (
          <BlurView intensity={20} tint="dark" style={styles.adviceCard}>
            <View style={styles.glassOverlay} />
            <View style={styles.topEngravedLine} />
            
            <View style={styles.adviceHeader}>
              <View style={styles.adviceIconContainer}>
                <IconSymbol
                  ios_icon_name="checkmark"
                  android_material_icon_name="check"
                  size={24}
                  color={postureScore >= 80 ? colors.text : '#FF6B6B'}
                />
              </View>
              <View style={styles.adviceHeaderText}>
                <Text style={styles.adviceTitle}>Posture Analysis</Text>
                <Text style={styles.adviceScore}>Score: {postureScore}%</Text>
              </View>
            </View>

            <View style={styles.adviceDivider} />

            <Text style={styles.adviceSectionTitle}>AI Recommendations:</Text>
            {advice.map((tip, index) => (
              <View key={index} style={styles.adviceItem}>
                <View style={styles.adviceBullet} />
                <Text style={styles.adviceText}>{tip}</Text>
              </View>
            ))}
            
            <View style={styles.bottomEngravedLine} />
          </BlurView>
        )}

        {/* Instructions */}
        <BlurView intensity={20} tint="dark" style={styles.instructionsCard}>
          <View style={styles.glassOverlay} />
          <Text style={styles.instructionsTitle}>How to use:</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>Position yourself within the frame</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>Stand in your exercise position</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>Tap "Analyze Posture" for AI feedback</Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>4</Text>
            <Text style={styles.instructionText}>Follow on-screen corrections</Text>
          </View>
        </BlurView>

        <View style={{ height: TAB_BAR_HEIGHT + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 60 : 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconGlow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 24,
  },
  messageText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: colors.text,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionButtonText: {
    color: colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cameraCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  topEngravedLine: {
    position: 'absolute',
    top: 0,
    left: 30,
    right: 30,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomEngravedLine: {
    position: 'absolute',
    bottom: 0,
    left: 30,
    right: 30,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cameraContainer: {
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidanceFrame: {
    width: '75%',
    height: '80%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  guidanceFrameWarning: {
    borderColor: 'rgba(255, 107, 107, 0.8)',
  },
  scoreOverlay: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  scoreExcellent: {
    color: '#FFFFFF',
  },
  scoreGood: {
    color: '#DDDDDD',
  },
  scoreWarning: {
    color: '#FF6B6B',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  controlButtonText: {
    fontSize: 11,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
  },
  analyzeButton: {
    flex: 1,
    backgroundColor: colors.text,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    color: colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  adviceCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  adviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  adviceHeaderText: {
    flex: 1,
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  adviceScore: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  adviceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
  adviceSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  adviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  adviceBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text,
    marginTop: 7,
    marginRight: 12,
  },
  adviceText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  instructionsCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
});
