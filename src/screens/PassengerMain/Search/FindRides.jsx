import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  Easing,
  FlatList,
  Keyboard,
  Linking,
  Modal,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import RideCard from '../../../components/RideCard';
import RideCardSkeleton from '../../../components/RideCardSkeleton';
import Wrapper from '../../../components/Wrapper';
import AppHeader from '../../../components/AppHeader';
import LocationMapModal from '../../../components/LocationMapModal';
import { useLazySearchRidesQuery, useBookRideMutation } from '../../../redux/api/apiSlice';
import { showToast } from '../../../utils/toast';
import { useSelector } from 'react-redux';
import { selectCommunityId } from '../../../redux/slices/authSlice';
import {
  getCurrentUserLocation,
  reverseGeocode,
  fetchAddressSuggestions,
  GOOGLE_MAPS_API_KEY,
} from '../../../utils/locationHelper';

const FindRides = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [bookRide, { isLoading: isBookingLoading }] = useBookRideMutation();
  const [filtersVisible, setFiltersVisible] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const originInputRef = useRef('');
  const destinationInputRef = useRef('');

  // Starting point (lat, lng) & Ending point (destLat, destLng)
  const [origin, setOrigin] = useState({
    address: '',
    coordinates: [], // [lng, lat]
  });
  const [destination, setDestination] = useState({
    address: '',
    coordinates: [], // [destLng, destLat]
  });

  // Autocomplete Suggestions State
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [originSelection, setOriginSelection] = useState(undefined);
  const [destSelection, setDestSelection] = useState(undefined);
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestFocused, setIsDestFocused] = useState(false);
  const [userLocationCoords, setUserLocationCoords] = useState(null);
  const [bookingRideId, setBookingRideId] = useState(null);

  const handleRequestRide = async ride => {
    const rideId = ride?.id || ride?._id;
    if (!rideId || isBookingLoading) return;

    const hasOrigin = origin?.coordinates && origin.coordinates.length === 2;
    const hasDestination = destination?.coordinates && destination.coordinates.length === 2;

    if (!hasOrigin || !hasDestination) {
      showToast(
        'info',
        'Locations Required',
        'Please select both starting and ending locations first.'
      );
      setFiltersVisible(true);
      return;
    }

    try {
      setBookingRideId(rideId);
      const payload = {
        rideId,
        pickupLocation: {
          coordinates: origin.coordinates,
          ...(origin.address ? { address: origin.address } : {}),
        },
        dropoffLocation: {
          coordinates: destination.coordinates,
          ...(destination.address ? { address: destination.address } : {}),
        },
      };

      const response = await bookRide(payload).unwrap();
      if (response?.success) {
        showToast(
          'success',
          'Congratulations',
          response?.message || 'Ride booking request sent successfully.'
        );
      } else {
        showToast(
          'error',
          response?.errorCode || 'Booking Failed',
          response?.message || 'Failed to send booking request.'
        );
      }
    } catch (err) {
      showToast(
        'error',
        err?.data?.errorCode || 'Booking Failed',
        err?.data?.message || 'Something went wrong'
      );
    } finally {
      setBookingRideId(null);
    }
  };

  // Map Picker Modal State
  const [mapModalState, setMapModalState] = useState({
    visible: false,
    mode: 'select', // 'select' | 'route'
    target: 'origin', // 'origin' | 'destination'
  });

  const communityId = useSelector(selectCommunityId);
  const [locationPermissionModalVisible, setLocationPermissionModalVisible] = useState(false);
  const [gpsModalVisible, setGpsModalVisible] = useState(false);

  // Pagination states
  const [rides, setRides] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const activeSearchParamsRef = useRef(null);

  // RTK Query hook for search rides API
  const [triggerSearchRides, { data: searchApiResult, isFetching, isLoading, error: searchError }] = useLazySearchRidesQuery();

  // Handle pagination and rides state updates from API response
  useEffect(() => {
    if (searchApiResult?.data) {
      console.log('=== SEARCH RIDES API SUCCESS RESPONSE ===', searchApiResult);
      const newRides = searchApiResult.data.rides || [];
      const pagination = searchApiResult.data.pagination || {};

      if (isFetchingMore) {
        setRides(prev => {
          const existingIds = new Set(prev.map(r => r.id || r._id));
          const uniqueNew = newRides.filter(r => !existingIds.has(r.id || r._id));
          return [...prev, ...uniqueNew];
        });
        setIsFetchingMore(false);
      } else {
        setRides(newRides);
      }

      setHasMore(Boolean(pagination.hasMore));
      setNextCursor(pagination.nextCursor || null);
    }
    if (searchError) {
      console.log('=== SEARCH RIDES API ERROR ===', searchError);
      setIsFetchingMore(false);
    }
    setIsRefreshing(false);
  }, [searchApiResult, searchError]);

  const executeRideSearch = useCallback(
    (customOrigin, customDest) => {
      const origCoords = customOrigin?.coordinates || origin.coordinates;
      const destCoords = customDest?.coordinates || destination.coordinates;

      let lat = origCoords && origCoords.length === 2 ? origCoords[1] : undefined;
      let lng = origCoords && origCoords.length === 2 ? origCoords[0] : undefined;

      if (!lat || !lng) {
        if (userLocationCoords) {
          lat = userLocationCoords.latitude;
          lng = userLocationCoords.longitude;
        }
      }

      if (!lat || !lng) return;

      const params = {
        lat,
        lng,
        maxDistanceMeters: 50000,
        limit: 10,
        ...(communityId ? { communityId } : {}),
        ...(searchQuery?.trim() ? { search: searchQuery.trim() } : {}),
        ...(destCoords && destCoords.length === 2
          ? {
            destLat: destCoords[1],
            destLng: destCoords[0],
            maxDropDistanceMeters: 50000,
          }
          : {}),
      };

      setIsFetchingMore(false);
      activeSearchParamsRef.current = params;
      console.log('=== CALLING SEARCH RIDES API WITH PARAMS ===', params);
      triggerSearchRides(params);
    },
    [origin.coordinates, destination.coordinates, userLocationCoords, communityId, triggerSearchRides, searchQuery],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (activeSearchParamsRef.current) {
        await triggerSearchRides(activeSearchParamsRef.current).unwrap();
      } else {
        executeRideSearch();
      }
    } catch (err) {
      console.log('=== PULL TO REFRESH ERROR ===', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [triggerSearchRides, executeRideSearch]);

  const loadMoreRides = useCallback(() => {
    if (!hasMore || !nextCursor || isFetching || isLoading || isFetchingMore) {
      return;
    }
    if (activeSearchParamsRef.current) {
      setIsFetchingMore(true);
      const paginationParams = {
        ...activeSearchParamsRef.current,
        cursor: nextCursor,
      };
      console.log('=== LOADING MORE RIDES WITH CURSOR ===', nextCursor);
      triggerSearchRides(paginationParams);
    }
  }, [hasMore, nextCursor, isFetching, isLoading, isFetchingMore, triggerSearchRides]);

  // Initial Current Location Request & Auto-Retry on App Resume / Focus
  const fetchCurrentPosition = useCallback(async () => {
    try {
      // Step 1: Fetch lat & lng instantly from GPS/Device
      const location = await getCurrentUserLocation();
      const deviceCoords = { latitude: location.latitude, longitude: location.longitude };
      setUserLocationCoords(deviceCoords);

      // Clear any permission/GPS modals since location is active
      setGpsModalVisible(false);
      setLocationPermissionModalVisible(false);

      // Step 2: Set origin & destination coordinates
      setOriginSuggestions([]);
      setDestinationSuggestions([]);
      setOriginSelection({ start: 0, end: 0 });
      setDestSelection({ start: 0, end: 0 });
      setTimeout(() => {
        setOriginSelection(undefined);
        setDestSelection(undefined);
      }, 100);

      setOrigin(prev => ({
        address: prev.address || '',
        coordinates: location.coordinates,
      }));

      setDestination(prev => ({
        address: prev.address || '',
        coordinates: (prev.coordinates && prev.coordinates.length === 2) ? prev.coordinates : location.coordinates,
      }));

      // Auto-trigger API search for rides
      const params = {
        lat: location.latitude,
        lng: location.longitude,
        maxDistanceMeters: 50000,
        limit: 10,
        ...(communityId ? { communityId } : {}),
      };
      setIsFetchingMore(false);
      activeSearchParamsRef.current = params;
      console.log('=== AUTO CALLING SEARCH RIDES API WITH PARAMS ===', params);
      triggerSearchRides(params);

      // Step 3: Fetch address in background without blocking
      reverseGeocode(location.latitude, location.longitude).then(addressString => {
        if (addressString) {
          originInputRef.current = addressString;
          setOriginSelection({ start: 0, end: 0 });
          setTimeout(() => setOriginSelection(undefined), 150);
          setOrigin(prev => ({
            address: addressString,
            coordinates: prev.coordinates || location.coordinates,
          }));

          setDestination(prev => {
            if (!prev.address) {
              destinationInputRef.current = addressString;
              setDestSelection({ start: 0, end: 0 });
              setTimeout(() => setDestSelection(undefined), 150);
              return {
                address: addressString,
                coordinates: (prev.coordinates && prev.coordinates.length === 2) ? prev.coordinates : location.coordinates,
              };
            }
            return prev;
          });
        }
      });
    } catch (error) {
      if (error.code === 'PERMISSION_DENIED' || error.code === 1) {
        setLocationPermissionModalVisible(true);
      } else if (error.code === 2 || error.code === 'POSITION_UNAVAILABLE') {
        setGpsModalVisible(true);
      }
    }
  }, [communityId, triggerSearchRides]);

  // Fetch when screen comes into focus & open filter modal
  useFocusEffect(
    useCallback(() => {
      fetchCurrentPosition();
      setFiltersVisible(true);
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
    }, [fetchCurrentPosition, scaleAnim, opacityAnim])
  );

  // Auto-fetch when user returns from device settings / app foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        fetchCurrentPosition();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [fetchCurrentPosition]);

  const isInitialSearchQueryRender = useRef(true);

  // Debounced API call when user types in search input
  useEffect(() => {
    if (isInitialSearchQueryRender.current) {
      isInitialSearchQueryRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      executeRideSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, executeRideSearch]);

  // Fetch Place Predictions for Autocomplete
  const fetchPredictions = async (text, target) => {
    if (!text || text.trim().length < 2) {
      if (target === 'origin') setOriginSuggestions([]);
      else setDestinationSuggestions([]);
      return;
    }

    const suggestions = await fetchAddressSuggestions(text);

    const currentInputText = target === 'origin' ? originInputRef.current : destinationInputRef.current;
    if (text !== currentInputText) {
      return;
    }

    if (target === 'origin') setOriginSuggestions(suggestions);
    else setDestinationSuggestions(suggestions);
  };

  // Select Place Suggestion
  const selectPlaceSuggestion = async (item, target) => {
    if (target === 'origin') {
      originInputRef.current = item.description;
      setOriginSuggestions([]);
      setOriginSelection({ start: 0, end: 0 });
      setTimeout(() => setOriginSelection(undefined), 100);
    } else {
      destinationInputRef.current = item.description;
      setDestinationSuggestions([]);
      setDestSelection({ start: 0, end: 0 });
      setTimeout(() => setDestSelection(undefined), 100);
    }

    if (item.isFreeSearch) {
      if (target === 'origin') {
        setOrigin({
          address: item.description,
          coordinates: [item.lng, item.lat],
        });
      } else {
        setDestination({
          address: item.description,
          coordinates: [item.lng, item.lat],
        });
      }
      return;
    }

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${item.place_id}&fields=geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const data = await res.json();
      if (data.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        const newAddress = item.description || data.result.formatted_address;
        if (target === 'origin') {
          originInputRef.current = newAddress;
          setOriginSelection({ start: 0, end: 0 });
          setOrigin({
            address: newAddress,
            coordinates: [lng, lat],
          });
        } else {
          destinationInputRef.current = newAddress;
          setDestSelection({ start: 0, end: 0 });
          setDestination({
            address: newAddress,
            coordinates: [lng, lat],
          });
        }
      }
    } catch (e) {
      console.log('Google Place details error:', e);
    }
  };

  const openMapForTarget = target => {
    Keyboard.dismiss();
    setOriginSuggestions([]);
    setDestinationSuggestions([]);
    setMapModalState({
      visible: true,
      mode: 'select',
      target,
    });
  };

  const handleConfirmLocation = data => {
    if (mapModalState.target === 'origin') {
      originInputRef.current = data.address;
      setOriginSelection({ start: 0, end: 0 });
      setTimeout(() => setOriginSelection(undefined), 100);
      setOrigin({
        address: data.address,
        coordinates: data.coordinates, // [lng, lat]
      });
    } else {
      destinationInputRef.current = data.address;
      setDestSelection({ start: 0, end: 0 });
      setTimeout(() => setDestSelection(undefined), 100);
      setDestination({
        address: data.address,
        coordinates: data.coordinates, // [destLng, destLat]
      });
    }
  };

  const handleClearOrigin = () => {
    originInputRef.current = '';
    setOriginSelection(undefined);
    setOrigin({ address: '', coordinates: [] });
    setOriginSuggestions([]);
  };

  const handleClearDestination = () => {
    destinationInputRef.current = '';
    setDestSelection(undefined);
    setDestination({ address: '', coordinates: [] });
    setDestinationSuggestions([]);
  };

  const originCoordsObj =
    origin.coordinates && origin.coordinates.length === 2
      ? { latitude: origin.coordinates[1], longitude: origin.coordinates[0] }
      : userLocationCoords;

  const destinationCoordsObj =
    destination.coordinates && destination.coordinates.length === 2
      ? { latitude: destination.coordinates[1], longitude: destination.coordinates[0] }
      : userLocationCoords;

  const toggleFilters = () => {
    if (filtersVisible) {
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
      ]).start(({ finished }) => {
        if (finished) {
          setFiltersVisible(false);
        }
      });
    } else {
      setFiltersVisible(true);
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
  };

  return (
    <Wrapper bgColor={AppColors.grayBG}>
      <AppHeader title="Find Rides" />
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <AppTextInput
            inputPlaceHolder="Search by Location or driver name"
            containerBg="#F6F8FD"
            borderColor="#E4E9F5"
            borderWidth={1}
            inputWidth={68}
            borderRadius={16}
            logo={<SVGXml icon={AppIcons.search} width={18} height={18} />}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => executeRideSearch()}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
          <SVGXml icon={AppIcons.filter} width={18} height={18} />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        hardwareAccelerated={true}
        statusBarTranslucent={true}
        visible={filtersVisible}
        onRequestClose={toggleFilters}
      >
        <Animated.View
          renderToHardwareTextureAndroid={true}
          style={[
            styles.modalOverlay,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={toggleFilters}
          />
          <TouchableOpacity activeOpacity={1} style={styles.modalCardContainer}>
            <View style={styles.filterModalHeader}>
              <AppText title="Filter & Search Locations" textColor={AppColors.BLACK} textSize={2.0} textFontWeight />
              <TouchableOpacity onPress={toggleFilters} style={styles.closeBtn}>
                <AppText title="✕" textColor={AppColors.BLACK} textSize={2.0} textFontWeight />
              </TouchableOpacity>
            </View>

            {/* Pickup / Starting Point (lat, lng) */}
            <View style={styles.filterGroup}>
              <AppText title="Pickup Location (Starting Point)" textColor={AppColors.BLACK} textSize={1.5} textFontWeight />
              <View style={styles.inputWithIconRow}>
                <TouchableOpacity
                  style={styles.mapIconBtn}
                  onPress={() => openMapForTarget('origin')}
                >
                  <SVGXml icon={AppIcons.location} width={responsiveWidth(5)} height={responsiveWidth(5)} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <AppTextInput
                    value={origin.address}
                    onChangeText={text => {
                      setOriginSelection(undefined);
                      originInputRef.current = text;
                      setOrigin(prev => ({ ...prev, address: text }));
                      fetchPredictions(text, 'origin');
                    }}
                    inputPlaceHolder="Select starting location"
                    containerBg="#F6F8FD"
                    borderColor="#E4E9F5"
                    borderWidth={1}
                    selection={isOriginFocused ? originSelection : (origin.address ? { start: 0, end: 0 } : undefined)}
                    onFocus={() => {
                      setIsOriginFocused(true);
                      setOriginSelection(undefined);
                    }}
                    onBlur={() => {
                      setIsOriginFocused(false);
                      setOriginSelection({ start: 0, end: 0 });
                    }}
                    onSelectionChange={() => {
                      if (isOriginFocused) setOriginSelection(undefined);
                    }}
                    inputWidth={56}
                    rightIcon={
                      Boolean(origin.address) ? (
                        <TouchableOpacity onPress={handleClearOrigin} activeOpacity={0.7} style={{ paddingHorizontal: responsiveWidth(1) }}>
                          <AppText title="✕" textColor={AppColors.DARKGRAY} textSize={1.6} textFontWeight />
                        </TouchableOpacity>
                      ) : null
                    }
                  />
                </View>
              </View>

              {/* Origin Autocomplete Suggestions */}
              {originSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {originSuggestions.map(item => (
                    <TouchableOpacity
                      key={item.place_id}
                      style={styles.suggestionItem}
                      onPress={() => selectPlaceSuggestion(item, 'origin')}
                    >
                      <AppText title={item.description} textColor={AppColors.BLACK} textSize={1.4} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Drop-off / Ending Point (destLat, destLng) */}
            <View style={styles.filterGroup}>
              <AppText title="Drop-off Location (Ending Point)" textColor={AppColors.BLACK} textSize={1.5} textFontWeight />
              <View style={styles.inputWithIconRow}>
                <TouchableOpacity
                  style={styles.mapIconBtn}
                  onPress={() => openMapForTarget('destination')}
                >
                  <SVGXml icon={AppIcons.location} width={responsiveWidth(5)} height={responsiveWidth(5)} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <AppTextInput
                    value={destination.address}
                    onChangeText={text => {
                      setDestSelection(undefined);
                      destinationInputRef.current = text;
                      setDestination(prev => ({ ...prev, address: text }));
                      fetchPredictions(text, 'destination');
                    }}
                    inputPlaceHolder="Select ending location"
                    containerBg="#F6F8FD"
                    borderColor="#E4E9F5"
                    borderWidth={1}
                    selection={isDestFocused ? destSelection : (destination.address ? { start: 0, end: 0 } : undefined)}
                    onFocus={() => {
                      setIsDestFocused(true);
                      setDestSelection(undefined);
                    }}
                    onBlur={() => {
                      setIsDestFocused(false);
                      setDestSelection({ start: 0, end: 0 });
                    }}
                    onSelectionChange={() => {
                      if (isDestFocused) setDestSelection(undefined);
                    }}
                    inputWidth={56}
                    rightIcon={
                      Boolean(destination.address) ? (
                        <TouchableOpacity onPress={handleClearDestination} activeOpacity={0.7} style={{ paddingHorizontal: responsiveWidth(1) }}>
                          <AppText title="✕" textColor={AppColors.DARKGRAY} textSize={1.6} textFontWeight />
                        </TouchableOpacity>
                      ) : null
                    }
                  />
                </View>
              </View>

              {/* Destination Autocomplete Suggestions */}
              {destinationSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {destinationSuggestions.map(item => (
                    <TouchableOpacity
                      key={item.place_id}
                      style={styles.suggestionItem}
                      onPress={() => selectPlaceSuggestion(item, 'destination')}
                    >
                      <AppText title={item.description} textColor={AppColors.BLACK} textSize={1.4} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.applyFilterBtn}
              onPress={() => {
                executeRideSearch();
                toggleFilters();
              }}
            >
              <AppText title="Apply Filters & Search" textColor={AppColors.WHITE} textSize={1.8} textFontWeight textAlignment="center" />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      <View style={styles.cardsContainer}>
        {(isFetching || isLoading) && !isFetchingMore && rides.length === 0 ? (
          <View style={{ gap: responsiveHeight(2), paddingTop: responsiveHeight(1) }}>
            <RideCardSkeleton />
            <RideCardSkeleton />
          </View>
        ) : (
          <FlatList
            data={rides}
            keyExtractor={(item, index) => `${item.id || item._id || index}`}
            renderItem={({ item: ride }) => {
              const rideId = ride?.id || ride?._id;
              const isBookingThisRide = isBookingLoading && bookingRideId === rideId;
              const isAnyRideBooking = isBookingLoading;

              return (
                <RideCard
                  key={rideId}
                  ride={ride}
                  loading={isBookingThisRide}
                  disabled={isAnyRideBooking}
                  onRequestPress={() => handleRequestRide(ride)}
                />
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[AppColors.ThemeColor]}
                tintColor={AppColors.ThemeColor}
              />
            }
            onEndReached={loadMoreRides}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              isFetchingMore ? (
                <View style={{ marginTop: responsiveHeight(1) }}>
                  <RideCardSkeleton />
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AppText
                  title={searchError ? 'Failed to load rides. Please try again.' : 'No rides found.'}
                  textColor={AppColors.GRAY}
                  textSize={1.6}
                  textAlignment="center"
                />
              </View>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + responsiveHeight(5), paddingTop: responsiveHeight(1) }}
            ItemSeparatorComponent={() => <View style={{ height: responsiveHeight(1) }} />}
          />
        )}
      </View>

      {/* Reusable Location & Route Map Modal */}
      <LocationMapModal
        visible={mapModalState.visible}
        mode={mapModalState.mode}
        title={mapModalState.target === 'origin' ? 'Select Pickup Location' : 'Select Drop-off Location'}
        initialCoords={mapModalState.target === 'origin' ? originCoordsObj : destinationCoordsObj}
        originCoords={originCoordsObj}
        destinationCoords={destinationCoordsObj}
        originAddress={origin.address}
        destinationAddress={destination.address}
        onClose={() => setMapModalState(prev => ({ ...prev, visible: false }))}
        onConfirmLocation={handleConfirmLocation}
        onGpsError={() => setGpsModalVisible(true)}
      />

      {/* Location Permission Denied Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={locationPermissionModalVisible}
        onRequestClose={() => setLocationPermissionModalVisible(false)}
      >
        <View style={styles.permissionModalOverlay}>
          <View style={styles.permissionModalCard}>
            <View style={styles.permissionIconCircle}>
              <SVGXml icon={AppIcons.location} width={responsiveWidth(8)} height={responsiveWidth(8)} />
            </View>

            <AppText
              title="Location Permission Required"
              textColor={AppColors.BLACK}
              textSize={2.2}
              textFontWeight
              textAlign="center"
            />

            <AppText
              title="Location permission was denied. Please enable it in Settings to automatically set your origin location."
              textColor={AppColors.DARKGRAY}
              textSize={1.5}
              textAlign="center"
            />

            <View style={styles.permissionModalActions}>
              <TouchableOpacity
                style={styles.permissionCancelBtn}
                onPress={() => setLocationPermissionModalVisible(false)}
              >
                <AppText title="Cancel" textColor={AppColors.DARKGRAY} textSize={1.6} textFontWeight />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.permissionSettingsBtn}
                onPress={() => {
                  setLocationPermissionModalVisible(false);
                  Linking.openSettings();
                }}
              >
                <AppText title="Open Settings" textColor={AppColors.WHITE} textSize={1.6} textFontWeight />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Location Services Disabled Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={gpsModalVisible}
        onRequestClose={() => setGpsModalVisible(false)}
      >
        <View style={styles.permissionModalOverlay}>
          <View style={styles.permissionModalCard}>
            <View style={styles.permissionIconCircle}>
              <SVGXml icon={AppIcons.location} width={responsiveWidth(8)} height={responsiveWidth(8)} />
            </View>

            <AppText
              title="Location Services Disabled"
              textColor={AppColors.BLACK}
              textSize={2.2}
              textFontWeight
              textAlign="center"
            />

            <AppText
              title="Your device's location services (GPS) are turned off. Please turn them on in Settings to automatically set your origin location."
              textColor={AppColors.DARKGRAY}
              textSize={1.5}
              textAlign="center"
            />

            <View style={styles.permissionModalActions}>
              <TouchableOpacity
                style={styles.permissionCancelBtn}
                onPress={() => setGpsModalVisible(false)}
              >
                <AppText title="Cancel" textColor={AppColors.DARKGRAY} textSize={1.6} textFontWeight />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.permissionSettingsBtn}
                onPress={() => {
                  setGpsModalVisible(false);
                  Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
                    .catch(err => console.log('Error opening location settings:', err));
                }}
              >
                <AppText title="Turn On" textColor={AppColors.WHITE} textSize={1.6} textFontWeight />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(3),
    gap: responsiveHeight(2.5),
  },
  emptyContainer: {
    paddingVertical: responsiveHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: AppColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  searchRow: {
    flexDirection: 'row',
    gap: responsiveWidth(3),
    alignItems: 'center',
    paddingBottom: responsiveWidth(1)
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: AppColors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E9F5',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardsContainer: {
    flex: 1,
    position: 'relative',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  modalCardContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: AppColors.WHITE,
    borderRadius: 24,
    padding: responsiveWidth(5),
    gap: responsiveHeight(1.8),
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: responsiveHeight(0.5),
  },
  closeBtn: {
    padding: responsiveWidth(1.5),
  },
  inputWithIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  mapIconBtn: {
    backgroundColor: '#E5F1FF',
    padding: responsiveWidth(3.5),
    borderRadius: responsiveWidth(3),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 2,
  },
  suggestionsContainer: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 4,
    // maxHeight: 160,
    zIndex: 999,
  },
  suggestionItem: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.2),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  applyFilterBtn: {
    backgroundColor: AppColors.BLACK,
    borderRadius: 14,
    paddingVertical: responsiveHeight(1.5),
    marginTop: responsiveHeight(0.5),
    alignItems: 'center',
  },
  permissionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  permissionModalCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 20,
    padding: responsiveWidth(6),
    alignItems: 'center',
    gap: responsiveHeight(1.5),
    width: '100%',
    maxWidth: 340,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  permissionIconCircle: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    backgroundColor: '#E5F1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  permissionModalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: responsiveHeight(1),
    gap: responsiveWidth(3),
  },
  permissionCancelBtn: {
    flex: 1,
    paddingVertical: responsiveHeight(1.2),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  permissionSettingsBtn: {
    flex: 1,
    paddingVertical: responsiveHeight(1.2),
    borderRadius: 10,
    backgroundColor: '#0D7CF4',
    alignItems: 'center',
  },
  cardsContainerDimmed: {
    opacity: 0.45,
  },
  cardsDimOverlay: {
    position: 'absolute',
    top: -responsiveHeight(0.5),
    left: -responsiveWidth(1),
    right: -responsiveWidth(1),
    bottom: -responsiveHeight(0.5),
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
    borderRadius: 32,
    zIndex: 2,
  },
  filterPanel: {
    backgroundColor: '#F7F9FD',
    borderRadius: 20,
    padding: responsiveWidth(4),
    gap: responsiveHeight(1.8),
  },
  filterGroup: {
    gap: responsiveHeight(0.8),
  },
  resultsCount: {
    paddingTop: responsiveHeight(0.5),
  },
});

export default FindRides;
