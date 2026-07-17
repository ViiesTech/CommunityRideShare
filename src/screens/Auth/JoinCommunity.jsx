import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken, setCommunityId, setCommunityRole } from '../../redux/slices/authSlice';
import {
  Animated,
  FlatList,
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
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
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
import Wrapper from '../../components/Wrapper';
import AppLogo from '../../components/AppLogo';
import AppToggleSwitch from '../../components/appToggleSwitch';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useBrowsePublicCommunitiesQuery, useCreateCommunityMutation, useJoinCommunityRequestMutation, useCancelCommunityRequestMutation, useJoinCommunityByCodeMutation } from '../../redux/api/apiSlice';
import { showToast } from '../../utils/toast';
import { persistor, store } from '../../redux/store';

const tabs = [
  { id: 'code', label: 'Code' },
  { id: 'browse', label: 'Browse' },
  { id: 'create', label: 'Create' },
];

const JoinCommunity = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken)
  console.log('token', token)

  const [communities, setCommunities] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(undefined);
  const [activeTab, setActiveTab] = useState('code');
  const [communityCode, setCommunityCode] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [requestingCommunityId, setRequestingCommunityId] = useState(null);
  const [cancellingCommunityId, setCancellingCommunityId] = useState(null);

  const [createCommunity, { isLoading }] = useCreateCommunityMutation();
  const [joinCommunityRequest, { isLoading: isJoining }] = useJoinCommunityRequestMutation();
  const [cancelCommunityRequest, { isLoading: isCancelling }] = useCancelCommunityRequestMutation();
  const [joinCommunityByCode, { isLoading: isJoiningByCode }] = useJoinCommunityByCodeMutation();
  const { data, isFetching } = useBrowsePublicCommunitiesQuery(
    { limit: 20, cursor },
    { skip: activeTab !== 'browse', refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (activeTab === 'browse') {
      if (data) {
        const newItems = data?.data?.communities ?? [];
        const pagination = data?.data?.pagination;
        setCommunities(prev => {
          const updated = (cursor && prev.length > 0) ? [...prev, ...newItems] : newItems;
          return updated;
        });
        setHasMore(pagination?.hasMore ?? false);
      }
    } else {
      setCommunities([]);
      setCursor(undefined);
      setHasMore(true);
    }
  }, [data, activeTab]);

  const loadMore = () => {
    if (isFetching) return;
    if (!hasMore) return;

    const nextCursor = data?.data?.pagination?.nextCursor;
    if (nextCursor) {
      setCursor(nextCursor);
    }
  };

  const handleRequest = async (id) => {
    setRequestingCommunityId(id);
    try {
      const response = await joinCommunityRequest({ id }).unwrap();
      if (response.success) {
        showToast(
          'success',
          'Request Submitted',
          response?.message || 'Your join request was submitted successfully.'
        );
        setCommunities(prev =>
          prev.map(item => (item.id === id ? { ...item, isRequest: true } : item))
        );
      } else {
        showToast(
          'error',
          response?.errorCode || 'Failed to join community',
          response?.message || 'Something went wrong'
        );
      }
    } catch (error) {
      showToast(
        'error',
        error?.data?.errorCode || 'Failed to join community',
        error?.data?.message || 'Something went wrong'
      );
    } finally {
      setRequestingCommunityId(null);
    }
  };

  const handleCancelRequest = async (id) => {
    setCancellingCommunityId(id);
    try {
      const response = await cancelCommunityRequest({ id }).unwrap();
      if (response.success) {
        showToast(
          'success',
          'Request Cancelled',
          response?.message || 'Your join request was cancelled successfully.'
        );
        setCommunities(prev =>
          prev.map(item => (item.id === id ? { ...item, isRequest: false } : item))
        );
      } else {
        showToast(
          'error',
          response?.errorCode || 'Cancellation Failed',
          response?.message || 'Something went wrong'
        );
      }
    } catch (error) {
      showToast(
        'error',
        error?.data?.errorCode || 'Cancellation Failed',
        error?.data?.message || 'Something went wrong'
      );
    } finally {
      setCancellingCommunityId(null);
    }
  };

  const handleJoin = async () => {
    if (!communityCode.trim()) {
      showToast('error', 'Required Field', 'Please enter community code');
      return;
    }
    try {
      const response = await joinCommunityByCode({ inviteCode: communityCode }).unwrap();
      if (response.success) {
        showToast(
          'success',
          'Congratulations',
          response?.message || 'Community joined successfully.',
          () => {
            const communityId = response?.data?.communityId || null
            dispatch(setCommunityId(communityId));
            dispatch(setCommunityRole('member'));
          }
        );
      } else {
        showToast(
          'error',
          response?.errorCode || 'Join Failed',
          response?.message || 'Something went wrong'
        );
      }
    } catch (error) {
      showToast(
        'error',
        error?.data?.errorCode || 'Join Failed',
        error?.data?.message || 'Something went wrong'
      );
    }
  };

  const handleCreate = async () => {
    try {
      const data = { name: communityName, isPublic }
      const response = await createCommunity(data).unwrap()
      if (response.success) {
        showToast(
          'success',
          'Congratulations',
          response?.message || 'Community created successfully.',
          () => {
            dispatch(setCommunityId(response.data.id));
            dispatch(setCommunityRole('admin'));
          });
      } else {
        showToast(
          'error',
          response?.errorCode || 'Community Creation Failed',
          response?.message || 'Something went wrong'
        );
      }
    } catch (err) {
      showToast(
        'error',
        err?.data?.errorCode || 'Community Creation Failed',
        err?.data?.message || 'Something went wrong'
      );
    }
  };

  const logout = async () => {
    // 0) Drawer close pehle
    // props.navigation.closeDrawer();

    // // 1) Immediately Redux clear (UI will switch to NA quickly)
    store.dispatch({ type: 'RESET_STORE' });

    // // 2) Persisted storage purge (async)
    await persistor.purge();

    // // 3) Auth stack pe le jao
    // props.navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Auth' }],
    // });
  };

  return (
    <Wrapper style={styles.safeArea}>
      <View style={styles.card}>
        <TouchableOpacity onPress={logout}>
          <AppLogo style={{ marginVertical: responsiveHeight(5) }} />
        </TouchableOpacity>
        <AppText title="Join a Community" textSize={4} textFontWeight textAlignment='center' />
        <AppText title="You need to be part of a community to access rides" textSize={1.6} lineHeight={2} textFontWeight textColor={AppColors.darkGray} textAlignment='center' />
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }}>
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
                    placeholder="Community Code"
                    placeholderTextColor={AppColors.darkGray}
                    autoCapitalize="characters"
                  />
                </View>
                <AppText
                  title="Enter the code shared by your community admin"
                  textColor={AppColors.darkGray}
                  textSize={1.5}
                  textFontWeight
                />
              </View>
              <AppButton
                title="Join Community"
                bgColor={AppColors.ThemeColor}
                handlePress={handleJoin}
                loading={isJoiningByCode}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
        {activeTab === 'browse' && (
          <View style={{ flex: 1 }}>
            {isFetching && !cursor ? (
              <View style={{ flex: 1, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={AppColors.ThemeColor} />
              </View>
            ) : (
              <FlatList
                data={communities}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: responsiveHeight(1.5), paddingBottom: responsiveHeight(2) }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CommunityCard
                    name={item.name}
                    members={item.memberCount}
                    isRequest={item.isRequest}
                    onRequest={() => handleRequest(item.id)}
                    isLoading={requestingCommunityId === item.id}
                    onCancelRequest={() => handleCancelRequest(item.id)}
                    isCancelling={cancellingCommunityId === item.id}
                  />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  isFetching && hasMore ? (
                    <View style={{ paddingVertical: responsiveHeight(2) }}>
                      <ActivityIndicator size="small" color={AppColors.ThemeColor} />
                    </View>
                  ) : null
                }
              />
            )}
          </View>
        )}
        {activeTab === 'create' && (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ gap: responsiveHeight(1) }}>
              <View style={styles.isPublicContainer}>
                <AppText title={'Community Visibility'} textColor={AppColors.BLACK}
                  textFontWeight textSize={1.5} />
                <View style={styles.inputField}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 24, gap: responsiveWidth(4),
                    }}>
                    <Ionicons
                      name={isPublic ? 'lock-closed' : 'lock-open'}
                      size={responsiveWidth(4)}
                      color={AppColors.ThemeColor}
                    />
                    <AppText title={`${isPublic ? 'Public' : 'Private'}`} textColor={AppColors.GRAY}
                      textFontWeight textSize={1.7} />
                  </View>
                  <AppToggleSwitch value={isPublic} onToggle={setIsPublic} />
                </View>
              </View>
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
                textColor={AppColors.darkGray}
                textSize={1.5}
                textFontWeight
              />
              <AppButton
                title="Create Community"
                bgColor={AppColors.BLACK}
                handlePress={handleCreate}
                textSize={1.7} loading={isLoading}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
      {/* </ScrollView> */}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  scrollContent: {

  },
  card: {
    flex: 1,
    gap: responsiveHeight(1.5),
  },
  tabGroup: {
    flexDirection: 'row',
    backgroundColor: AppColors.disable,
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
    justifyContent: 'space-between',
    gap: responsiveWidth(2),
    backgroundColor: '#F4F5F8',
    borderRadius: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(3),
    height: responsiveHeight(6),
    width: responsiveWidth(89),
    borderWidth: 1,
    borderColor: '#E3E6EF',
  },
  inputText: {
    flex: 1,
    fontSize: responsiveHeight(1.8),
    color: AppColors.BLACK,
    fontWeight: '600',
    letterSpacing: 1
  },
  isPublicContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: responsiveHeight(1)
  }
});

export default JoinCommunity;
