import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faUtensils, faClock, faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ShopDetailModalProps {
    visible: boolean;
    shop: any | null;
    onClose: () => void;
}

export const ShopDetailModal: React.FC<ShopDetailModalProps> = ({ visible, shop, onClose }) => {
    if (!shop) return null;

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Image source={{ uri: shop.thumbnail }} style={styles.image} />

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <FontAwesomeIcon icon={faTimes as IconProp} color="#FFF" size={20} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.name}>{shop.name}</Text>
                            {shop.rating && (
                                <View style={styles.ratingBox}>
                                    <FontAwesomeIcon icon={faStar as IconProp} color="#FFD700" size={14} />
                                    <Text style={styles.ratingText}>{shop.rating}</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.catch}>{shop.catch}</Text>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <FontAwesomeIcon icon={faUtensils as IconProp} color="#FF9800" size={16} />
                            <Text style={styles.infoText}>{shop.genre}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <FontAwesomeIcon icon={faClock as IconProp} color="#FF9800" size={16} />
                            <Text style={styles.infoText}>{shop.open}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <FontAwesomeIcon icon={faMapMarkerAlt as IconProp} color="#FF9800" size={16} />
                            <Text style={styles.infoText} numberOfLines={2}>{shop.address}</Text>
                        </View>

                        <TouchableOpacity style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>予約・詳細（ホットペッパー）</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    image: {
        width: '100%',
        height: 200,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        flex: 1,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 10,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        color: '#FFD700',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    catch: {
        color: '#AAA',
        fontSize: 14,
        marginTop: 8,
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoText: {
        color: '#EEE',
        fontSize: 15,
        marginLeft: 12,
        flex: 1,
    },
    primaryButton: {
        backgroundColor: '#FF9800',
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    primaryButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
