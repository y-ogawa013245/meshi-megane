import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useARSensors } from '../hooks/useARSensors';
import { ARPanel } from '../components/ARPanel';
import { SearchFAB } from '../components/SearchFAB';
import { SearchModal } from '../components/SearchModal';
import { ShopDetailModal } from '../components/ShopDetailModal';
import { getDistance, getBearing, extractFloor } from '../services/arUtils';
import { SearchFilters, INITIAL_FILTERS } from '../constants/searchConstants';
import dummyShops from '../assets/data/dummyShops.json';

export const ARScreen = () => {
    const { hasCameraPermission, hasLocationPermission, location, heading } = useARSensors();

    const [zoomLevel, setZoomLevel] = useState(1);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
    const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

    const filteredShops = useMemo(() => {
        if (!location) return [];
        return dummyShops.filter((shop) => {
            const distance = getDistance(location.coords.latitude, location.coords.longitude, shop.lat, shop.lng);
            if (distance > filters.distance) return false;
            if (filters.genre !== 'すべて' && shop.genre !== filters.genre) return false;
            if (shop.rating === null) {
                if (!filters.includeNoRating) return false;
            } else if (filters.minRating !== null && shop.rating < filters.minRating) {
                return false;
            }
            return true;
        });
    }, [location, filters]);

    const selectedShop = useMemo(() => dummyShops.find(s => s.id === selectedShopId) || null, [selectedShopId]);

    if (hasCameraPermission === null || hasLocationPermission === null) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF9800" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {hasCameraPermission ? (
                <CameraView style={StyleSheet.absoluteFill} facing="back" />
            ) : (
                <View style={styles.center}><Text style={styles.errorText}>カメラ権限が必要です</Text></View>
            )}

            <View style={styles.overlay} pointerEvents="box-none">
                {location && filteredShops.map((shop) => {
                    const distance = getDistance(location.coords.latitude, location.coords.longitude, shop.lat, shop.lng);
                    const bearing = getBearing(location.coords.latitude, location.coords.longitude, shop.lat, shop.lng);
                    let relativeBearing = (bearing - heading + 540) % 360 - 180;
                    const screenPosX = relativeBearing * 1.5;
                    const floor = extractFloor(shop.address);
                    const screenPosY = (floor - 1) * 8;

                    return (
                        <ARPanel
                            key={shop.id}
                            id={shop.id}
                            name={shop.name}
                            genre={shop.genre}
                            distance={distance}
                            rating={shop.rating}
                            thumbnail={shop.thumbnail}
                            screenPosX={screenPosX}
                            screenPosY={screenPosY}
                            onTap={(id) => setSelectedShopId(id)}
                        />
                    );
                })}
            </View>

            <View style={styles.debugContainer} pointerEvents="none">
                <SafeAreaView edges={['top']}>
                    <View style={styles.debugPanel}>
                        <Text style={styles.debugValue}>
                            CAM:{hasCameraPermission ? 'OK' : 'NG'} LOC:{hasLocationPermission ? 'OK' : 'NG'} HEAD:{heading.toFixed(0)}°
                        </Text>
                        <Text style={styles.debugValue}>SHOPS:{filteredShops.length} FOUND</Text>
                    </View>
                </SafeAreaView>
            </View>

            <SearchFAB onPress={() => setIsSearchVisible(true)} />
            <SearchModal visible={isSearchVisible} onClose={() => setIsSearchVisible(false)} onApply={(f) => { setFilters(f); setIsSearchVisible(false); }} currentFilters={filters} />
            <ShopDetailModal visible={!!selectedShopId} shop={selectedShop} onClose={() => setSelectedShopId(null)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent', zIndex: 10 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    errorText: { color: '#FF5252', fontSize: 16 },
    debugContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 },
    debugPanel: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, marginHorizontal: 20, borderRadius: 8 },
    debugValue: { color: '#00FF00', fontSize: 10, fontFamily: 'monospace', textAlign: 'center' },
});
