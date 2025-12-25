import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils, faStar } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    DerivedValue,
    useDerivedValue
} from 'react-native-reanimated';

interface ARPanelProps {
    id: string;
    name: string;
    genre: string;
    distance: number;
    rating: number | null;
    thumbnail: string;
    bearing: number;        // The fixed compass bearing to the shop
    heading: number;        // SharedValue if possible, but here we'll use it to update a local SharedValue
    zoomMagnification: number;
    screenPosY: number;
    onTap: (id: string) => void;
}

const PANEL_WIDTH = 150;

export const ARPanel: React.FC<ARPanelProps> = ({
    id,
    name,
    genre,
    distance,
    rating,
    thumbnail,
    bearing,
    heading,
    zoomMagnification,
    screenPosY,
    onTap,
}) => {
    // Use SharedValue for the dynamic heading to enable smooth animations
    const sharedHeading = useSharedValue(heading);

    useEffect(() => {
        // Smoothly transition to new heading to eliminate digital jitter
        sharedHeading.value = withSpring(heading, {
            damping: 20,
            stiffness: 90,
            mass: 0.5,
        });
    }, [heading]);

    const animatedStyle = useAnimatedStyle(() => {
        // Calculate relative bearing in the UI thread
        let relativeBearing = (bearing - sharedHeading.value + 540) % 360 - 180;

        // FOV adjustment for Landscape:
        // In landscape, we want a wider angular field to be visible across the screen.
        // If 1.5 was good for portrait, 2.5~3.0 might be better for landscape to keep a natural sense of scale.
        const screenPosX = relativeBearing * 2.5 * zoomMagnification;

        // Scale and Opacity based on focus (center of screen)
        const focusIntensity = Math.abs(screenPosX) < 30 ? 1 - Math.abs(screenPosX) / 30 : 0;

        // 1. Stage-based Distance Scaling (10% steps to maintain visibility)
        const getStageProps = (dist: number) => {
            if (dist <= 300) return { dScale: 1.0, dOpacity: 1.0 };
            if (dist <= 500) return { dScale: 0.9, dOpacity: 0.9 };
            if (dist <= 1000) return { dScale: 0.8, dOpacity: 0.8 };
            if (dist <= 2000) return { dScale: 0.7, dOpacity: 0.7 };
            return { dScale: 0.6, dOpacity: 0.6 };
        };

        const { dScale, dOpacity } = getStageProps(distance);

        const scale = dScale * (1 + focusIntensity * 0.2);

        // Opacity: fade out at edges and based on distance stage
        const edgeOpacity = interpolate(Math.abs(screenPosX), [40, 60], [1, 0], 'clamp');
        const opacity = dOpacity * edgeOpacity * (0.8 + focusIntensity * 0.2);

        return {
            left: `${50 + screenPosX}%`,
            top: `${50 - screenPosY}%`,
            transform: [
                { translateX: -PANEL_WIDTH / 2 },
                { translateY: -40 },
                { scale: scale }
            ],
            opacity: opacity,
            zIndex: Math.floor(10000 / distance),
            borderColor: focusIntensity > 0.8 ? '#FF9800' : 'rgba(255, 255, 255, 0.2)',
            borderWidth: focusIntensity > 0.8 ? 2 : 1,
        };
    });

    return (
        <Animated.View style={[styles.panel, animatedStyle]}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onTap(id)}>
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
                            {rating !== null && (
                                <View style={styles.ratingRow}>
                                    <FontAwesomeIcon icon={faStar as IconProp} size={10} color="#FFD700" />
                                    <Text style={styles.rating}>{rating}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    panel: {
        position: 'absolute',
        width: PANEL_WIDTH,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 12,
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 1,
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
        color: '#CCC',
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
