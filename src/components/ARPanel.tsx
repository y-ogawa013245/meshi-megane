import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils, faStar } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ARPanelProps {
    id: string;
    name: string;
    genre: string;
    distance: number;
    rating: number | null;
    thumbnail: string;
    screenPosX: number; // -100 to 100 (percentage of viewport)
    screenPosY: number; // based on floor/elevation
    onTap: (id: string) => void;
}

export const ARPanel: React.FC<ARPanelProps> = ({
    id,
    name,
    genre,
    distance,
    rating,
    thumbnail,
    screenPosX,
    screenPosY,
    onTap,
}) => {
    // Simple visibility check (within +/- 45 degrees of center)
    if (Math.abs(screenPosX) > 50) return null;

    return (
        <TouchableOpacity
            style={[
                styles.panel,
                {
                    left: `${50 + screenPosX}%`,
                    top: `${50 - screenPosY}%`,
                    transform: [{ translateX: -75 }, { translateY: -40 }],
                    opacity: 1 - Math.abs(screenPosX) / 60, // Fade out on edges
                },
            ]}
            onPress={() => onTap(id)}
        >
            <View style={styles.content}>
                <Image source={{ uri: thumbnail }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    <View style={styles.row}>
                        <FontAwesomeIcon icon={faUtensils as IconProp} size={10} color="#FF9800" />
                        <Text style={styles.genre}>{genre}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.distance}>{Math.round(distance)}m</Text>
                        {rating && (
                            <View style={styles.ratingRow}>
                                <FontAwesomeIcon icon={faStar as IconProp} size={10} color="#FFD700" />
                                <Text style={styles.rating}>{rating}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    panel: {
        position: 'absolute',
        width: 150,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        padding: 6,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#333',
    },
    info: {
        flex: 1,
        marginLeft: 8,
    },
    name: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    genre: {
        color: '#AAA',
        fontSize: 10,
        marginLeft: 4,
    },
    distance: {
        color: '#FF9800',
        fontSize: 10,
        fontWeight: 'bold',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    rating: {
        color: '#FFD700',
        fontSize: 10,
        marginLeft: 2,
    },
});
