import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, G, Path, Pattern, Rect, Text as SvgText } from 'react-native-svg';
import { City, Place } from '../../constants/city-builder-data';
import { COLORS } from '../../constants/theme';

interface CityGridProps {
    city: City;
    places: Place[];
    onPlacePress: (place: Place) => void;
    onEmptyGridPress: (x: number, y: number) => void;
}

export function CityGrid({ city, places, onPlacePress, onEmptyGridPress }: CityGridProps) {
    const cellSize = 40; // Size of each grid cell
    const gridSize = city.gridSize * cellSize;

    const getPlaceAt = (x: number, y: number) => places.find(p => p.x === x && p.y === y);

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

    const handlePress = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        const x = Math.floor(locationX / cellSize);
        const y = Math.floor(locationY / cellSize);

        // Ensure click is within bounds
        if (x < 0 || x >= city.gridSize || y < 0 || y >= city.gridSize) return;

        const place = getPlaceAt(x, y);
        if (place) {
            onPlacePress(place);
        } else {
            onEmptyGridPress(x, y);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={handlePress}>
                <View style={[styles.gridContainer, { width: gridSize, height: gridSize }]}>
                    <Svg width={gridSize} height={gridSize}>
                        <Defs>
                            <Pattern
                                id="gridPattern"
                                width={cellSize}
                                height={cellSize}
                                patternUnits="userSpaceOnUse"
                            >
                                <Path
                                    d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                                    fill="none"
                                    stroke="#E5E5E5"
                                    strokeWidth="1"
                                />
                            </Pattern>
                        </Defs>

                        {/* Background Grid using Pattern */}
                        <Rect
                            width="100%"
                            height="100%"
                            fill="url(#gridPattern)"
                        />

                        {/* Draw Places */}
                        {places.map((place) => (
                            <G key={place.id}>
                                <Rect
                                    x={place.x * cellSize + 2}
                                    y={place.y * cellSize + 2}
                                    width={cellSize - 4}
                                    height={cellSize - 4}
                                    fill={getPlaceColor(place.type)}
                                    stroke={COLORS.border}
                                    strokeWidth="2"
                                    rx="4"
                                />
                                {/* Simple Icon/Text placeholder */}
                                <SvgText
                                    x={place.x * cellSize + cellSize / 2}
                                    y={place.y * cellSize + cellSize / 2 + 4}
                                    fontSize="16"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    fill="white"
                                >
                                    {place.name[0]}
                                </SvgText>
                            </G>
                        ))}
                    </Svg>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    gridContainer: {
        backgroundColor: 'white',
        // Removed border and shadow for unbounded feel
    },
});

