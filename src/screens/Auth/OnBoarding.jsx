import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppText';
import { useNavigation } from '@react-navigation/native';
import { AppImages } from '../../assets/images';
import AppButton from '../../components/AppButton';
import Wrapper from '../../components/Wrapper';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../../redux/slices/authSlice';

const { width } = Dimensions.get('window');

const OnBoarding = () => {
  const authToken = useSelector(selectAuthToken);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);

  const slides = useMemo(
    () => [
      {
        key: '1',
        title: 'Welcome to Rideshare',
        text: 'Share rides with your ride-share community members or group, not strangers',
        image: AppImages.stepOne,
      },
      {
        key: '2',
        title: 'Choose Your Ride',
        text: 'Simple, safe, and affordable travel.',
        image: AppImages.stepTwo,
      },
      {
        key: '3',
        title: 'Trusted rides, lower costs',
        text: 'Built on trust, for your community',
        image: AppImages.stepThree,
      },
    ],
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      sliderRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      return;
    }
    navigation.replace('Login');
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sliderRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });

    return (
      <View style={{ width }}>
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
          <Image source={item.image} style={styles.image} />
        </Animated.View>
      </View>
    );
  };

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 32, 8],
          extrapolate: 'clamp',
        });
        const dotOpacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={index}
            style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
          />
        );
      })}
    </View>
  );

  return (
    <Wrapper style={styles.container} paddingHorizontal={false}>
      <View>
        <Animated.FlatList
          ref={sliderRef}
          data={slides}
          keyExtractor={item => item.key}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={16}
        />
        {renderPagination()}
        <View style={styles.textView}>
          <AppText title={slides[currentIndex].title}
            textColor={AppColors.DARKGRAY} textFontWeight textSize={2.5} />
          <AppText title={slides[currentIndex].text} textColor={AppColors.BLACK} textFontWeight
            textSize={3.5} marginTop={1} />
        </View>
      </View>
      <View style={styles.actionGroup}>
        <AppButton
          title={'Skip'}
          handlePress={handleSkip}
          bgColor={AppColors.LIGHTGRAY}
          textColor={AppColors.darkGray}
          buttoWidth={45}
        />
        <AppButton
          title={currentIndex === slides.length - 1 ? 'Get started' : 'Next'}
          handlePress={handleNext}
          bgColor={AppColors.ThemeColor}
          textColor={AppColors.WHITE}
          buttoWidth={45}
        />
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  image: {
    width: responsiveWidth(),
    resizeMode: 'contain',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(1.5),
  },
  dot: {
    height: 8,
    borderRadius: 8,
    backgroundColor: AppColors.ThemeColor,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveWidth(3),
  },
  textView: {
    padding: responsiveWidth(5),
  }
});

export default OnBoarding;
