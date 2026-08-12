import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  StatusBar,
  Animated,
  Easing,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AppText from './AppText';
import AppButton from './AppButton';
import SVGXml from './SVGXML';
import { AppIcons } from '../assets/icons';
import AppColors from '../utils/AppColors';
import { responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';
import { reverseGeocode, LocationCoords } from '../utils/locationHelper';

const DEFAULT_CENTER: LocationCoords = { latitude: 37.0902, longitude: -95.7129 };

export interface ConfirmLocationData {
  address: string;
  coordinates: [number, number];
}

export interface LocationMapModalProps {
  visible?: boolean;
  mode?: 'select' | 'route';
  title?: string;
  initialCoords?: LocationCoords | null;
  originCoords?: LocationCoords | null;
  destinationCoords?: LocationCoords | null;
  userPickupCoords?: LocationCoords | null;
  originAddress?: string;
  destinationAddress?: string;
  userPickupAddress?: string;
  onClose?: () => void;
  onConfirmLocation?: (data: ConfirmLocationData) => void;
  onGpsError?: (error: any) => void;
}

/**
 * Reusable full-screen Location & Route Map Modal
 *
 * Mode:
 * - 'select': Allows user to drag map, center pin pins location, and confirm location.
 * - 'route': Shows origin & destination markers with driving polyline.
 */
const LocationMapModal: React.FC<LocationMapModalProps> = ({
  visible = false,
  mode = 'select',
  title,
  initialCoords = null,
  originCoords = null,
  destinationCoords = null,
  userPickupCoords = null,
  originAddress = 'Origin',
  destinationAddress = 'Destination',
  userPickupAddress = 'Your Pickup Location',
  onClose = () => { },
  onConfirmLocation = () => { },
  onGpsError = () => { },
}) => {
  const mapRef = useRef<MapView | null>(null);
  const zoomDeltas = useRef<{ latitudeDelta: number; longitudeDelta: number }>({
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const mapCenterCoords = useRef<LocationCoords>({
    latitude: initialCoords?.latitude || DEFAULT_CENTER.latitude,
    longitude: initialCoords?.longitude || DEFAULT_CENTER.longitude,
  });

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [routeCoords, setRouteCoords] = useState<LocationCoords[]>([]);
  const [routeLoading, setRouteLoading] = useState<boolean>(false);

  // Animations
  const [scaleAnim] = useState<Animated.Value>(new Animated.Value(0));
  const [opacityAnim] = useState<Animated.Value>(new Animated.Value(0));
  const centerPinAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const isPinLifted = useRef<boolean>(false);

  const liftCenterPin = () => {
    if (!isPinLifted.current) {
      isPinLifted.current = true;
      Animated.timing(centerPinAnim, {
        toValue: -7,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const dropCenterPin = () => {
    isPinLifted.current = false;
    Animated.spring(centerPinAnim, {
      toValue: 0,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  // Modal show / hide animation effect
  useEffect(() => {
    if (visible) {
      StatusBar.setHidden(true, 'fade');
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  // Route calculation effect
  useEffect(() => {
    if (visible && mode === 'route' && originCoords && destinationCoords) {
      const fetchRoute = async () => {
        setRouteLoading(true);
        try {
          const startLng = originCoords.longitude;
          const startLat = originCoords.latitude;
          const endLng = destinationCoords.longitude;
          const endLat = destinationCoords.latitude;
          const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coords: LocationCoords[] = data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => ({
                latitude: coord[1],
                longitude: coord[0],
              }),
            );
            setRouteCoords(coords);
          } else {
            setRouteCoords([originCoords, destinationCoords]);
          }
        } catch {
          setRouteCoords([originCoords, destinationCoords]);
        } finally {
          setRouteLoading(false);
        }
      };
      fetchRoute();
    }
  }, [visible, mode, originCoords, destinationCoords]);

  // Region animate effect
  useEffect(() => {
    if (visible && mapRef.current) {
      if (mode === 'route' && originCoords && destinationCoords) {
        setTimeout(() => {
          const points = [originCoords, destinationCoords];
          if (userPickupCoords) {
            points.push(userPickupCoords);
          }
          mapRef.current?.fitToCoordinates(points, {
            edgePadding: { top: 120, right: 80, bottom: 120, left: 80 },
            animated: true,
          });
        }, 500);
      } else if (initialCoords) {
        mapCenterCoords.current = initialCoords;
        mapRef.current.animateToRegion(
          {
            latitude: initialCoords.latitude,
            longitude: initialCoords.longitude,
            latitudeDelta: zoomDeltas.current.latitudeDelta,
            longitudeDelta: zoomDeltas.current.longitudeDelta,
          },
          350,
        );
      }
    }
  }, [visible, mode, initialCoords, originCoords, destinationCoords, userPickupCoords]);

  const handleClose = () => {
    StatusBar.setHidden(false, 'fade');
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleConfirm = async () => {
    if (mode === 'route') {
      handleClose();
      return;
    }

    setConfirmLoading(true);
    const { latitude, longitude } = mapCenterCoords.current;
    const addressString = await reverseGeocode(latitude, longitude);
    setConfirmLoading(false);

    onConfirmLocation({
      address: addressString,
      coordinates: [longitude, latitude],
    });
    handleClose();
  };

  const defaultTitle =
    title ||
    (mode === 'route'
      ? 'Route Preview'
      : 'Select Location');

  const startRegion = mode === 'select' && initialCoords
    ? initialCoords
    : mode === 'route' && originCoords
      ? originCoords
      : DEFAULT_CENTER;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      hardwareAccelerated={true}
      statusBarTranslucent={true}
      onRequestClose={handleClose}
    >
      <Animated.View
        renderToHardwareTextureAndroid={true}
        style={[
          { flex: 1, backgroundColor: 'transparent' },
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        <StatusBar hidden={true} animated={true} />

        <MapView
          ref={mapRef}
          style={styles.fullMapStyle}
          showsUserLocation={true}
          showsMyLocationButton={false}
          mapPadding={{
            top: 80,
            bottom: 80,
            left: 16,
            right: 16,
          }}
          initialRegion={{
            latitude: startRegion.latitude,
            longitude: startRegion.longitude,
            latitudeDelta: zoomDeltas.current.latitudeDelta,
            longitudeDelta: zoomDeltas.current.longitudeDelta,
          }}
          onRegionChange={() => {
            if (mode === 'select') {
              liftCenterPin();
            }
          }}
          onRegionChangeComplete={(region: Region) => {
            zoomDeltas.current = {
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            };

            if (mode === 'select') {
              dropCenterPin();
              const { latitude, longitude } = region;
              mapCenterCoords.current = { latitude, longitude };
            }
          }}
        >
          {mode === 'route' && (
            <>
              {userPickupCoords && (
                <Marker
                  key={`user-pickup-${userPickupCoords.latitude}-${userPickupCoords.longitude}`}
                  coordinate={userPickupCoords}
                  title="Your Selected Pickup Location"
                  description={userPickupAddress || 'Your pickup point'}
                  pinColor="#FFFFFF"
                />
              )}
              {originCoords && (
                <Marker
                  key={`origin-${originCoords.latitude}-${originCoords.longitude}`}
                  coordinate={originCoords}
                  title="Origin"
                  description={originAddress}
                  pinColor={AppColors.ThemeColor}
                />
              )}
              {destinationCoords && (
                <Marker
                  key={`dest-${destinationCoords.latitude}-${destinationCoords.longitude}`}
                  coordinate={destinationCoords}
                  title="Destination"
                  description={destinationAddress}
                  pinColor={AppColors.ThemeColor}
                />
              )}
              {routeCoords.length > 0 && (
                <Polyline
                  coordinates={routeCoords}
                  strokeColor={AppColors.ThemeColor}
                  strokeWidth={4}
                />
              )}
            </>
          )}
        </MapView>

        {/* Center Pin for Location Selection Mode */}
        {mode === 'select' && (
          <View style={styles.centerPinContainer} pointerEvents="none">
            <Animated.View style={{ transform: [{ translateY: centerPinAnim }] }}>
              <SVGXml
                icon={AppIcons.location}
                width={responsiveWidth(10)}
                height={responsiveWidth(10)}
              />
            </Animated.View>
            <View style={styles.centerPinShadow} />
          </View>
        )}

        {/* Custom Floating My Location Button */}
        {mode === 'select' && (
          <TouchableOpacity
            style={styles.myLocationBtn}
            activeOpacity={0.8}
            onPress={() => {
              Geolocation.getCurrentPosition(
                position => {
                  const { latitude, longitude } = position.coords;
                  mapRef.current?.animateToRegion(
                    {
                      latitude,
                      longitude,
                      latitudeDelta: zoomDeltas.current.latitudeDelta,
                      longitudeDelta: zoomDeltas.current.longitudeDelta,
                    },
                    400,
                  );
                },
                error => {
                  onGpsError(error);
                },
                { enableHighAccuracy: false, timeout: 15000 },
              );
            }}
          >
            <SVGXml icon={AppIcons.location} width={responsiveWidth(6)} height={responsiveWidth(6)} />
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.fullMapHeader}>
          <TouchableOpacity style={styles.closeMapBtn} onPress={handleClose}>
            <AppText title="✕" textColor={AppColors.WHITE} textFontWeight textSize={2} />
          </TouchableOpacity>

          <AppText
            title={defaultTitle}
            textColor={AppColors.WHITE}
            textSize={1.8}
            textFontWeight
          />
        </View>

        {/* Footer */}
        <View style={styles.fullMapFooter}>
          <AppButton
            title={
              routeLoading
                ? 'Fetching Route...'
                : confirmLoading
                  ? 'Confirming...'
                  : mode === 'route'
                    ? 'Done'
                    : 'Confirm Location'
            }
            bgColor={AppColors.BLACK}
            handlePress={handleConfirm}
            loading={confirmLoading || routeLoading}
            loaderSize="small"
          />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullMapStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -responsiveWidth(9),
    marginLeft: -responsiveWidth(5),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 11,
  },
  centerPinShadow: {
    width: 2,
    height: 12,
    borderRadius: 4,
    backgroundColor: AppColors.ThemeColor,
    marginTop: 2,
  },
  myLocationBtn: {
    position: 'absolute',
    bottom: responsiveHeight(13),
    right: responsiveWidth(4),
    backgroundColor: AppColors.WHITE,
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 12,
  },
  fullMapHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight || 24) + responsiveHeight(1)
        : responsiveHeight(5),
    paddingBottom: responsiveHeight(1.5),
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  closeMapBtn: {
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 8,
  },
  fullMapFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(1.5),
    paddingBottom: Platform.OS === 'ios' ? responsiveHeight(3.5) : responsiveHeight(2.5),
    backgroundColor: 'transparent',
  },
});

export default LocationMapModal;
