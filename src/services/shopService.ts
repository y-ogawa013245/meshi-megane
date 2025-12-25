import { API_CONFIG } from '../config/apiConfig';
import { SearchFilters } from '../constants/searchConstants';

export interface Shop {
    id: string;
    name: string;
    genre: string;
    lat: number;
    lng: number;
    address: string;
    thumbnail: string;
    rating: number | null; // Note: Hotpepper API doesn't provide stars directly, we might use mock or other source later
    isOpen: boolean;
    catchCopy: string;
    openHours: string;
}

// Map filter distance (meters) to Hotpepper range code
// 1: 300m, 2: 500m, 3: 1000m, 4: 2000m, 5: 3000m
const mapDistanceToRange = (distance: number): number => {
    if (distance <= 300) return 1;
    if (distance <= 500) return 2;
    if (distance <= 1000) return 3;
    if (distance <= 2000) return 4;
    return 5;
};

export const fetchNearbyShops = async (
    lat: number,
    lng: number,
    filters: SearchFilters
): Promise<Shop[]> => {
    const { apiKey, baseUrl } = API_CONFIG.hotpepper;

    if (!apiKey) {
        console.error('Hotpepper API Key is missing. Using empty results.');
        return [];
    }

    const range = mapDistanceToRange(filters.distance);

    // Build query parameters
    const params = new URLSearchParams({
        key: apiKey,
        lat: lat.toString(),
        lng: lng.toString(),
        range: range.toString(),
        format: 'json',
        count: '20', // Limit results for AR performance
    });

    // Add genre if not "すべて"
    // Note: Standard mapping is needed here for real codes, 
    // but for now we'll search by keyword if genre is selected.
    if (filters.genre !== 'すべて') {
        params.append('keyword', filters.genre);
    }

    try {
        const response = await fetch(`${baseUrl}?${params.toString()}`);
        const data = await response.json();

        if (data.results?.error) {
            console.error('API Error:', data.results.error[0].message);
            return [];
        }

        const shops: Shop[] = data.results.shop.map((s: any) => ({
            id: s.id,
            name: s.name,
            genre: s.genre.name,
            lat: parseFloat(s.lat),
            lng: parseFloat(s.lng),
            address: s.address,
            thumbnail: s.photo.pc.l, // Large image for detail
            rating: null, // API doesn't have rating
            isOpen: s.open !== '', // Simplified check
            catchCopy: s.catch,
            openHours: s.open,
        }));

        return shops;
    } catch (error) {
        console.error('Failed to fetch shops:', error);
        return [];
    }
};
