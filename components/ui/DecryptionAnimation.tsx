import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Lock } from 'lucide-react-native';

interface DecryptionAnimationProps {
  progress: number;
  phase: 'uploading' | 'processing' | 'complete';
}

export function DecryptionAnimation({ progress, phase }: DecryptionAnimationProps) {
  const shakeX = useSharedValue(0);
  const lockScale = useSharedValue(1);

  useEffect(() => {
    if (phase === 'complete') {
      // Explode animation
      lockScale.value = withSpring(0, { damping: 10 });
    } else if (progress > 0) {
      // Shake animation while uploading
      shakeX.value = withRepeat(
        withSequence(
          withSpring(-10, { damping: 2 }),
          withSpring(10, { damping: 2 }),
          withSpring(0, { damping: 2 })
        ),
        -1
      );
    }
  }, [progress, phase]);

  const lockAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeX.value },
      { scale: lockScale.value }
    ],
  }));

  const getPhaseText = () => {
    if (phase === 'complete') return 'ACCESS GRANTED';
    if (phase === 'processing') return `VERIFYING... [${Math.round(progress)}%]`;
    return `UPLOADING PROOF... [${Math.round(progress)}%]`;
  };

  const getPhaseColor = () => {
    if (phase === 'complete') return '#00FF00';
    return '#FF4444';
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.lockContainer, lockAnimatedStyle]}>
        <Lock size={100} color={getPhaseColor()} />
      </Animated.View>

      <Text style={[styles.phaseText, { color: getPhaseColor() }]}>
        {getPhaseText()}
      </Text>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Matrix-style decoration */}
      <View style={styles.decoration}>
        <Text style={styles.decorationText}>{'> '.repeat(20)}</Text>
        <Text style={styles.decorationText}>{'< '.repeat(20)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockContainer: {
    marginBottom: 40,
  },
  phaseText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 40,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF4444',
  },
  decoration: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    opacity: 0.2,
  },
  decorationText: {
    color: '#00FF00',
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
