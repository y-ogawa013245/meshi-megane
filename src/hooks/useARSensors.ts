import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { DeviceMotion } from 'expo-sensors';

/**
 * useARSensors - Virtual Panorama Room Mode
 * 
 * Instead of raw heading, this hook provides a "Stable World Heading".
 * It uses Gyroscope (via DeviceMotion) for smooth frame-to-frame movement 
 * and slowly calibrates with Compass (Magnetometer) to fix the North.
 */
export const useARSensors = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // The stable world heading [0, 360]
  const [heading, setHeading] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);

  // Internals for the "Virtual Room" logic
  const internalHeading = useRef(0);
  const lastTimestamp = useRef(0);
  const compassHeading = useRef(0);

  useEffect(() => {
    (async () => {
      // 1. Permissions
      const { status: cameraStatus } = await Location.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === 'granted');

      if (locationStatus === 'granted') {
        // Initial Location
        const initialLoc = await Location.getCurrentPositionAsync({});
        setLocation(initialLoc);

        // Location Watching (20m distance)
        await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 20 },
          (loc) => setLocation(loc)
        );

        // Compass Heading Watching (Used for slow drift correction)
        await Location.watchHeadingAsync((h) => {
          compassHeading.current = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
        });

        // 2. Device Motion for the "Virtual Room" rotation
        const isAvailable = await DeviceMotion.isAvailableAsync();
        if (isAvailable) {
          DeviceMotion.setUpdateInterval(16); // 60fps for maximum smoothness
          DeviceMotion.addListener((data) => {
            if (data.rotation) {
              const { alpha, beta } = data.rotation;

              // DeviceMotion alpha is cumulative rotation (around Z).
              // We use this as our "Room Rotation".
              let currentGyroAlpha = (alpha * 180) / Math.PI;
              if (currentGyroAlpha < 0) currentGyroAlpha += 360;

              // --- "Virtual Panorama Room" Complementary Filter ---
              // We want to follow the Gyroscope perfectly for smoothness,
              // but we also want it to eventually point North.

              // 1. Get difference between our internal world and the compass
              let diff = compassHeading.current - internalHeading.current;
              // Wrap diff to [-180, 180]
              if (diff > 180) diff -= 360;
              if (diff < -180) diff += 360;

              // 2. Slowly nudge internal towards compass (Drift Correction)
              // Correction factor: 0.01 means it takes ~100 frames (~1.6s) to fix a small drift.
              // This is what makes the "Room" feel stable despite compass jitter.
              const driftCorrection = diff * 0.01;

              // 3. Update internal heading based on Alpha change + Drift correction
              // Note: DeviceMotion alpha already includes gyro integration.
              // So we can use alpha directly or compute delta. Using alpha directly is cleaner for absolute rotation.

              const newHeading = (currentGyroAlpha + driftCorrection + 360) % 360;

              internalHeading.current = newHeading;
              setHeading(newHeading);
              setPitch(beta);
            }
          });
        }
      }
    })();

    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  return {
    hasCameraPermission,
    hasLocationPermission,
    location,
    heading,
    pitch,
  };
};
