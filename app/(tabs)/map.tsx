import { CITIES, INITIAL_PLACES } from '@/constants/city-builder-data';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Grid, Map as MapIcon, Plus, Search, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CityBuilderScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    // We can fetch place counts here or pass them, for now we just use initial data to show stats
    // In a real app, this would come from a backend query
    const places = INITIAL_PLACES;

    const filteredCities = CITIES.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCitySelect = (cityId: string) => {
        router.push(`/city/${cityId}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>City Builder</Text>
                <View style={styles.badge}>
                    <MapIcon size={12} color="white" />
                    <Text style={styles.badgeText}>Beta</Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search cities..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredCities}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const cityPlaces = places.filter(p => p.cityId === item.id).length;
                    const totalPlots = item.gridSize * item.gridSize;

                    return (
                        <TouchableOpacity style={styles.cityCard} onPress={() => handleCitySelect(item.id)}>
                            <View style={styles.cityCardHeader}>
                                <Text style={styles.cityName}>{item.name}</Text>
                                <View style={styles.cityStatBadge}>
                                    <Grid size={12} color={COLORS.text} />
                                    <Text style={styles.cityStatText}>{item.gridSize}x{item.gridSize}</Text>
                                </View>
                            </View>

                            <View style={styles.cityCardStats}>
                                <View style={styles.statRow}>
                                    <Users size={14} color="#666" />
                                    <Text style={styles.statText}>{cityPlaces} Places Founded</Text>
                                </View>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: `${(cityPlaces / totalPlots) * 100}%` }]} />
                                </View>
                                <Text style={styles.progressText}>{Math.round((cityPlaces / totalPlots) * 100)}% Developed</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListFooterComponent={
                    <TouchableOpacity style={styles.suggestButton}>
                        <Plus size={20} color="white" />
                        <Text style={styles.suggestButtonText}>Suggest a New City</Text>
                    </TouchableOpacity>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.text,
    },
    badge: {
        backgroundColor: COLORS.primary.red,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    // Search
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    // List
    listContent: {
        padding: 16,
        gap: 16,
        paddingBottom: 100,
    },
    cityCard: {
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 16,
        ...SHADOWS.medium,
    },
    cityCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cityName: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.text,
    },
    cityStatBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F0F0F0',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    cityStatText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    cityCardStats: {
        gap: 8,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary.green,
    },
    progressText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        textAlign: 'right',
    },
    suggestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary.black,
        padding: 16,
        borderRadius: 16,
        gap: 8,
        marginTop: 8,
        ...SHADOWS.small,
    },
    suggestButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
