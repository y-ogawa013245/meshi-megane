import { useState, useEffect, useRef } from 'react';
import { Camera, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { DeviceMotion } from 'expo-sensors';

/**
 * Advanced Smoothing Parameters
 */
const HEADING_SMOOTHING = 0.04; // Very smooth
const DEADZONE_THRESHOLD = 0.5; // Ignore changes less than 0.5 degrees

export const useARSensors = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [deviceMotion, setDeviceMotion] = useState<any>(null);

  const filteredHeading = useRef<number>(0);

  useEffect(() => {
    (async () => {
      // 1. Permissions
      if (!cameraPermission || cameraPermission.status !== 'granted') {
        await requestCameraPermission();
      }
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === 'granted');

      if (locationStatus === 'granted') {
        await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 5 },
          (loc) => setLocation(loc)
        );

        await Location.watchHeadingAsync((h) => {
          let newHeading = h.trueHeading;

          let diff = newHeading - filteredHeading.current;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;

          // Apply Deadzone: If movement is too small, don't update
          if (Math.abs(diff) < DEADZONE_THRESHOLD) {
            return;
          }

          const smoothed = filteredHeading.current + diff * HEADING_SMOOTHING;
          const normalized = (smoothed + 360) % 360;

          filteredHeading.current = normalized;
          setHeading(normalized);
        });
      }

      const motionSubscription = DeviceMotion.addListener((motion) => {
        setDeviceMotion(motion);
      });
      DeviceMotion.setUpdateInterval(100);

      return () => {
        motionSubscription.remove();
        DeviceMotion.removeAllListeners();
      };
    })();
  }, []);

  return {
    hasCameraPermission: cameraPermission?.status === 'granted',
    hasLocationPermission,
    location,
    heading,
    deviceMotion,
  };
};
