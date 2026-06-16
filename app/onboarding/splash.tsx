import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
    const handleNext = () => {
        Vibration.vibrate(50);
        router.replace('/onboarding/email');
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.stepContainer}>
                    <View style={styles.centerContent}>
                        <Text style={styles.logoText}>IRL</Text>
                    </View>
                    <TouchableOpacity style={styles.mainButton} onPress={handleNext} activeOpacity={0.9}>
                        <Text style={styles.mainButtonText}>INITIALIZE</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8E71C',
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
});
