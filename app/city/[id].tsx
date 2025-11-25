import { PlaceProfileModal } from '@/components/city-builder/place-profile-modal';
import { CITIES, INITIAL_PLACES, Place } from '@/constants/city-builder-data';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Helper to group places by type
const getPlacesByType = (places: Place[]) => {
    const groups: Record<string, Place[]> = {
        'restaurant': [],
        'park': [],
        'shop': [],
        'landmark': [],
        'hidden-gem': [],
        'other': [],
    };

    places.forEach(p => {
        if (groups[p.type]) {
            groups[p.type].push(p);
        } else {
            groups['other'].push(p);
        }
    });

    return groups;
};

const CATEGORY_LABELS: Record<string, string> = {
    'restaurant': 'Restaurants & Cafés',
    'park': 'Parks & Outdoors',
    'shop': 'Shops & Boutiques',
    'landmark': 'Landmarks',
    'hidden-gem': 'Hidden Gems',
    'other': 'More Spots',
};

const CATEGORY_COLORS: Record<string, string> = {
    'restaurant': COLORS.primary.orange,
    'park': COLORS.primary.green,
    'shop': COLORS.primary.blue,
    'landmark': COLORS.primary.purple,
    'hidden-gem': COLORS.primary.yellow,
    'other': COLORS.primary.black,
};

export default function CityStacksScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const selectedCity = CITIES.find(c => c.id === id);
    // In a real app, we'd filter by cityId here. For mock data, we'll just use all initial places for demo if they match or just all of them to populate.
    // Let's filter by cityId to be correct, assuming mock data has cityIds.
    const cityPlaces = INITIAL_PLACES.filter(p => p.cityId === id);

    const placesByType = getPlacesByType(cityPlaces);
    const categories = Object.keys(placesByType).filter(type => placesByType[type].length > 0);

    // State
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    const handlePlacePress = (place: Place) => {
        setSelectedPlace(place);
        setProfileModalVisible(true);
    };

    if (!selectedCity) return <View style={styles.container}><Text>City not found</Text></View>;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{selectedCity.name}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.subtitle}>Explore Collections</Text>

                <View style={styles.stacksContainer}>
                    {categories.map((type) => {
                        const count = placesByType[type].length;
                        const color = CATEGORY_COLORS[type] || COLORS.primary.black;

                        return (
                            <TouchableOpacity
                                key={type}
                                style={styles.stackWrapper}
                                onPress={() => setSelectedCategory(type)}
                                activeOpacity={0.9}
                            >
                                {/* Stack Effect Layers */}
                                <View style={[styles.stackLayer, styles.stackLayer2, { backgroundColor: color, opacity: 0.3 }]} />
                                <View style={[styles.stackLayer, styles.stackLayer1, { backgroundColor: color, opacity: 0.6 }]} />

                                {/* Main Card */}
                                <View style={styles.stackCard}>
                                    <View style={[styles.iconBox, { backgroundColor: color }]}>
                                        <Text style={styles.iconText}>{count}</Text>
                                    </View>
                                    <View style={styles.stackContent}>
                                        <Text style={styles.stackTitle}>{CATEGORY_LABELS[type]}</Text>
                                        <Text style={styles.stackSubtitle}>{count} locations</Text>
                                    </View>
                                    <View style={styles.arrowBox}>
                                        <ArrowLeft size={20} color={COLORS.text} style={{ transform: [{ rotate: '180deg' }] }} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Category Modal (The "Deck" of places) */}
            <Modal
                visible={!!selectedCategory}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setSelectedCategory(null)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {selectedCategory ? CATEGORY_LABELS[selectedCategory] : ''}
                        </Text>
                        <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.closeButton}>
                            <X size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={selectedCategory ? placesByType[selectedCategory] : []}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.placesList}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.placeCard} onPress={() => handlePlacePress(item)}>
                                <View style={styles.placeCardHeader}>
                                    <Text style={styles.placeName}>{item.name}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Star size={12} color="white" fill="white" />
                                        <Text style={styles.ratingText}>4.8</Text>
                                    </View>
                                </View>
                                <Text style={styles.placeStory} numberOfLines={2}>{item.story}</Text>
                                <View style={styles.placeFooter}>
                                    <View style={styles.founderBadge}>
                                        <Text style={styles.founderText}>Found by {item.founder}</Text>
                                    </View>
                                    <View style={styles.vibeTags}>
                                        {item.vibeTags.slice(0, 2).map((tag, i) => (
                                            <Text key={i} style={styles.vibeTag}>#{tag}</Text>
                                        ))}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>

            <PlaceProfileModal
                visible={profileModalVisible}
                place={selectedPlace}
                onClose={() => setProfileModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 60,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.text,
        textTransform: 'uppercase',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'white',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: COLORS.border,
        ...SHADOWS.small,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 24,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    stacksContainer: {
        gap: 32,
    },
    stackWrapper: {
        marginBottom: 10,
    },
    stackLayer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    stackLayer1: {
        top: 6,
        left: 6,
        zIndex: 1,
    },
    stackLayer2: {
        top: 12,
        left: 12,
        zIndex: 0,
    },
    stackCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: COLORS.border,
        padding: 20,
        zIndex: 2,
        gap: 16,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    iconText: {
        fontSize: 20,
        fontWeight: '900',
        color: 'white',
    },
    stackContent: {
        flex: 1,
    },
    stackTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.text,
    },
    stackSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    arrowBox: {
        padding: 8,
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.text,
    },
    closeButton: {
        padding: 8,
    },
    placesList: {
        padding: 20,
        gap: 16,
    },
    placeCard: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 16,
        ...SHADOWS.medium,
    },
    placeCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    placeName: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary.black,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    placeStory: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 12,
    },
    placeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    founderBadge: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    founderText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    vibeTags: {
        flexDirection: 'row',
        gap: 8,
    },
    vibeTag: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary.blue,
    },
});
