import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { GOOGLE_MAPS_API_KEY } from '../redux/constant';

let isGoogleGeocodeDisabled = false;

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface UserLocationResult extends LocationCoords {
  coordinates: [number, number];
}

export interface GetLocationOptions {
  highAccuracy?: boolean;
  maximumAge?: number;
}

export interface AddressSuggestion {
  place_id: string;
  description: string;
  isGoogle?: boolean;
  isFreeSearch?: boolean;
  lat?: number;
  lng?: number;
}

export interface RouteDetails {
  fullWaypoints: [number, number][];     // Full detailed coordinates [[lng, lat], ...]
  sampledWaypoints: [number, number][];  // Key waypoints (e.g., 15 key points along route)
  distanceKm: number;                    // Total distance in KM
  durationMins: number;                  // Estimated time in minutes
}

/**
 * Reverse geocode latitude & longitude to readable address string
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  // 1. Google Maps Geocoding API
  if (!isGoogleGeocodeDisabled) {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(googleUrl);
      const data = await res.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      if (
        data.status === 'REQUEST_DENIED' ||
        data.status === 'OVER_QUERY_LIMIT' ||
        data.status === 'INVALID_REQUEST'
      ) {
        isGoogleGeocodeDisabled = true;
      }
    } catch (e) {
      console.log('Google Reverse geocode error:', e);
    }
  }

  // 2. Nominatim OpenStreetMap (Full Street-Level Detailed Address)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const fallbackRes = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const text = await fallbackRes.text();
    if (text.startsWith('{')) {
      const fallbackData = JSON.parse(text);
      if (fallbackData && fallbackData.display_name) {
        return fallbackData.display_name;
      }
    }
  } catch (err) {
    console.log('Nominatim fallback error:', err);
  }

  // 3. BigDataCloud Fallback
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const bdcRes = await fetch(bdcUrl);
    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      const informativeNames = bdcData.localityInfo?.informative
        ?.map((i: any) => i.name)
        ?.filter(Boolean) || [];

      const mainLocality = bdcData.locality || bdcData.city;
      const subdivision = bdcData.principalSubdivision;
      const country = bdcData.countryName;

      const allParts = [...informativeNames, mainLocality, subdivision, country].filter(Boolean);
      const uniqueParts = Array.from(new Set(allParts));

      if (uniqueParts.length > 0) {
        return uniqueParts.join(', ');
      }
    }
  } catch (bdcErr) {
    console.log('BigDataCloud error:', bdcErr);
  }

  return '';
};

/**
 * Fetch address suggestions using Google Places Autocomplete with Nominatim fallback
 */
export const fetchAddressSuggestions = async (text: string): Promise<AddressSuggestion[]> => {
  if (!text || text.trim().length < 2) {
    return [];
  }

  // 1. Google Places Autocomplete API
  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      text,
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.predictions && data.predictions.length > 0) {
      return data.predictions.map((item: any) => ({
        place_id: item.place_id,
        description: item.description,
        isGoogle: true,
      }));
    }
  } catch (e) {
    console.log('Google Autocomplete error:', e);
  }

  // 2. OpenStreetMap Nominatim Fallback
  try {
    const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      text,
    )}&limit=5&accept-language=en`;
    const fallbackRes = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const fallbackData = await fallbackRes.json();

    if (fallbackData && fallbackData.length > 0) {
      return fallbackData.map((item: any) => ({
        place_id: String(item.place_id || item.osm_id),
        description: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        isFreeSearch: true,
      }));
    }
  } catch (err) {
    console.log('Nominatim fallback search error:', err);
  }

  return [];
};

/**
 * Helper: Calculate distance in meters between two lat/lng points (Haversine formula)
 */
const getDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Fetch driving route waypoints between origin and destination coordinates using OSRM Routing API.
 * Samples waypoints at exact ~500 meter intervals along the actual road path.
 */
export const fetchRouteWaypoints = async (
  originCoords: [number, number],      // [lng, lat]
  destinationCoords: [number, number], // [lng, lat]
  intervalMeters: number = 500,        // Default 500 meters interval
): Promise<RouteDetails> => {
  try {
    const [startLng, startLat] = originCoords;
    const [endLng, endLat] = destinationCoords;

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.routes && data.routes.length > 0) {
      const coords: [number, number][] = data.routes[0].geometry.coordinates; // [[lng, lat], ...]
      const distanceKm = Number((data.routes[0].distance / 1000).toFixed(1));
      const durationMins = Math.round(data.routes[0].duration / 60);

      // Sample waypoints at every `intervalMeters` (default 500 meters)
      // Start with exact originCoords
      const sampledWaypoints: [number, number][] = [originCoords];
      let accumulatedDistance = 0;

      for (let i = 1; i < coords.length - 1; i++) {
        const prev = coords[i - 1];
        const curr = coords[i];
        const dist = getDistanceMeters(prev[1], prev[0], curr[1], curr[0]);
        accumulatedDistance += dist;

        if (accumulatedDistance >= intervalMeters) {
          sampledWaypoints.push(curr);
          accumulatedDistance = 0;
        }
      }

      // Always ensure exact destinationCoords is the last point
      sampledWaypoints.push(destinationCoords);

      const fullWaypoints: [number, number][] = [originCoords, ...coords, destinationCoords];

      return {
        fullWaypoints,
        sampledWaypoints,
        distanceKm,
        durationMins,
      };
    }
  } catch (error) {
    console.log('fetchRouteWaypoints error:', error);
  }

  return {
    fullWaypoints: [originCoords, destinationCoords],
    sampledWaypoints: [originCoords, destinationCoords],
    distanceKm: 0,
    durationMins: 0,
  };
};

/**
 * Checks location permission on Android and requests if not granted
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;
  try {
    const isGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (isGranted) return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Permission check error:', err);
    return false;
  }
};

/**
 * Fetch current device location fast using GPS/network provider.
 * Returns Promise resolving to { latitude, longitude, coordinates: [lng, lat] } immediately.
 */
export const getCurrentUserLocation = async ({
  highAccuracy = false,
  maximumAge = 300000,
}: GetLocationOptions = {}): Promise<UserLocationResult> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    throw { code: 1, message: 'Location permission was denied.' };
  }

  return new Promise((resolve, reject) => {
    if (!Geolocation) {
      reject({ code: 'GEOLOCATION_UNAVAILABLE', message: 'Geolocation module is unavailable.' });
      return;
    }

    const fetchPosition = (useHighAcc = false) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          resolve({
            latitude,
            longitude,
            coordinates: [longitude, latitude],
          });
        },
        error => {
          if (!useHighAcc) {
            fetchPosition(true);
          } else {
            reject(error);
          }
        },
        {
          enableHighAccuracy: useHighAcc,
          timeout: 15000,
          maximumAge: maximumAge,
        },
      );
    };

    fetchPosition(highAccuracy);
  });
};
