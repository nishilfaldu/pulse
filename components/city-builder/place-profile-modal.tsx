import { MapPin, Star, User, X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Place } from '../../constants/city-builder-data';
import { COLORS, STYLES } from '../../constants/theme';

interface PlaceProfileModalProps {
    visible: boolean;
    place: Place | null;
    onClose: () => void;
}

export function PlaceProfileModal({ visible, place, onClose }: PlaceProfileModalProps) {
    if (!place) return null;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header Image / Color Block */}
                    <View style={[styles.banner, { backgroundColor: getPlaceColor(place.type) }]}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <X color="white" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.placeIcon}>{place.name[0]}</Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.headerInfo}>
                            <Text style={styles.title}>{place.name}</Text>
                            <View style={styles.founderRow}>
                                <User size={14} color="#666" />
                                <Text style={styles.founderText}>Founded by {place.founder}</Text>
                            </View>
                        </View>

                        {/* Vibe Tags */}
                        <View style={styles.tagsRow}>
                            <View style={styles.typeTag}>
                                <MapPin size={12} color="white" />
                                <Text style={styles.typeTagText}>{place.type}</Text>
                            </View>
                            {place.vibeTags.map((tag, i) => (
                                <View key={i} style={styles.vibeTag}>
                                    <Text style={styles.vibeTagText}>#{tag}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Tabs (Simplified for now) */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Story</Text>
                            <Text style={styles.storyText}>{place.story}</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Reviews ({place.reviews.length})</Text>
                            {place.reviews.length > 0 ? (
                                place.reviews.map(review => (
                                    <View key={review.id} style={styles.reviewCard}>
                                        <View style={styles.reviewHeader}>
                                            <Text style={styles.reviewUser}>{review.user}</Text>
                                            <View style={styles.rating}>
                                                <Star size={12} fill={COLORS.primary.yellow} color={COLORS.primary.yellow} />
                                                <Text style={styles.ratingText}>{review.rating}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.reviewText}>{review.text}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No reviews yet. Be the first!</Text>
                            )}
                        </View>

                        <TouchableOpacity style={[STYLES.button, styles.actionButton]}>
                            <Text style={STYLES.buttonText}>Check In</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const getPlaceColor = (type: Place['type']) => {
    switch (type) {
        case 'restaurant': return COLORS.primary.orange;
        case 'park': return COLORS.primary.green;
        case 'shop': return COLORS.primary.blue;
        case 'landmark': return COLORS.primary.purple;
        case 'hidden-gem': return COLORS.primary.yellow;
        default: return COLORS.primary.black;
    }
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.bg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
        overflow: 'hidden',
    },
    banner: {
        height: 150,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 8,
        borderRadius: 999,
    },
    placeIcon: {
        fontSize: 64,
        fontWeight: '900',
        color: 'white',
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    headerInfo: {
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: 4,
    },
    founderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    founderText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    typeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.text,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
    },
    typeTagText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    vibeTag: {
        borderWidth: 2,
        borderColor: COLORS.border,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
    },
    vibeTagText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 12,
    },
    storyText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    reviewCard: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.border,
        marginBottom: 8,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    reviewUser: {
        fontWeight: 'bold',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontWeight: 'bold',
    },
    reviewText: {
        color: '#444',
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#666',
    },
    actionButton: {
        backgroundColor: COLORS.primary.blue,
    }
});
