import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppText';
import { useNavigation } from '@react-navigation/native';
import { AppImages } from '../../assets/images';
import AppButton from '../../components/AppButton';

const { width } = Dimensions.get('window');

const OnBoarding = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const sliderRef = useRef(null);

  const slides = useMemo(
    () => [
      {
        key: '1',
        title: 'Group-first ride matching',
        text: 'Keep every trip inside your trusted crew and coordinate carpools in seconds.',
        image: AppImages.stepOne,
      },
      {
        key: '2',
        title: 'Plan ahead with clarity',
        text: 'Reserve seats, set pickup points, and track ETA with a single swipe.',
        image: AppImages.stepTwo,
      },
      {
        key: '3',
        title: 'Earn & share savings',
        text: 'Split fuel costs, earn credits, and reinvest them back into your community.',
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
          <View style={styles.cardHeader}>
            <View style={styles.stepBadge}>
              <AppText
                title={`Step ${index + 1} of ${slides.length}`}
                textColor={AppColors.ThemeColor}
                textSize={1.4}
                textFontWeight
              />
            </View>
            <AppText
              title={item.title}
              textColor={AppColors.BLACK}
              textSize={2.4}
              textFontWeight
              textwidth={80}
            />
          </View>
          <View style={styles.imageShell}>
            <Image source={item.image} style={styles.image} />
          </View>
          <AppText
            title={item.text}
            textColor={AppColors.DARKGRAY}
            textSize={1.8}
            lineHeight={3}
          />
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.WHITE} />
      <View style={styles.backgroundAccent} />
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
      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <AppText title="Skip" textColor={AppColors.DARKGRAY} textFontWeight />
        </TouchableOpacity>
        <View style={styles.actionGroup}>
          <TouchableOpacity
            onPress={handlePrev}
            style={[styles.iconButton, currentIndex === 0 && styles.iconButtonDisabled]}
            disabled={currentIndex === 0}
          >
            <AppText title="←" textColor={AppColors.DARKGRAY} textFontWeight />
          </TouchableOpacity>
          <AppButton
            title={currentIndex === slides.length - 1 ? 'Get started' : 'Next'}
            handlePress={handleNext}
            bgColor={AppColors.ThemeColor}
            textColor={AppColors.WHITE}
            buttoWidth={50}
          />
        </View>
      </View>
      <View style={styles.signupPrompt}>
        <AppText
          title="New here?"
          textColor={AppColors.DARKGRAY}
          textSize={1.5}
        />
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <AppText title="Create an account" textColor={AppColors.ThemeColor} textFontWeight />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  backgroundAccent: {
    position: 'absolute',
    top: -responsiveHeight(20),
    right: -responsiveWidth(10),
    width: responsiveWidth(70),
    height: responsiveWidth(70),
    borderRadius: responsiveWidth(35),
    backgroundColor: AppColors.lightThemeColor,
    opacity: 0.35,
  },
  card: {
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(6),
    backgroundColor: AppColors.WHITE,
    borderRadius: 32,
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(4),
    gap: responsiveHeight(2.5),
    shadowColor: '#040816',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cardHeader: {
    gap: responsiveHeight(1),
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: 20,
    backgroundColor: AppColors.lightThemeColor,
  },
  imageShell: {
    width: '100%',
    height: responsiveHeight(32),
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: AppColors.inputBgColor,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(3),
  },
  dot: {
    height: 8,
    borderRadius: 8,
    backgroundColor: AppColors.ThemeColor,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveHeight(3),
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: responsiveWidth(1.5),
    paddingBottom: responsiveHeight(3),
  },
  skipButton: {
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.inputBgColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDisabled: {
    opacity: 0.4,
  },
});

export default OnBoarding;
