/**
 * Degree to Radian
 */
const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Radian to Degree
 */
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Calculate distance between two points in meters (Haversine formula)
 */
export const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Calculate bearing from point A to point B
 */
export const getBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
    const x =
        Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
        Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2 - lng1));
    const brng = toDeg(Math.atan2(y, x));
    return (brng + 360) % 360;
};

/**
 * Extract floor level from address string
 */
export const extractFloor = (address: string): number => {
    const floorMatch = address.match(/(\d+)\s*(階|F|f)/);
    if (floorMatch) {
        return parseInt(floorMatch[1], 10);
    }
    return 1; // Default to 1st floor
};
