import React from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import AppColors from '../../../utils/AppColors';
import { responsiveHeight, responsiveWidth } from '../../../utils/Responsive_Dimensions';
import SVGXml from '../../../components/SVGXML';
import { AppIcons } from '../../../assets/icons';

const ratingScale = [1, 2, 3, 4, 5];

const GiveRating = () => {
  const navigation = useNavigation();
  const [rating, setRating] = React.useState(0);

  const handleSubmit = () => {
    navigation.navigate('HomeMain');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.WHITE} />
      <View style={styles.container}>
        <View style={styles.headerWrap}>
          <AppText
            title="Review"
            textColor="#0B1A39"
            textFontWeight
            textSize={2.2}
          />
        </View>

        <View style={styles.reviewCard}>
          <View style={styles.cardTop}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=56' }}
                style={styles.avatar}
              />
            </View>
            <AppText
              title="John Smith"
              textColor="#0B1A39"
              textFontWeight
              textSize={2}
              textAlignment="center"
            />
            <AppText
              title="Loreipsum dollor sit alley Loreiepsum dollor sit alleyLoreiepsum dollor sit alley"
              textColor={AppColors.GRAY}
              textSize={1.35}
              textAlignment="center"
              lineHeight={2.4}
              textwidth={80}
            />

              <View style={styles.stopsWrap}>
                <View style={styles.stopsIndicator}>
                  <View style={[styles.iconCircle, styles.iconStart]}>
                    <View style={styles.startDot} />
                  </View>
                  <View style={styles.dotBridge}>
                    {[0, 1, 2].map(index => (
                      <View key={index} style={styles.bridgeDot} />
                    ))}
                  </View>
                  <View style={[styles.iconCircle, styles.iconEnd]}>
                    <SVGXml icon={AppIcons.location} width={12} height={12} />
                  </View>
                </View>
                <View style={styles.stopsText}>
                  <View style={styles.stopTextRow}>
                    <AppText title="Mall Central" textFontWeight textColor="#0B1A39" textSize={1.5} />
                  </View>
                  <View style={styles.stopTextRow}>
                    <AppText
                      title="University Campus"
                      textColor="#0B1A39"
                      textFontWeight
                      textSize={1.5}
                    />
                  </View>
                </View>
              </View>
          </View>

          <View style={styles.cardBottom}>
            <AppText
              title="Rate your Driver"
              textColor={AppColors.GRAY}
              textSize={1.6}
              textAlignment="center"
            />
            <View style={styles.ratingRow}>
              {ratingScale.map(value => {
                const isActive = value <= rating;
                return (
                  <TouchableOpacity
                    key={value}
                    style={styles.starButton}
                    onPress={() => setRating(value)}
                    activeOpacity={0.8}
                  >
                    <SVGXml
                      icon={AppIcons.starFilled}
                      width={22}
                      height={22}
                      style={isActive ? styles.starActive : styles.starInactive}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <AppButton
          title="Submit"
          handlePress={handleSubmit}
          borderRadius={18}
          buttoWidth={85}
          textSize={1.9}
          bgColor="#0D7CF4"
          loading={false}
          loaderSize="small"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(4),
    gap: responsiveHeight(3),
    justifyContent: 'space-between',
  },
  headerWrap: {
    gap: responsiveHeight(1),
  },
  reviewCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: AppColors.WHITE,
    shadowColor: '#00133D',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
    overflow: 'visible',
  },
  cardTop: {
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(5.5),
    paddingBottom: responsiveHeight(3),
    alignItems: 'center',
    gap: responsiveHeight(1.4),
    backgroundColor: AppColors.WHITE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  avatarWrap: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(9),
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    position: 'absolute',
    top: -responsiveHeight(4.5),
    alignSelf: 'center',
    backgroundColor: AppColors.WHITE,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  stopsWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(4),
    marginTop: responsiveHeight(1),
  },
  stopsIndicator: {
    alignItems: 'center',
  },
  dotBridge: {
    gap: responsiveHeight(0.5),
    alignItems: 'center',
  },
  bridgeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CED4DF',
  },
  stopsText: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(0.6),
  },
  stopTextRow: {
    height: responsiveHeight(5),
    justifyContent: 'center',
  },
  iconCircle: {
    width: responsiveWidth(7),
    height: responsiveWidth(7),
    borderRadius: responsiveWidth(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconStart: {
    backgroundColor: 'transparent',
  },
  iconEnd: {
    backgroundColor: 'transparent',
  },
  startDot: {
    width: responsiveWidth(2.2),
    height: responsiveWidth(2.2),
    borderRadius: responsiveWidth(1.1),
    backgroundColor: '#00B3A4',
  },
  cardBottom: {
    backgroundColor: '#F7F8FB',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(3),
    gap: responsiveHeight(1.5),
    alignItems: 'center',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: responsiveWidth(3),
  },
  starButton: {
    padding: responsiveWidth(1),
  },
  starActive: {
    opacity: 1,
  },
  starInactive: {
    opacity: 0.55,
  },
});

export default GiveRating;
