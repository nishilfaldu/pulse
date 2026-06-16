import { api } from '@/convex/_generated/api';
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from 'convex/react';
import { ArrowRight, Check, Eye, Satellite, ShieldAlert } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from 'react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type Step = 'SPLASH' | 'PHONE' | 'OTP' | 'USERNAME' | 'PERMISSIONS';

export default function OnboardingWizard({ onComplete, initialStep = 'SPLASH' }: { onComplete: () => void, initialStep?: Step }) {
    const [step, setStep] = useState<Step>(initialStep);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState('');
    const [permissions, setPermissions] = useState({ camera: false, notifications: false });

    // Auth
    const { signIn } = useAuthActions();

    const handleNext = () => {
        Vibration.vibrate(50); // Haptic snap
        if (step === 'SPLASH') setStep('PHONE');
        else if (step === 'PHONE') setStep('OTP');
        else if (step === 'OTP') setStep('USERNAME');
        else if (step === 'USERNAME') setStep('PERMISSIONS');
        else if (step === 'PERMISSIONS') onComplete();
    };

    // Render Step
    const renderStep = () => {
        switch (step) {
            case 'SPLASH': return <SplashStep onNext={handleNext} />;
            case 'PHONE': return <PhoneStep onNext={handleNext} value={phoneNumber} onChange={setPhoneNumber} />;
            case 'OTP': return <OTPStep onNext={handleNext} value={otp} onChange={setOtp} phoneNumber={phoneNumber} signIn={signIn} />;
            case 'USERNAME': return <UsernameStep onNext={handleNext} value={username} onChange={setUsername} />;
            case 'PERMISSIONS': return <PermissionsStep onNext={handleNext} permissions={permissions} setPermissions={setPermissions} />;
            default: return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: getBackgroundColor(step) }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <Animated.View
                    key={step}
                    entering={SlideInRight.springify().damping(20)}
                    exiting={SlideOutLeft.duration(200)}
                    style={{ flex: 1 }}
                >
                    {renderStep()}
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

function getBackgroundColor(step: Step) {
    switch (step) {
        case 'SPLASH': return '#F8E71C'; // Hazard Yellow
        case 'PHONE': return '#FFFFFF';
        case 'OTP': return '#000000';
        case 'USERNAME': return '#4A90E2'; // Brand Blue
        case 'PERMISSIONS': return '#FFFFFF';
        default: return '#FFFFFF';
    }
}

// --- STEPS ---

function SplashStep({ onNext }: { onNext: () => void }) {
    return (
        <View style={styles.stepContainer}>
            <View style={styles.centerContent}>
                <Text style={styles.logoText}>IRL</Text>
            </View>
            <TouchableOpacity style={styles.mainButton} onPress={onNext} activeOpacity={0.9}>
                <Text style={styles.mainButtonText}>INITIALIZE</Text>
            </TouchableOpacity>
        </View>
    );
}

function PhoneStep({ onNext, value, onChange }: { onNext: () => void, value: string, onChange: (v: string) => void }) {
    const isValid = value.length >= 10;

    return (
        <View style={styles.stepContainer}>
            <View style={styles.headerBlock}>
                <Text style={styles.headerText}>IDENTIFY YOURSELF</Text>
                <Text style={styles.subHeaderText}>We need a number to send the missions.</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.massiveInput}
                    placeholder="(000) 000-0000"
                    placeholderTextColor="#CCC"
                    keyboardType="number-pad"
                    autoFocus
                    value={value}
                    onChangeText={onChange}
                />
            </View>

            {isValid && (
                <TouchableOpacity style={styles.floatingArrow} onPress={onNext}>
                    <ArrowRight size={32} color="white" strokeWidth={3} />
                </TouchableOpacity>
            )}
        </View>
    );
}

function OTPStep({ onNext, value, onChange, phoneNumber, signIn }: { onNext: () => void, value: string, onChange: (v: string) => void, phoneNumber: string, signIn: any }) {
    const [isVerifying, setIsVerifying] = useState(false);

    // Auto-submit when 6 digits
    useEffect(() => {
        if (value.length === 6 && !isVerifying) {
            handleVerify();
        }
    }, [value]);

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            await signIn("phoneNumber", { phoneNumber, code: value });
            Vibration.vibrate(50);
            onNext();
        } catch (err) {
            console.error("OTP Verify Error:", err);
            setIsVerifying(false);
            Vibration.vibrate([50, 100, 50]); // Error pattern
            // TODO: Show error UI
        }
    };

    // Trigger OTP send on mount
    useEffect(() => {
        signIn("phoneNumber", { phoneNumber })
            .catch((err: any) => console.error("OTP Send Error:", err));
    }, []);

    return (
        <View style={styles.stepContainer}>
            <View style={styles.headerBlock}>
                <Text style={[styles.headerText, { color: 'white' }]}>VERIFY PROTOCOL</Text>
                <Text style={[styles.subHeaderText, { color: '#888' }]}>Enter the code sent to {phoneNumber}</Text>
            </View>

            <View style={styles.otpContainer}>
                <TextInput
                    style={styles.hiddenInput}
                    keyboardType="number-pad"
                    autoFocus
                    value={value}
                    onChangeText={onChange}
                    maxLength={6}
                />
                <View style={styles.otpBoxes}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <View key={i} style={[
                            styles.otpBox,
                            value.length > i && styles.otpBoxFilled,
                            value.length === 6 && styles.otpBoxSuccess
                        ]}>
                            <Text style={styles.otpText}>{value[i] || ''}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

function UsernameStep({ onNext, value, onChange }: { onNext: () => void, value: string, onChange: (v: string) => void }) {
    const isValid = value.length > 2;

    // Convex
    const isTaken = useQuery(api.users.checkUsername, isValid ? { username: value } : "skip");
    const updateUsername = useMutation(api.users.updateUsername);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAvailable = isValid && isTaken === false;

    const handleSubmit = async () => {
        if (!isAvailable || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await updateUsername({ username: value });
            onNext();
        } catch (err) {
            console.error("Username Update Error:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.stepContainer}>
            <View style={styles.headerBlock}>
                <Text style={[styles.headerText, { color: 'white' }]}>CHOOSE CODENAME</Text>
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.prefixContainer}>
                    <Text style={styles.prefixText}>@</Text>
                </View>
                <TextInput
                    style={[styles.massiveInput, { color: 'white', borderBottomColor: 'white' }]}
                    placeholder="CODENAME"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    autoFocus
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="characters"
                    maxLength={12}
                    editable={!isSubmitting}
                />
            </View>

            {isValid && isTaken !== undefined && (
                <View style={styles.availabilityTag}>
                    {isAvailable ? (
                        <View style={[styles.tag, { backgroundColor: '#00FF00' }]}>
                            <Check size={16} color="black" />
                            <Text style={styles.tagText}>AVAILABLE</Text>
                        </View>
                    ) : (
                        <View style={[styles.tag, { backgroundColor: '#FF4444' }]}>
                            <ShieldAlert size={16} color="white" />
                            <Text style={[styles.tagText, { color: 'white' }]}>TAKEN</Text>
                        </View>
                    )}
                </View>
            )}

            {isValid && isAvailable && (
                <TouchableOpacity style={styles.floatingArrow} onPress={handleSubmit} disabled={isSubmitting}>
                    <ArrowRight size={32} color="white" strokeWidth={3} />
                </TouchableOpacity>
            )}
        </View>
    );
}

function PermissionsStep({ onNext, permissions, setPermissions }: { onNext: () => void, permissions: any, setPermissions: any }) {
    const toggleCamera = () => setPermissions((p: any) => ({ ...p, camera: !p.camera }));
    const toggleNotifs = () => setPermissions((p: any) => ({ ...p, notifications: !p.notifications }));

    const allGranted = permissions.camera && permissions.notifications;

    return (
        <View style={styles.stepContainer}>
            <View style={styles.contractContainer}>
                <Text style={styles.contractHeader}>MISSION REQUIREMENTS</Text>

                <View style={styles.toggleRow}>
                    <View style={styles.toggleInfo}>
                        <Eye size={24} color="black" />
                        <View>
                            <Text style={styles.toggleTitle}>VISUALS</Text>
                            <Text style={styles.toggleDesc}>Required to capture proof.</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.toggleSwitch, permissions.camera && styles.toggleActive]}
                        onPress={toggleCamera}
                    >
                        <View style={[styles.toggleKnob, permissions.camera && styles.toggleKnobActive]} />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.toggleRow}>
                    <View style={styles.toggleInfo}>
                        <Satellite size={24} color="black" />
                        <View>
                            <Text style={styles.toggleTitle}>INTEL</Text>
                            <Text style={styles.toggleDesc}>Required for the 12:00 PM drop.</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.toggleSwitch, permissions.notifications && styles.toggleActive]}
                        onPress={toggleNotifs}
                    >
                        <View style={[styles.toggleKnob, permissions.notifications && styles.toggleKnobActive]} />
                    </TouchableOpacity>
                </View>
            </View>

            {allGranted && (
                <TouchableOpacity style={styles.stampButton} onPress={onNext}>
                    <Text style={styles.stampText}>SIGN CONTRACT</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stepContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 64,
        fontWeight: '900',
        color: 'black',
        letterSpacing: -2,
    },
    subLogoText: {
        fontSize: 24,
        fontWeight: '900',
        color: 'black',
        letterSpacing: 8,
    },
    mainButton: {
        backgroundColor: 'black',
        paddingVertical: 24,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 5,
    },
    mainButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 2,
    },
    headerBlock: {
        marginTop: 40,
    },
    headerText: {
        fontSize: 32,
        fontWeight: '900',
        color: 'black',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    inputContainer: {
        marginTop: 40,
    },
    massiveInput: {
        fontSize: 32,
        fontWeight: '900',
        color: 'black',
        borderBottomWidth: 4,
        borderBottomColor: 'black',
        paddingVertical: 16,
    },
    floatingArrow: {
        position: 'absolute',
        right: 0,
        bottom: 300, // Approximate keyboard height
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FF7E47',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 5,
    },
    // OTP
    otpContainer: {
        marginTop: 40,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    otpBoxes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    otpBox: {
        width: 48,
        height: 64,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    otpBoxFilled: {
        borderColor: '#FF7E47',
        borderStyle: 'solid',
        backgroundColor: 'rgba(255, 126, 71, 0.1)',
    },
    otpBoxSuccess: {
        borderColor: '#00FF00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
    },
    otpText: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
    },
    // Username
    prefixContainer: {
        position: 'absolute',
        left: 0,
        top: 20,
    },
    prefixText: {
        fontSize: 32,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.5)',
    },
    availabilityTag: {
        marginTop: 24,
        flexDirection: 'row',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        gap: 6,
    },
    tagText: {
        fontWeight: '900',
        fontSize: 12,
    },
    // Permissions
    contractContainer: {
        borderWidth: 2,
        borderColor: 'black',
        borderStyle: 'dashed',
        padding: 24,
        marginTop: 40,
        backgroundColor: 'white',
    },
    contractHeader: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 32,
        textAlign: 'center',
        textDecorationLine: 'underline',
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
        flex: 1,
    },
    toggleTitle: {
        fontWeight: '900',
        fontSize: 16,
    },
    toggleDesc: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    toggleSwitch: {
        width: 60,
        height: 32,
        backgroundColor: '#DDD',
        borderRadius: 16,
        padding: 4,
    },
    toggleActive: {
        backgroundColor: 'black',
    },
    toggleKnob: {
        width: 24,
        height: 24,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    toggleKnobActive: {
        alignSelf: 'flex-end',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginBottom: 24,
    },
    stampButton: {
        marginTop: 40,
        backgroundColor: 'black',
        paddingVertical: 20,
        alignItems: 'center',
        transform: [{ rotate: '-2deg' }],
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    stampText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 2,
    },
});
