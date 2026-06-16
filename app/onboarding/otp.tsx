import { authClient } from '@/lib/auth-client';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OTPScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6 || isVerifying) return;

        setIsVerifying(true);
        try {
            await authClient.signIn.emailOtp({
                email: email!,
                otp
            });

            Vibration.vibrate(50);

            // Small delay for session state to propagate
            await new Promise(resolve => setTimeout(resolve, 300));
            router.replace('/onboarding/username');
        } catch (error) {
            console.error('OTP Verify Error:', error);
            setIsVerifying(false);
            Vibration.vibrate([50, 100, 50]);
            setOtp('');
        }
    };

    // Auto-submit when 6 digits entered
    useEffect(() => {
        if (otp.length === 6 && !isVerifying) {
            handleVerify();
        }
    }, [otp]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.stepContainer}>
                    <View style={styles.headerBlock}>
                        <Text style={styles.headerText}>VERIFY PROTOCOL</Text>
                        <Text style={styles.subHeaderText}>
                            Enter the code sent to {email}
                        </Text>
                    </View>

                    <View style={styles.otpContainer}>
                        <TextInput
                            style={styles.hiddenInput}
                            keyboardType="number-pad"
                            autoFocus
                            value={otp}
                            onChangeText={setOtp}
                            maxLength={6}
                            editable={!isVerifying}
                        />
                        <View style={styles.otpBoxes}>
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.otpBox,
                                        otp.length > i && styles.otpBoxFilled,
                                        otp.length === 6 && styles.otpBoxSuccess,
                                    ]}
                                >
                                    <Text style={styles.otpText}>{otp[i] || ''}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    stepContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    headerBlock: {
        marginTop: 40,
    },
    headerText: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#888',
        fontWeight: '500',
    },
    otpContainer: {
        marginTop: 40,
        flex: 1, // Push content up/down
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
});
