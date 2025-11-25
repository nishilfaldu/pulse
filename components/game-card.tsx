import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, STYLES } from '../constants/theme';

interface GameCardProps {
    title: string;
    description: string;
    bannerColor: string;
    icon: LucideIcon;
    onClick: () => void;
    label?: string;
}

export function GameCard({ title, description, bannerColor, icon: Icon, onClick, label }: GameCardProps) {
    return (
        <TouchableOpacity onPress={onClick} activeOpacity={0.9} style={styles.container}>
            <View style={STYLES.card}>
                {/* Banner */}
                <View style={[styles.banner, { backgroundColor: bannerColor }]}>
                    {label && (
                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>{label}</Text>
                        </View>
                    )}
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Icon size={64} strokeWidth={1.5} color="#1A1A1A" />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>

                    <View style={[STYLES.button, { backgroundColor: bannerColor, alignSelf: 'center' }]}>
                        <Text style={STYLES.buttonText}>Play</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 32,
    },
    banner: {
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderBottomColor: '#1A1A1A',
        borderTopLeftRadius: 21, // card radius (24) - borderWidth (3)
        borderTopRightRadius: 21,
    },
    labelContainer: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 999,
    },
    labelText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 8,
        color: COLORS.text,
        textAlign: 'center',
    },
    description: {
        color: 'rgba(26, 26, 26, 0.7)',
        fontWeight: '600',
        marginBottom: 24,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 16,
        lineHeight: 20,
    },
});
