import React, { useRef, useEffect, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppImages } from '../../assets/images';
import { useNavigation } from '@react-navigation/native';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import SVGXml from '../../components/SVGXML';
import { AppIcons } from '../../assets/icons';
import CommunityCard from './CommunityCard';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';

const tabs = [
  { id: 'code', label: 'Code' },
  { id: 'browse', label: 'Browse' },
  { id: 'create', label: 'Create' },
];

const JoinCommunity = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('code');
  const [communityCode, setCommunityCode] = useState('DEMO123');
  const [communityName, setCommunityName] = useState('');
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslate, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardOpacity, cardTranslate]);

  const handleJoin = () => {
    navigation.navigate('Main', {
      screen: 'HomeMain',
      params: {
        screen: 'Home',
        params: {
          type: 'join'
        },
      },
    });
  };

  const handleCreate = () => {
    navigation.navigate('Main', {
      screen: 'HomeMain',
      params: {
        screen: 'Home',
        params: {
          type: 'create'
        },
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.WHITE} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.heroBadge}>
              <AppText
                title="Ride-Share"
                textColor={AppColors.WHITE}
                textFontWeight
              />
            </View>
            <AppText
              title="Join a Community"
              textColor={AppColors.BLACK}
              textSize={3.5}
              textFontWeight
            />
            <AppText
              title="You need to be part of a community to access rides."
              textColor={AppColors.DARKGRAY}
              textSize={1.7}
              lineHeight={2.5}
            />
            <Image source={AppImages.roundedImg} style={styles.heroImage} />
          </View>
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslate }],
              },
            ]}
          >
            <View style={styles.tabGroup}>
              {tabs.map(tab => {
                const isActive = tab.id === activeTab;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    activeOpacity={0.85}
                    onPress={() => setActiveTab(tab.id)}
                    style={[
                      styles.tabButton,
                      isActive && styles.tabButtonActive,
                    ]}
                  >
                    <AppText
                      title={tab.label}
                      textColor={isActive ? AppColors.BLACK : '#7D85A1'}
                      textFontWeight={isActive}
                      textSize={1.5}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            {activeTab === 'code' && (
              <>
                <View style={styles.inputBlock}>
                  <AppText
                    title="Community Code"
                    textColor={AppColors.BLACK}
                    textFontWeight
                    textSize={1.5}
                  />
                  <View style={styles.inputField}>
                    <SVGXml icon={AppIcons.key} width={18} height={18} />
                    <TextInput
                      value={communityCode}
                      onChangeText={text =>
                        setCommunityCode(text.toUpperCase())
                      }
                      style={[
                        styles.inputText,
                        { fontSize: responsiveHeight(1.7) },
                      ]}
                      placeholder="DEMO123"
                      placeholderTextColor={AppColors.GRAY}
                      autoCapitalize="characters"
                    />
                  </View>
                  <AppText
                    title="Enter the code shared by your community admin"
                    textColor={AppColors.DARKGRAY}
                    textSize={1.5}
                  />
                </View>
                <AppButton
                  title="Join Community"
                  bgColor={AppColors.ThemeColor}
                  buttoWidth={75}
                  handlePress={handleJoin}
                />
              </>
            )}
            {activeTab === 'browse' && (
              <View style={{ gap: responsiveHeight(1.5) }}>
                <CommunityCard name="Downtown" members={4} status={null} />
                <CommunityCard name="sdasd" members={1} status={null} />
                <CommunityCard name="Area 23" members={1} status="requested" />
              </View>
            )}
            {activeTab === 'create' && (
              <View style={{ gap: responsiveHeight(2) }}>
                <AppText
                  title="Community Name"
                  textColor={AppColors.BLACK}
                  textFontWeight
                  textSize={1.5}
                />
                <View style={styles.inputField}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 24,
                    }}
                  >
                    <SVGXml
                      icon={
                        "<svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='9' cy='9' r='9' fill='#E7EAF3'/><path d='M9 5.25V12.75' stroke='#0D7CF4' stroke-width='1.5' stroke-linecap='round'/><path d='M5.25 9H12.75' stroke='#0D7CF4' stroke-width='1.5' stroke-linecap='round'/></svg>"
                      }
                      width={18}
                      height={18}
                    />
                  </View>
                  <TextInput
                    value={communityName}
                    onChangeText={setCommunityName}
                    style={[
                      styles.inputText,
                      { fontSize: responsiveHeight(1.7) },
                    ]}
                    placeholder="Downtown Place 2"
                    placeholderTextColor={AppColors.GRAY}
                  />
                </View>
                <AppText
                  title="Create your own community and become the admin"
                  textColor={AppColors.DARKGRAY}
                  textSize={1.5}
                />
                <AppButton
                  title="Create Community"
                  bgColor={AppColors.darkBlue}
                  buttoWidth={75}
                  handlePress={handleCreate}
                  textSize={1.7}
                />
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.WHITE,
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(4),
    gap: responsiveHeight(3),
  },
  heroSection: {
    backgroundColor: AppColors.lightThemeColor,
    borderRadius: 32,
    padding: responsiveWidth(6),
    gap: responsiveHeight(1.5),
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: 16,
    backgroundColor: AppColors.ThemeColor,
  },
  heroImage: {
    width: '100%',
    height: responsiveHeight(20),
    borderRadius: 24,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 28,
    padding: responsiveWidth(6),
    gap: responsiveHeight(2),
    shadowColor: '#050A30',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 15 },
    elevation: 8,
  },
  tabGroup: {
    flexDirection: 'row',
    backgroundColor: '#EEF0F5',
    borderRadius: 24,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: responsiveHeight(1.3),
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: AppColors.WHITE,
    shadowColor: '#1E2A4A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  inputBlock: {
    gap: responsiveHeight(1.2),
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(3),
    backgroundColor: '#F4F5F8',
    borderRadius: 16,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(0.6),
    borderWidth: 1,
    borderColor: '#E3E6EF',
    minHeight: responsiveHeight(4.2),
  },
  inputText: {
    flex: 1,
    fontSize: responsiveHeight(1.8),
    color: AppColors.BLACK,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default JoinCommunity;
