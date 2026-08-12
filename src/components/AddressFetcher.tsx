import React, { useState, useEffect, useRef } from 'react';
import AppText from './AppText';
import { reverseGeocode } from '../utils/locationHelper';

export interface AddressFetcherProps {
  latitude?: number | null;
  longitude?: number | null;
  onAddressFetched?: (address: string) => void;
  fallbackText?: string;
  textColor?: string;
  textSize?: number;
  textFontWeight?: boolean;
  textAlignment?: string;
  numberOfLines?: number;
  marginTop?: number;
  marginBottom?: number;
  lineHeight?: number;
}

/**
 * AddressFetcher Component
 * Takes `latitude` and `longitude` props, fetches address asynchronously in background,
 * and renders readable address or passes it via `onAddressFetched` callback.
 */
const AddressFetcher: React.FC<AddressFetcherProps> = ({
  latitude,
  longitude,
  onAddressFetched,
  fallbackText = 'Fetching address...',
  textColor,
  textSize,
  textFontWeight,
  textAlignment,
  numberOfLines,
  marginTop,
  marginBottom,
  lineHeight,
}) => {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onAddressFetchedRef = useRef(onAddressFetched);
  useEffect(() => {
    onAddressFetchedRef.current = onAddressFetched;
  }, [onAddressFetched]);

  useEffect(() => {
    console.log('[DEBUG AddressFetcher] Props changed -> lat:', latitude, 'lng:', longitude);
    const hasValidCoords =
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      !isNaN(latitude) &&
      !isNaN(longitude);

    if (hasValidCoords) {
      let isMounted = true;
      setLoading(true);

      reverseGeocode(latitude, longitude).then(res => {
        console.log('[DEBUG AddressFetcher] reverseGeocode returned:', res);
        if (isMounted) {
          const resolvedAddress = res || '';
          setAddress(resolvedAddress);
          setLoading(false);
          if (onAddressFetchedRef.current) {
            onAddressFetchedRef.current(resolvedAddress);
          }
        }
      });

      return () => {
        isMounted = false;
      };
    } else {
      console.log('[DEBUG AddressFetcher] Invalid coords passed -> lat:', latitude, 'lng:', longitude);
      setAddress('');
      setLoading(false);
    }
  }, [latitude, longitude]);

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  return (
    <AppText
      title={loading ? fallbackText : address || fallbackText}
      textColor={textColor}
      textSize={textSize}
      textFontWeight={textFontWeight}
      textAlignment={textAlignment}
      numberOfLines={numberOfLines}
      marginTop={marginTop}
      marginBottom={marginBottom}
      lineHeight={lineHeight}
    />
  );
};

export default AddressFetcher;
