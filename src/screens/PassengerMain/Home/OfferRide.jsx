import React, { useState, useEffect, useRef, useCallback } from 'react';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Keyboard,
  AppState,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import AppButton from '../../../components/AppButton';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import Wrapper from '../../../components/Wrapper';
import AppHeader from '../../../components/AppHeader';
import BoxShadow from '../../../components/BoxShadow';
import AppKeyboardAvoidingView from '../../../components/AppKeyboardAvoidingView';
import LocationMapModal from '../../../components/LocationMapModal';
import { getCurrentUserLocation, reverseGeocode, fetchAddressSuggestions, fetchRouteWaypoints } from '../../../utils/locationHelper';
import { useSelector } from 'react-redux';
import { selectCommunityId } from '../../../redux/slices/authSlice';
import { useOfferRideMutation } from '../../../redux/api/apiSlice';
import { showToast } from '../../../utils/toast';
import { GOOGLE_MAPS_API_KEY } from '../../../redux/constant';

const OfferRide = () => {
  const navigation = useNavigation();
  const communityId = useSelector(selectCommunityId);

  const originInputRef = useRef('');
  const destinationInputRef = useRef('');

  const [offerRideMutation, { isLoading: isPosting }] = useOfferRideMutation();
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State structure: address (string), coordinates: [longitude, latitude]
  const [origin, setOrigin] = useState({
    address: '',
    coordinates: [],
  });
  const [destination, setDestination] = useState({
    address: '',
    coordinates: [],
  });

  // Autocomplete Suggestions State
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  // Unified Map Modal State
  const [mapModalState, setMapModalState] = useState({
    visible: false,
    mode: 'select', // 'select' | 'route'
    target: 'origin', // 'origin' | 'destination'
  });

  const [locationPermissionModalVisible, setLocationPermissionModalVisible] = useState(false);
  const [gpsModalVisible, setGpsModalVisible] = useState(false);
  const [originSelection, setOriginSelection] = useState(undefined);
  const [destSelection, setDestSelection] = useState(undefined);
  const [userLocationCoords, setUserLocationCoords] = useState(null);

  const [rideDate, setRideDate] = useState(null);
  const [rideTime, setRideTime] = useState(null);
  const [seats, setSeats] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');

  const [iosPickerState, setIosPickerState] = useState({
    visible: false,
    mode: 'date',
    value: new Date(),
    target: 'date',
  });

  // Helper: Fetch Place Predictions for Autocomplete using reusable helper
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

  // Helper: Select Place Suggestion
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
      setOriginSelection({ start: 0, end: 0 });
      setTimeout(() => setOriginSelection(undefined), 100);
      setOrigin(prev => ({
        address: prev.address || '',
        coordinates: location.coordinates,
      }));
      setDestination(prev => ({
        address: prev.address || '',
        coordinates: (prev.coordinates && prev.coordinates.length === 2) ? prev.coordinates : location.coordinates,
      }));

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
        }
      });
    } catch (error) {
      if (error.code === 'PERMISSION_DENIED' || error.code === 1) {
        setLocationPermissionModalVisible(true);
      } else if (error.code === 2 || error.code === 'POSITION_UNAVAILABLE') {
        // Only show GPS disabled modal when location services are actually OFF
        setGpsModalVisible(true);
      }
    }
  }, []);

  // Fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCurrentPosition();
    }, [fetchCurrentPosition])
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

  const handleShowRoute = () => {
    setMapModalState({
      visible: true,
      mode: 'route',
      target: 'origin',
    });
  };

  const handleConfirmLocation = ({ address, coordinates }) => {
    if (mapModalState.target === 'origin') {
      originInputRef.current = address;
      setOriginSuggestions([]);
      setOriginSelection({ start: 0, end: 0 });
      setTimeout(() => setOriginSelection(undefined), 100);
      setOrigin({
        address,
        coordinates,
      });
    } else {
      destinationInputRef.current = address;
      setDestinationSuggestions([]);
      setDestSelection({ start: 0, end: 0 });
      setTimeout(() => setDestSelection(undefined), 100);
      setDestination({
        address,
        coordinates,
      });
    }
  };

  const handleClearOrigin = () => {
    originInputRef.current = '';
    setOriginSuggestions([]);
    setOriginSelection(undefined);
    setOrigin({
      address: '',
      coordinates: [],
    });
  };

  const handleClearDestination = () => {
    destinationInputRef.current = '';
    setDestinationSuggestions([]);
    setDestSelection(undefined);
    setDestination({
      address: '',
      coordinates: [],
    });
  };

  const formatDate = dateValue =>
    new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(dateValue);

  const formatTime = timeValue =>
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(timeValue);

  const applyDateChange = selectedDate => {
    if (!selectedDate) return;
    const normalized = new Date(selectedDate);
    normalized.setHours(0, 0, 0, 0);
    setRideDate(normalized);
  };

  const applyTimeChange = selectedDate => {
    if (!selectedDate) return;
    const normalized = new Date(selectedDate);
    normalized.setFullYear(1970, 0, 1);
    setRideTime(normalized);
  };

  const openPicker = type => {
    const currentValue = (type === 'date' ? rideDate : rideTime) || new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: type,
        value: currentValue,
        minimumDate: type === 'date' ? new Date() : undefined,
        is24Hour: false,
        onChange: (event, selectedDate) => {
          if (event.type !== 'set' || !selectedDate) return;
          if (type === 'date') applyDateChange(selectedDate);
          else applyTimeChange(selectedDate);
        },
      });
      return;
    }

    setIosPickerState({
      visible: true,
      mode: type,
      value: currentValue,
      target: type,
    });
  };

  const handleIosChange = (_event, selectedDate) => {
    if (!selectedDate) return;
    setIosPickerState(prev => ({ ...prev, value: selectedDate }));
  };

  const handleIosCancel = () => {
    setIosPickerState(prev => ({ ...prev, visible: false }));
  };

  const handleIosConfirm = () => {
    if (iosPickerState.target === 'date') {
      applyDateChange(iosPickerState.value);
    } else {
      applyTimeChange(iosPickerState.value);
    }
    setIosPickerState(prev => ({ ...prev, visible: false }));
  };

  const handlePostRide = async () => {
    if (isPosting || isRouteLoading || isSubmitted) return;
    if (!communityId) {
      showToast('error', 'Error', 'Please join a community first to post a ride.');
      return;
    }
    if (!origin.address || !origin.coordinates || origin.coordinates.length !== 2) {
      showToast('error', 'Error', 'Please select a valid origin address.');
      return;
    }
    if (!destination.address || !destination.coordinates || destination.coordinates.length !== 2) {
      showToast('error', 'Error', 'Please select a valid destination address.');
      return;
    }
    if (!rideDate || !rideTime) {
      showToast('error', 'Error', 'Please select departure date and time.');
      return;
    }
    const totalSeats = Number(seats);
    if (!seats || isNaN(totalSeats) || totalSeats < 1 || totalSeats > 8) {
      showToast('error', 'Error', 'Seats offered must be between 1 and 8.');
      return;
    }
    if (!make.trim() || !model.trim() || !color.trim() || !plate.trim()) {
      showToast('error', 'Error', 'Please fill in all car information.');
      return;
    }

    let departureTime = null;
    const dateStr = moment(rideDate).format('YYYY-MM-DD');
    const timeStr = moment(rideTime).format('HH:mm:ss');
    departureTime = moment(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm:ss').toISOString();

    setIsRouteLoading(true);
    try {
      // Fetch actual driving route waypoints between origin & destination
      const routeInfo = await fetchRouteWaypoints(origin.coordinates, destination.coordinates);
      console.log('[OfferRide] Route Info:', routeInfo.sampledWaypoints);
      const payload = {
        communityId,
        origin: {
          address: origin.address,
          coordinates: origin.coordinates,
        },
        destination: {
          address: destination.address,
          coordinates: destination.coordinates,
        },
        waypoints: routeInfo.sampledWaypoints,
        distanceKm: Number(routeInfo.distanceKm),
        departureTime,
        totalSeats,
        vehicle: {
          make: make.trim(),
          model: model.trim(),
          color: color.trim(),
          licensePlate: plate.trim().toUpperCase(),
        },
      };

      const response = await offerRideMutation(payload).unwrap();
      if (response.success) {
        setIsSubmitted(true);
        showToast(
          'success',
          'Success',
          response.message || 'Ride posted successfully.',
          () => { navigation.goBack(); },
        );
      } else {
        showToast(
          'error',
          response.errorCode || 'Failed to post ride',
          response.message || 'Something went wrong'
        );
      }
    } catch (err) {
      console.log('[OfferRide] Post ride error:', err);
      showToast(
        'error',
        err?.data?.errorCode || 'Failed to post ride',
        err?.data?.message || err?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsRouteLoading(false);
    }
  };

  const originCoordsObj =
    origin.coordinates && origin.coordinates.length === 2
      ? { latitude: origin.coordinates[1], longitude: origin.coordinates[0] }
      : userLocationCoords;

  const destinationCoordsObj =
    destination.coordinates && destination.coordinates.length === 2
      ? { latitude: destination.coordinates[1], longitude: destination.coordinates[0] }
      : userLocationCoords;

  return (
    <Wrapper bgColor={AppColors.grayBG}>
      <AppHeader title="Offer a Ride" description="Fill in the details of your upcoming trip" />
      <AppKeyboardAvoidingView isScrollable={true} contentContainerStyle={styles.keyboardScrollContent}>
        <BoxShadow scroll={false} style={styles.formCard}>
          <View style={styles.formGroup}>
            <SectionHeading label="Route" icon={AppIcons.location} />

            {/* Origin Input Row */}
            <AppText title="Origin" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
            <View style={styles.inputWithIconRow}>
              <View style={{ flex: 1 }}>
                <AppTextInput
                  value={origin.address}
                  onChangeText={text => {
                    setOriginSelection(undefined);
                    originInputRef.current = text;
                    setOrigin(prev => ({ ...prev, address: text }));
                    fetchPredictions(text, 'origin');
                  }}
                  inputPlaceHolder="Enter origin address"
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  selection={originSelection}
                  onFocus={() => setOriginSelection(undefined)}
                  onSelectionChange={() => setOriginSelection(undefined)}
                  inputWidth={60}
                  rightIcon={
                    Boolean(origin.address) ? (
                      <TouchableOpacity
                        onPress={handleClearOrigin}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={{ paddingHorizontal: responsiveWidth(1) }}
                      >
                        <AppText title="✕" textColor={AppColors.DARKGRAY} textSize={1.6} textFontWeight />
                      </TouchableOpacity>
                    ) : null
                  }
                />
              </View>
              <TouchableOpacity
                style={styles.mapIconBtn}
                onPress={() => openMapForTarget('origin')}
              >
                <SVGXml icon={AppIcons.location} width={responsiveWidth(5)} height={responsiveWidth(5)} />
              </TouchableOpacity>
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

            {/* Destination Input Row */}
            <View style={{ marginTop: responsiveHeight(1.5) }}>
              <AppText title="Destination" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
              <View style={styles.inputWithIconRow}>
                <View style={{ flex: 1 }}>
                  <AppTextInput
                    value={destination.address}
                    onChangeText={text => {
                      setDestSelection(undefined);
                      destinationInputRef.current = text;
                      setDestination(prev => ({ ...prev, address: text }));
                      fetchPredictions(text, 'destination');
                    }}
                    inputPlaceHolder="Enter destination address"
                    containerBg={styles.inputBg.backgroundColor}
                    borderColor="transparent"
                    borderWidth={1}
                    selection={destSelection}
                    onFocus={() => setDestSelection(undefined)}
                    onSelectionChange={() => setDestSelection(undefined)}
                    inputWidth={60}
                    rightIcon={
                      Boolean(destination.address) ? (
                        <TouchableOpacity
                          onPress={handleClearDestination}
                          activeOpacity={0.7}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={{ paddingHorizontal: responsiveWidth(1) }}
                        >
                          <AppText title="✕" textColor={AppColors.DARKGRAY} textSize={1.6} textFontWeight />
                        </TouchableOpacity>
                      ) : null
                    }
                  />
                </View>
                <TouchableOpacity
                  style={styles.mapIconBtn}
                  onPress={() => openMapForTarget('destination')}
                >
                  <SVGXml icon={AppIcons.location} width={responsiveWidth(5)} height={responsiveWidth(5)} />
                </TouchableOpacity>
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

              {Boolean(
                origin.coordinates &&
                origin.coordinates.length === 2 &&
                destination.coordinates &&
                destination.coordinates.length === 2 &&
                origin.address &&
                origin.address.trim().length > 0 &&
                destination.address &&
                destination.address.trim().length > 0
              ) && (
                  <TouchableOpacity
                    style={styles.showRouteContainer}
                    onPress={handleShowRoute}
                    activeOpacity={0.7}
                  >
                    <AppText
                      title="Show Route ↗"
                      textColor={AppColors.ThemeColor}
                      textSize={1.6}
                      textFontWeight
                    />
                  </TouchableOpacity>
                )}
            </View>
          </View>

          {/* Schedule Section */}
          <View style={styles.formGroup}>
            <SectionHeading label="Schedule" iconColor="#0D7CF4" icon={AppIcons.calendar} />
            <View style={styles.inlineRow}>
              <View style={{ flex: 1, gap: responsiveWidth(1) }}>
                <AppText title="Date" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => openPicker('date')}
                  style={styles.touchableField}
                >
                  <AppTextInput
                    value={rideDate ? formatDate(rideDate) : ''}
                    inputPlaceHolder="Select Date"
                    containerBg={styles.inputBg.backgroundColor}
                    borderColor="transparent"
                    borderWidth={1}
                    inputWidth={42}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, gap: responsiveWidth(1) }}>
                <AppText title="Time" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => openPicker('time')}
                  style={styles.touchableField}
                >
                  <AppTextInput
                    value={rideTime ? formatTime(rideTime) : ''}
                    inputPlaceHolder="Select Time"
                    containerBg={styles.inputBg.backgroundColor}
                    borderColor="transparent"
                    borderWidth={1}
                    inputWidth={42}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Available Seats Section */}
          <View style={styles.formGroup}>
            <SectionHeading label="Available Seats" iconColor="#0D7CF4" icon={AppIcons.users} />
            <AppText title="Seats" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
            <AppTextInput
              value={seats}
              onChangeText={setSeats}
              inputPlaceHolder="Enter seats"
              containerBg={styles.inputBg.backgroundColor}
              borderColor="transparent"
              borderWidth={1}
              inputWidth={80}
              keyboardType="numeric"
            />
          </View>

          {/* Car Information Section */}
          <View style={styles.formGroup}>
            <SectionHeading label="Car Information" iconColor="#0D7CF4" icon={AppIcons.car} />
            <View style={styles.inlineRow}>
              <View style={{ flex: 1, gap: responsiveWidth(1) }}>
                <AppText title="Make" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <AppTextInput
                  value={make}
                  onChangeText={setMake}
                  inputPlaceHolder="Enter make"
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  inputWidth={42}
                />
              </View>
              <View style={{ flex: 1, gap: responsiveWidth(1) }}>
                <AppText title="Model" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <AppTextInput
                  value={model}
                  onChangeText={setModel}
                  inputPlaceHolder="Enter model"
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  inputWidth={42}
                />
              </View>
            </View>
            <View style={styles.inlineRow}>
              <View style={{ flex: 1, gap: responsiveWidth(1) }}>
                <AppText title="Color" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <AppTextInput
                  value={color}
                  onChangeText={setColor}
                  inputPlaceHolder="Enter color"
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  inputWidth={42}
                />
              </View>
              <View style={{ flex: 1, gap: responsiveWidth(1) }}>
                <AppText title="License Plate" textColor={AppColors.BLACK} textSize={1.8} textFontWeight />
                <AppTextInput
                  value={plate}
                  onChangeText={setPlate}
                  inputPlaceHolder="Enter license plate"
                  containerBg={styles.inputBg.backgroundColor}
                  borderColor="transparent"
                  borderWidth={1}
                  inputWidth={42}
                />
              </View>
            </View>
          </View>

          <AppButton
            title="Post Ride"
            bgColor={AppColors.BLACK}
            handlePress={handlePostRide}
            textSize={2}
            loading={isPosting || isRouteLoading}
            disabled={isPosting || isRouteLoading || isSubmitted}
            loaderSize="small"
          />
        </BoxShadow>
      </AppKeyboardAvoidingView>

      {/* iOS Date/Time Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent
          visible={iosPickerState.visible}
          onRequestClose={handleIosCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.pickerSheet}>
              <View style={styles.pickerActions}>
                <TouchableOpacity onPress={handleIosCancel}>
                  <AppText title="Cancel" textColor={AppColors.DARKGRAY} textSize={1.6} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleIosConfirm}>
                  <AppText title="Done" textColor={AppColors.ThemeColor} textFontWeight textSize={1.6} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={iosPickerState.value}
                mode={iosPickerState.mode}
                minimumDate={iosPickerState.mode === 'date' ? new Date() : undefined}
                display="spinner"
                onChange={handleIosChange}
                style={{ backgroundColor: AppColors.WHITE }}
                textColor={AppColors.BLACK}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Reusable Location & Route Map Modal */}
      <LocationMapModal
        visible={mapModalState.visible}
        mode={mapModalState.mode}
        title={
          mapModalState.mode === 'route'
            ? 'Route Preview'
            : mapModalState.target === 'origin'
              ? 'Select Origin Location'
              : 'Select Destination Location'
        }
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
  formCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(4),
    gap: responsiveHeight(2),
  },
  keyboardScrollContent: {
    paddingVertical: responsiveHeight(2),
    paddingBottom: responsiveHeight(4),
  },
  formGroup: {
    gap: responsiveWidth(1),
  },
  inlineRow: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
  },
  inputBg: {
    backgroundColor: '#F4F6FB',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    marginBottom: responsiveHeight(0.5),
  },
  touchableField: {
    width: '100%',
  },
  inputWithIconRow: {
    flexDirection: 'row-reverse',
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
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 4,
    zIndex: 999,
  },
  suggestionItem: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.2),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.35)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: AppColors.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: responsiveHeight(4),
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7EC',
  },
  showRouteContainer: {
    alignSelf: 'flex-end',
    marginTop: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.5),
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
});

const SectionHeading = ({ label, iconColor = '#0D7CF4', icon }) => (
  <View style={styles.headingRow}>
    <View>
      {icon ? (
        <SVGXml icon={icon} width={responsiveWidth(6)} height={responsiveWidth(6)} />
      ) : (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: iconColor,
          }}
        />
      )}
    </View>
    <AppText title={label} textColor={iconColor} textFontWeight textSize={1.9} />
  </View>
);

export default OfferRide;
