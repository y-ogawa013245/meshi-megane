import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, useWindowDimensions } from 'react-native';
import { CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { useARSensors } from '../hooks/useARSensors';
import { ARPanel } from '../components/ARPanel';
import { SearchFAB } from '../components/SearchFAB';
import { SearchModal } from '../components/SearchModal';
import { ShopDetailModal } from '../components/ShopDetailModal';
import { getDistance, getBearing, extractFloor } from '../services/arUtils';
import { SearchFilters, INITIAL_FILTERS } from '../constants/searchConstants';
import { fetchNearbyShops, Shop } from '../services/shopService';

export const ARScreen = () => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const { hasCameraPermission, hasLocationPermission, location, heading } = useARSensors();

    // API Data States
    const [shops, setShops] = useState<Shop[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    // Zoom States
    const [zoom, setZoom] = useState(0);
    const baseZoom = useRef(0);

    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
    const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

    // Fetch shops when location or filters change
    useEffect(() => {
        if (location) {
            const loadShops = async () => {
                setIsFetching(true);
                const data = await fetchNearbyShops(
                    location.coords.latitude,
                    location.coords.longitude,
                    filters
                );
                setShops(data);
                setIsFetching(false);
            };
            loadShops();
        }
    }, [location?.coords.latitude, location?.coords.longitude, filters.distance, filters.genre]);

    // Pinch Gesture Handler
    const onPinchGestureEvent = (event: any) => {
        let scale = event.nativeEvent.scale;
        let newZoom = baseZoom.current + (scale - 1) * 0.5;
        setZoom(Math.max(0, Math.min(1, newZoom)));
    };

    const onPinchHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            baseZoom.current = zoom;
        }
    };

    const filteredShops = useMemo(() => {
        if (!location) return [];

        const zoomMagnification = 1 + zoom * 4;

        return shops.filter((shop) => {
            const distance = getDistance(location.coords.latitude, location.coords.longitude, shop.lat, shop.lng);

            // Zoom Logic: Hide close shops when zoomed in
            if (zoomMagnification > 1.5 && distance < 200) {
                return false;
            }

            if (shop.rating === null) {
                if (!filters.includeNoRating) return false;
            } else if (filters.minRating !== null && shop.rating < filters.minRating) {
                return false;
            }
            return true;
        });
    }, [location, shops, zoom, filters.includeNoRating, filters.minRating]);

    const selectedShop = useMemo(() => shops.find(s => s.id === selectedShopId) || null, [selectedShopId, shops]);

    if (hasCameraPermission === null || hasLocationPermission === null) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF9800" />
            </View>
        );
    }

    const zoomMagnification = 1 + zoom * 4;

    return (
        <View style={styles.container}>
            <PinchGestureHandler
                onGestureEvent={onPinchGestureEvent}
                onHandlerStateChange={onPinchHandlerStateChange}
            >
                <View style={styles.container}>
                    {hasCameraPermission ? (
                        <CameraView
                            style={StyleSheet.absoluteFill}
                            facing="back"
                            zoom={zoom}
                        />
                    ) : (
                        <View style={styles.center}><Text style={styles.errorText}>カメラ権限が必要です</Text></View>
                    )}

                    <View style={styles.overlay} pointerEvents="box-none">
                        {location && filteredShops.map((shop) => {
                            const distance = getDistance(location.coords.latitude, location.coords.longitude, shop.lat, shop.lng);
                            const bearing = getBearing(location.coords.latitude, location.coords.longitude, shop.lat, shop.lng);

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
                                    bearing={bearing}
                                    heading={heading} // Passing the stable heading
                                    zoomMagnification={zoomMagnification}
                                    screenPosY={screenPosY}
                                    onTap={(id) => setSelectedShopId(id)}
                                />
                            );
                        })}
                    </View>
                </View>
            </PinchGestureHandler>

            <View style={styles.debugContainer} pointerEvents="none">
                <SafeAreaView edges={['top']}>
                    <View style={styles.debugPanel}>
                        <Text style={styles.debugValue}>
                            V-ROOM ACTIVE | HEAD:{heading.toFixed(0)}° ZOOM:{zoomMagnification.toFixed(1)}x
                        </Text>
                        <Text style={styles.debugValue}>
                            SHOPS:{filteredShops.length} {isFetching ? '(FETCHING...)' : 'FOUND'}
                        </Text>
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
    debugPanel: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 6,
        alignSelf: 'center',
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
    },
    debugValue: { color: '#00FF00', fontSize: 10, fontFamily: 'monospace', textAlign: 'center' },
});
