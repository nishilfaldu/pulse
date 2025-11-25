import { Eye, Play } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClipStoryProps {
    clip: any;
    onPress?: () => void;
}

export function ClipStory({ clip, onPress }: ClipStoryProps) {
    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={onPress}>
            <View style={styles.card}>
                {/* Video mock background */}
                <View style={[styles.background, { backgroundColor: clip.color }]} />

                {/* Play Icon Overlay */}
                <View style={styles.overlay}>
                    <View style={styles.playButton}>
                        <Play size={12} color="white" fill="white" style={{ marginLeft: 2 }} />
                    </View>
                </View>

                {/* Views */}
                <View style={styles.viewsContainer}>
                    <Eye size={10} color="white" />
                    <Text style={styles.viewsText}>{clip.views}</Text>
                </View>
            </View>
            <Text numberOfLines={2} style={styles.title}>{clip.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 12,
        width: 96,
    },
    card: {
        width: 96,
        height: 160,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: 'black',
        backgroundColor: '#333',
        overflow: 'hidden',
        marginBottom: 8,
        position: 'relative',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewsContainer: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewsText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6B7280',
        paddingHorizontal: 4,
    },
});
