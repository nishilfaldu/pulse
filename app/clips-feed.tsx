import { ClipReelItem } from '@/components/clip-reel-item';
import { CLIPS } from '@/constants/data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function ClipsFeedPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const initialIndex = params.index ? parseInt(params.index as string) : 0;

    // Create a larger list for "infinite" feel
    const FEED_DATA = [...CLIPS, ...CLIPS, ...CLIPS];

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        // Can track current item here
    }).current;

    return (
        <View style={styles.container}>
            <FlatList
                data={FEED_DATA}
                renderItem={({ item, index }) => (
                    <ClipReelItem clip={item} isActive={true} />
                )}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={height}
                decelerationRate="fast"
                initialScrollIndex={initialIndex}
                getItemLayout={(data, index) => (
                    { length: height, offset: height * index, index }
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50
                }}
            />

            {/* Back Button Overlay */}
            <SafeAreaView style={styles.headerOverlay} edges={['top']}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="white" strokeWidth={3} />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 16,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
});
