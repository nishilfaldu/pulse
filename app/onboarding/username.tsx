import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { router } from 'expo-router';
import { ArrowRight, Check, ShieldAlert } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UsernameScreen() {
    const [username, setUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Debounce username for avatar generation to avoid flickering too much
    const [debouncedUsername, setDebouncedUsername] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUsername(username);
        }, 300);
        return () => clearTimeout(timer);
    }, [username]);

    const isValid = username.length > 2;
    const isTaken = useQuery(api.users.checkUsername, isValid ? { username } : 'skip');
    const updateUsername = useMutation(api.users.updateUsername);

    const isChecking = isValid && isTaken === undefined;
    const isAvailable = isValid && isTaken === false;

    const handleSubmit = async () => {
        if (!isAvailable || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await updateUsername({ username });
            Vibration.vibrate(50);
            router.replace('/onboarding/permissions');
        } catch (error) {
            console.error('Username Update Error:', error);
            setIsSubmitting(false);
            Vibration.vibrate([50, 100, 50]);
        }
    };

    // DiceBear Pixel Art Avatar
    const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/png?seed=${debouncedUsername || 'placeholder'}&backgroundColor=transparent`;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.stepContainer}>
                    <View style={styles.headerBlock}>
                        <Text style={styles.headerText}>CHOOSE CODENAME.</Text>
                    </View>

                    <View style={styles.contentContainer}>
                        {/* Avatar Display */}
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: avatarUrl }}
                                style={styles.avatar}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.prefixText}>@</Text>
                                <TextInput
                                    style={styles.massiveInput}
                                    placeholder="CODENAME"
                                    placeholderTextColor="rgba(255,255,255,0.5)"
                                    autoFocus
                                    value={username}
                                    onChangeText={(text) => setUsername(text.replace(/[^a-zA-Z0-9_]/g, ''))}
                                    autoCapitalize="none"
                                    maxLength={12}
                                    editable={!isSubmitting}
                                />
                            </View>

                            {/* Validation Status */}
                            <View style={styles.statusContainer}>
                                {isChecking && (
                                    <View style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                        <ActivityIndicator size="small" color="white" />
                                        <Text style={styles.tagText}>CHECKING...</Text>
                                    </View>
                                )}

                                {!isChecking && isValid && !isAvailable && (
                                    <View style={[styles.tag, { backgroundColor: '#FF4444' }]}>
                                        <ShieldAlert size={16} color="white" />
                                        <Text style={styles.tagText}>TAKEN</Text>
                                    </View>
                                )}

                                {!isChecking && isAvailable && (
                                    <View style={[styles.tag, { backgroundColor: '#00FF00' }]}>
                                        <Check size={16} color="black" />
                                        <Text style={[styles.tagText, { color: 'black' }]}>AVAILABLE</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Footer / Button */}
                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            style={[
                                styles.floatingArrow,
                                (!isAvailable || isSubmitting) && styles.disabledArrow
                            ]}
                            onPress={handleSubmit}
                            disabled={!isAvailable || isSubmitting}
                        >
                            <ArrowRight size={32} color="white" strokeWidth={3} />
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
        backgroundColor: '#4A90E2', // Brand Blue
    },
    stepContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    headerBlock: {
        marginTop: 20,
    },
    headerText: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 40,
        paddingTop: 40, // Push content down from header
    },
    avatarContainer: {
        width: 120,
        height: 120,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
    },
    avatar: {
        width: 100,
        height: 100,
    },
    inputWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: 'white',
        paddingVertical: 8,
        width: '100%',
    },
    prefixText: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        marginRight: 4,
    },
    massiveInput: {
        flex: 1,
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        padding: 0, // Remove default padding
    },
    statusContainer: {
        height: 40, // Fixed height to prevent layout jump
        marginTop: 16,
        justifyContent: 'center',
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
        color: 'white',
        textTransform: 'uppercase',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingBottom: 20, // Add some padding for keyboard
    },
    floatingArrow: {
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
    disabledArrow: {
        backgroundColor: '#ccc',
        opacity: 0.5,
    },
});
