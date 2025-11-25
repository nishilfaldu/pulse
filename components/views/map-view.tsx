import { Zap } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { BUILDINGS } from '../../constants/data';
import { STYLES } from '../../constants/theme';

// Mock students for map
const STUDENTS = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 300,
    color: Math.random() > 0.5 ? '#FF7E47' : '#4A90E2'
}));

export function MapView() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Live Map</Text>
                <View style={styles.activeBadge}>
                    <Text style={styles.activeText}>124 Active</Text>
                </View>
            </View>

            <View style={styles.mapCard}>
                <View style={styles.mapContainer}>
                    {/* Abstract Map using SVG */}
                    <Svg height="100%" width="100%" viewBox="0 0 340 340">
                        {/* Grid Lines */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <React.Fragment key={i}>
                                <Rect x={i * 30} y="0" width="1" height="340" fill="#E5E5E5" />
                                <Rect x="0" y={i * 30} width="340" height="1" fill="#E5E5E5" />
                            </React.Fragment>
                        ))}

                        {/* Buildings */}
                        {BUILDINGS.map((b, i) => (
                            <Rect
                                key={i}
                                x={b.x}
                                y={b.y}
                                width={b.w}
                                height={b.h}
                                fill={b.color}
                                stroke="#1A1A1A"
                                strokeWidth="3"
                                rx="12"
                            />
                        ))}

                        {/* Students */}
                        {STUDENTS.map((s) => (
                            <Circle
                                key={s.id}
                                cx={s.x}
                                cy={s.y}
                                r="5"
                                fill={s.color}
                                stroke="#1A1A1A"
                                strokeWidth="2"
                            />
                        ))}
                    </Svg>

                    {/* Building Labels (Overlay for better text rendering) */}
                    {BUILDINGS.map((b, i) => (
                        <Text
                            key={i}
                            style={[styles.buildingLabel, { left: b.x + 10, top: b.y + 10 }]}
                        >
                            {b.name}
                        </Text>
                    ))}
                </View>

                {/* Overlay UI on Map */}
                <View style={styles.mapOverlay}>
                    <Text style={styles.overlayLabel}>Trending</Text>
                    <Text style={styles.overlayText}>📍 TUC is busy</Text>
                </View>
            </View>

            <View style={[STYLES.flatCard, styles.infoCard]}>
                <View style={styles.infoHeader}>
                    <View style={styles.zapIconCircle}>
                        <Zap size={16} color="white" />
                    </View>
                    <Text style={styles.infoTitle}>Nearby Energy</Text>
                </View>
                <Text style={styles.infoText}>
                    3 serendipity clusters detected near <Text style={styles.highlightText}>DAAP</Text>.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 100,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
    },
    activeBadge: {
        backgroundColor: '#7ED321',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'black',
    },
    activeText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    mapCard: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 24,
        borderWidth: 3,
        borderColor: 'black',
        shadowColor: 'black',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    mapContainer: {
        flex: 1,
    },
    buildingLabel: {
        position: 'absolute',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
    },
    overlayLabel: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#6B7280',
    },
    overlayText: {
        fontSize: 14,
        fontWeight: '900',
    },
    infoCard: {
        padding: 16,
        backgroundColor: '#FFF8F0',
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    zapIconCircle: {
        backgroundColor: '#FF7E47',
        padding: 8,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'black',
    },
    infoTitle: {
        fontWeight: '900',
        fontSize: 16,
    },
    infoText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    highlightText: {
        color: 'black',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textDecorationColor: '#FF7E47',
    },
});
