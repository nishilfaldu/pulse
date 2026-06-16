import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface SlotCounterProps {
    value: number;
    style?: any;
}

const DIGIT_HEIGHT = 20; // Approximate height for the font size, adjust as needed
const DURATION = 800;

function Digit({ value, style }: { value: string; style: any }) {
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (!isNaN(parseInt(value))) {
            translateY.value = withTiming(-parseInt(value) * DIGIT_HEIGHT, {
                duration: DURATION,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            });
        }
    }, [value]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    if (isNaN(parseInt(value))) {
        return <Text style={[style, { height: DIGIT_HEIGHT, lineHeight: DIGIT_HEIGHT }]}>{value}</Text>;
    }

    return (
        <View style={{ height: DIGIT_HEIGHT, overflow: 'hidden' }}>
            <Animated.View style={animatedStyle}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Text key={num} style={[style, { height: DIGIT_HEIGHT, lineHeight: DIGIT_HEIGHT }]}>
                        {num}
                    </Text>
                ))}
            </Animated.View>
        </View>
    );
}

export function SlotCounter({ value, style }: SlotCounterProps) {
    const valueStr = value.toLocaleString(); // "12,403"
    const digits = valueStr.split('');

    // We need to extract font size from style to set DIGIT_HEIGHT dynamically if possible,
    // but for MVP we'll assume a fixed height or pass it in. 
    // Let's try to just render it.

    return (
        <View style={styles.row}>
            {digits.map((digit, index) => (
                <Digit key={`${index}-${digit}`} value={digit} style={style} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
