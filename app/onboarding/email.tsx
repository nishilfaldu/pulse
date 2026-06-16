import { authClient } from '@/lib/auth-client';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmailScreen() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValid = email.includes('@') && email.includes('.');

    const handleNext = async () => {
        if (!isValid || isSubmitting) return;

        Vibration.vibrate(50);
        setIsSubmitting(true);

        try {
            // Send OTP via Better Auth
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: 'sign-in'
            });

            // Navigate to OTP screen
            router.push({
                pathname: '/onboarding/otp',
                params: { email }
            });
        } catch (error) {
            console.error('Error sending OTP:', error);
            setIsSubmitting(false);
            Vibration.vibrate([50, 100, 50]);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.stepContainer}>
                    <View style={styles.headerBlock}>
                        <Text style={styles.headerText}>IDENTIFY YOURSELF</Text>
                        <Text style={styles.subHeaderText}>We need your email to send the missions.</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.massiveInput}
                            placeholder="email@example.com"
                            placeholderTextColor="#CCC"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus
                            value={email}
                            onChangeText={setEmail}
                            editable={!isSubmitting}
                        />
                    </View>

                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            style={[
                                styles.floatingArrow,
                                { backgroundColor: isValid ? '#FF7E47' : '#E0E0E0' }
                            ]}
                            onPress={handleNext}
                            disabled={!isValid || isSubmitting}
                        >
                            <ArrowRight size={32} color={isValid ? "white" : "#999"} strokeWidth={3} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
        flex: 1,
    },
    massiveInput: {
        fontSize: 32,
        fontWeight: '900',
        color: 'black',
        borderBottomWidth: 4,
        borderBottomColor: 'black',
        paddingVertical: 16,
    },
    footerContainer: {
        alignItems: 'flex-end',
        marginBottom: 0,
    },
    floatingArrow: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 5,
    },
});
