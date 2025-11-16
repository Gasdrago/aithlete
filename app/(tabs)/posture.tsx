
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function PostureScreen() {
  const theme = useTheme();
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [postureScore, setPostureScore] = useState<number | null>(null);
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
          <IconSymbol
            ios_icon_name="camera.fill"
            android_material_icon_name="camera_alt"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.messageText}>
            We need your permission to access the camera for posture analysis
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
      setPostureScore(score);
      setIsAnalyzing(false);
      
      Alert.alert(
        "Posture Analysis Complete",
        `Your posture score: ${score}%\n\n${
          score >= 90 ? "Excellent form! Keep it up!" :
          score >= 80 ? "Good posture with minor adjustments needed." :
          "Consider adjusting your form for better results."
        }`,
        [{ text: "OK" }]
      );
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Posture Check</Text>
        <Text style={styles.subtitle}>Real-time form analysis</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
        >
          {/* Overlay for posture guidance */}
          <View style={styles.overlay}>
            <View style={styles.guidanceFrame} />
            {postureScore !== null && (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{postureScore}%</Text>
                <Text style={styles.scoreLabel}>Posture Score</Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
          <IconSymbol
            ios_icon_name="camera.rotate"
            android_material_icon_name="flip_camera_ios"
            size={28}
            color={colors.text}
          />
          <Text style={styles.controlButtonText}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]} 
          onPress={analyzePosture}
          disabled={isAnalyzing}
        >
          <Text style={styles.analyzeButtonText}>
            {isAnalyzing ? "Analyzing..." : "Analyze Posture"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <IconSymbol
            ios_icon_name="info.circle"
            android_material_icon_name="info"
            size={28}
            color={colors.text}
          />
          <Text style={styles.controlButtonText}>Tips</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to use:</Text>
        <Text style={styles.instructionsText}>
          - Position yourself in the frame{'\n'}
          - Stand in your exercise position{'\n'}
          - Tap "Analyze Posture" for feedback{'\n'}
          - Follow on-screen corrections
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
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
  messageText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: colors.text,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  permissionButtonText: {
    color: colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
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
    width: '80%',
    height: '70%',
    borderWidth: 2,
    borderColor: colors.text,
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  controlButtonText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  analyzeButton: {
    flex: 1,
    backgroundColor: colors.text,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    color: colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  instructions: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
});
