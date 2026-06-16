import { usePushNotifications } from '@/lib/usePushNotifications';
import { Camera } from 'expo-camera';
import { router } from 'expo-router';
import { Eye, Satellite } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PermissionsScreen() {
    const [permissions, setPermissions] = useState({ camera: false, notifications: false });
    const { registerForPushNotifications } = usePushNotifications();
    const [isStamping, setIsStamping] = useState(false);

    // Animation values
    const shakeAnimCamera = useRef(new Animated.Value(0)).current;
    const shakeAnimNotif = useRef(new Animated.Value(0)).current;
    const stampScale = useRef(new Animated.Value(2)).current;
    const stampOpacity = useRef(new Animated.Value(0)).current;

    const shake = (anim: Animated.Value) => {
        Animated.sequence([
            Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(anim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
        Vibration.vibrate([0, 50, 50, 50]);
    };

    const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
            setPermissions((p) => ({ ...p, camera: true }));
            Vibration.vibrate(50);
        } else {
            setPermissions((p) => ({ ...p, camera: false }));
            shake(shakeAnimCamera);
        }
    };

    const requestNotificationPermission = async () => {
        const success = await registerForPushNotifications();
        if (success) {
            setPermissions((p) => ({ ...p, notifications: true }));
            Vibration.vibrate(50);
        } else {
            setPermissions((p) => ({ ...p, notifications: false }));
            shake(shakeAnimNotif);
        }
    };

    const allGranted = permissions.camera && permissions.notifications;

    const handleSignContract = () => {
        if (isStamping) return;
        setIsStamping(true);
        Vibration.vibrate(100);

        // Stamp Animation
        Animated.parallel([
            Animated.timing(stampScale, {
                toValue: 1,
                duration: 200,
                easing: Easing.bounce,
                useNativeDriver: true,
            }),
            Animated.timing(stampOpacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Wait a moment then navigate
            setTimeout(() => {
                router.replace('/gate');
            }, 800);
        });
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.stepContainer}>
                    <View style={styles.contractContainer}>
                        <Text style={styles.contractHeader}>MISSION REQUIREMENTS.</Text>

                        {/* Camera Toggle */}
                        <Animated.View style={[styles.toggleRow, { transform: [{ translateX: shakeAnimCamera }] }]}>
                            <View style={styles.toggleInfo}>
                                <Eye size={32} color="black" strokeWidth={2.5} />
                                <View>
                                    <Text style={styles.toggleTitle}>VISUALS</Text>
                                    <Text style={styles.toggleDesc}>Required to capture proof.</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.toggleSwitch, permissions.camera && styles.toggleActive]}
                                onPress={requestCameraPermission}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.toggleKnob, permissions.camera && styles.toggleKnobActive]} />
                            </TouchableOpacity>
                        </Animated.View>

                        <View style={styles.divider} />

                        {/* Notifications Toggle */}
                        <Animated.View style={[styles.toggleRow, { transform: [{ translateX: shakeAnimNotif }] }]}>
                            <View style={styles.toggleInfo}>
                                <Satellite size={32} color="black" strokeWidth={2.5} />
                                <View>
                                    <Text style={styles.toggleTitle}>INTEL</Text>
                                    <Text style={styles.toggleDesc}>Required for the 12:00 PM drop.</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.toggleSwitch, permissions.notifications && styles.toggleActive]}
                                onPress={requestNotificationPermission}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.toggleKnob, permissions.notifications && styles.toggleKnobActive]} />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {/* Sign Button & Stamp */}
                    <View style={styles.footerContainer}>
                        {allGranted && !isStamping && (
                            <TouchableOpacity style={styles.signButton} onPress={handleSignContract}>
                                <Text style={styles.signButtonText}>SIGN CONTRACT</Text>
                            </TouchableOpacity>
                        )}

                        {/* Stamp Overlay */}
                        <Animated.View
                            style={[
                                styles.stampContainer,
                                {
                                    opacity: stampOpacity,
                                    transform: [{ scale: stampScale }, { rotate: '-15deg' }]
                                }
                            ]}
                            pointerEvents="none"
                        >
                            <View style={styles.stampBorder}>
                                <Text style={styles.stampText}>APPROVED</Text>
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    stepContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    contractContainer: {
        borderWidth: 4,
        borderColor: 'black',
        borderStyle: 'dashed',
        padding: 24,
        marginTop: 40,
        backgroundColor: 'white',
    },
    contractHeader: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 40,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    toggleInfo: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        flex: 1,
    },
    toggleTitle: {
        fontWeight: '900',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    toggleDesc: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
        fontWeight: '500',
    },
    toggleSwitch: {
        width: 60,
        height: 34,
        backgroundColor: '#E0E0E0',
        borderRadius: 17,
        padding: 3,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginLeft: 16,
    },
    toggleActive: {
        backgroundColor: 'black',
        borderColor: 'black',
    },
    toggleKnob: {
        width: 24,
        height: 24,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    toggleKnobActive: {
        alignSelf: 'flex-end',
    },
    divider: {
        height: 2,
        backgroundColor: '#F0F0F0',
        marginBottom: 24,
    },
    footerContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    signButton: {
        backgroundColor: 'black',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 0, // Brutalist
        borderWidth: 0,
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 5,
    },
    signButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    stampContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stampBorder: {
        borderWidth: 8,
        borderColor: '#FF4444', // Red Ink
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    stampText: {
        color: '#FF4444',
        fontSize: 32,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 4,
    },
});
