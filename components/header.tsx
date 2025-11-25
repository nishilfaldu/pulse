import { Flame, Lock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';

interface HeaderProps {
    onProfileClick: () => void;
    onVaultClick: () => void;
}

export function Header({ onProfileClick, onVaultClick }: HeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.title}>PULSE</Text>

                <View style={styles.actions}>
                    {/* The Vault Widget */}
                    <TouchableOpacity onPress={onVaultClick} style={styles.vaultWidget} activeOpacity={0.8}>
                        <Lock size={14} color="#F8E71C" />
                        <View>
                            <Text style={styles.vaultLabel}>City Goal</Text>
                            <Text style={styles.vaultValue}>84%</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Profile */}
                    <TouchableOpacity onPress={onProfileClick} style={styles.profileContainer} activeOpacity={0.8}>
                        {/* Streak Flame */}
                        <View style={styles.streakBadge}>
                            <Flame size={8} color="white" fill="white" />
                            <Text style={styles.streakText}>12</Text>
                        </View>
                        <View style={styles.avatar}>
                            <View style={styles.avatarDot} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.subtitle}>Underground City Pulse</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 60, // Safe area approximation
        paddingBottom: 24,
        backgroundColor: COLORS.bg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
        color: COLORS.text,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    vaultWidget: {
        backgroundColor: '#1A1A1A',
        height: 40,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#1A1A1A',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    vaultLabel: {
        fontSize: 8,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#9CA3AF',
    },
    vaultValue: {
        fontSize: 12,
        fontWeight: '900',
        color: '#F8E71C',
    },
    profileContainer: {
        position: 'relative',
    },
    streakBadge: {
        position: 'absolute',
        top: -8,
        left: -8,
        backgroundColor: '#FF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
        zIndex: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    streakText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: '#1A1A1A',
        borderWidth: 3,
        borderColor: '#1A1A1A',
        overflow: 'hidden',
        position: 'relative',
    },
    avatarDot: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#F8E71C',
        borderRadius: 999,
        transform: [{ translateX: 4 }, { translateY: 4 }],
    },
    subtitle: {
        color: 'rgba(26, 26, 26, 0.6)',
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 4,
    },
});
