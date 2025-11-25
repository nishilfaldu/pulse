import { ArrowDownToLine } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TrendCardProps {
    trend: any;
    onClick: (trend: any) => void;
}

export function TrendCard({ trend, onClick }: TrendCardProps) {
    return (
        <TouchableOpacity onPress={() => onClick(trend)} activeOpacity={0.9} style={styles.container}>
            <View style={styles.card}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: trend.color }]}>
                    <Text style={styles.sourceText}>{trend.source}</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.icon}>{trend.icon}</Text>
                    <Text numberOfLines={2} style={styles.title}>{trend.title}</Text>
                </View>

                {/* Import Action */}
                <View style={styles.actionContainer}>
                    <View style={styles.actionButton}>
                        <ArrowDownToLine size={10} color="white" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 12,
        width: 144,
    },
    card: {
        width: 144,
        height: 96,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 8,
        // Custom shadow for this card size
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    header: {
        height: 24,
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    sourceText: {
        fontSize: 8,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        padding: 12,
        paddingTop: 8, // Adjust for header
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 24,
        marginBottom: 4,
    },
    title: {
        fontSize: 10,
        fontWeight: '900',
        textAlign: 'center',
        color: '#1A1A1A',
    },
    actionContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 4,
    },
    actionButton: {
        backgroundColor: 'black',
        borderTopLeftRadius: 8,
        padding: 4,
    },
});
