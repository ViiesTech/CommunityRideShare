import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppColors from '../../../utils/AppColors';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import LineBreak from '../../../components/LineBreak';
import { AppIcons } from '../../../assets/icons';
import SVGXml from '../../../components/SVGXML';
import Wrapper from '../../../components/Wrapper';
import AppHeader from '../../../components/AppHeader';
import { useSelector } from 'react-redux';
import { selectCommunityId } from '../../../redux/slices/authSlice';
import { useGetCommunityByIdQuery, useManageJoinRequestMutation } from '../../../redux/api/apiSlice';
import BoxShadow from '../../../components/BoxShadow';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import { showToast } from '../../../utils/toast';

// const membersasd = [
//   { id: 1, name: 'Member 1', userId: 'user-1762296', isAdmin: true },
//   { id: 1, name: 'Member 1', userId: 'user-1762296', isAdmin: true },
// ];

const AdminPanel = () => {
  const navigation = useNavigation();

  const communityId = useSelector(selectCommunityId);
  const { data: communityData } = useGetCommunityByIdQuery(communityId, {
    skip: !communityId,
  });
  const [manageJoinRequest] = useManageJoinRequestMutation();

  console.log("Admin panel data ", communityData);

  const [activeTab, setActiveTab] = useState('requests');
  const [loadingStates, setLoadingStates] = useState({});
  const isAnyLoading = Object.values(loadingStates).some(val => val === 'approve' || val === 'reject');
  const joinRequests = communityData?.pendingRequests || [];
  const members = communityData?.members || [];
  console.log("members", members);

  // const members = membersasd

  const TABS = [
    { id: 'requests', label: `Join Request (${joinRequests.length})` },
    { id: 'members', label: `Members (${members.length})` },
    { id: 'rides', label: 'Rides (0)' },
  ];

  const handleCopyCode = () => {
    const code = communityData?.inviteCode;
    if (code && code !== 'NA') {
      Clipboard.setString(code);
      showToast('success', 'Copied', `Community code copied.`);
    }
  };


  const handleRequest = async (memberId, action) => {
    if (isAnyLoading || loadingStates[memberId]) return;

    setLoadingStates(prev => ({ ...prev, [memberId]: action }));
    try {
      const response = await manageJoinRequest({
        communityId, targetUserId: memberId, action,
      }).unwrap();
      console.log("handleRequest res", response);
      if (response?.success) {
        setLoadingStates(prev => ({ ...prev, [memberId]: 'success' }));
        showToast(
          'success',
          'Congratulations',
          response?.message || `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      } else {
        setLoadingStates(prev => ({ ...prev, [memberId]: 'error' }));
        showToast(
          'error',
          response?.errorCode || 'Request Failed',
          response?.message || `Request ${action === 'approve' ? 'approved' : 'rejected'} failed.`);
      }
    } catch (err) {
      console.log("err handleRequest", err);
      setLoadingStates(prev => ({ ...prev, [memberId]: 'error' }));
      showToast(
        'error',
        err?.data?.errorCode || 'Request Failed',
        err?.data?.message || 'Something went wrong'
      );
    }
  };

  return (
    <Wrapper bgColor={AppColors.grayBG} >
      <AppHeader title='Admin Panel' description={`Manage ${communityData?.name || 'Your  Community'}`} />
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.85}
          >
            <AppText
              title={tab.label}
              textFontWeight={activeTab === tab.id}
              textColor={activeTab === tab.id ? AppColors.BLACK : '#7D85A1'}
              textSize={1.6}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Pending Join Requests */}
      {activeTab === 'requests' && (
        <View>
          <AppText title="Pending Join Request" textFontWeight textSize={2} />
          <AppText
            title="Review and approve users who want to join your community"
            textColor={AppColors.DARKGRAY}
            textSize={1.7}
          />
          <LineBreak space={1} />
          <BoxShadow
            scroll={true}
            style={[styles.sectionCard, { maxHeight: responsiveHeight(35), padding: 0 }]}
            contentContainerStyle={{ padding: responsiveWidth(2) }}
          >
            {joinRequests.length > 0 ? (
              <View style={{ gap: responsiveWidth(1.5) }}>
                {joinRequests.map(member => (
                  <View key={member._id} style={styles.requestCard}>
                    <View style={styles.avatarCircle}>
                      {member.avatarUrl ? (
                        <Image
                          source={{ uri: member.avatarUrl }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={{ fontSize: 22, color: AppColors.ThemeColor }}>
                          👤
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText
                        title={member.name}
                        textFontWeight
                        textColor={AppColors.WHITE}
                        textSize={1.8}
                      />
                      <AppText
                        title={`ID: ${member._id?.slice(0, 10)}`}
                        textColor={AppColors.WHITE}
                        textSize={1.4}
                      />
                    </View>
                    <View style={{ flexDirection: 'column', gap: 8, marginLeft: 8 }}>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() => handleRequest(member._id, 'approve')}
                        disabled={isAnyLoading || loadingStates[member._id] === 'success'}
                      >
                        {loadingStates[member._id] === 'approve' ? (
                          <ActivityIndicator size="small" color={AppColors.WHITE} />
                        ) : (
                          <AppText
                            title="Approve"
                            textColor={AppColors.WHITE}
                            textFontWeight
                            textSize={1.5}
                          />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.denyBtn}
                        onPress={() => handleRequest(member._id, 'reject')}
                        disabled={isAnyLoading || loadingStates[member._id] === 'success'}
                      >
                        {loadingStates[member._id] === 'reject' ? (
                          <ActivityIndicator size="small" color={AppColors.WHITE} />
                        ) : (
                          <AppText
                            title="Deny"
                            textColor={AppColors.WHITE}
                            textFontWeight
                            textSize={1.5}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="people" size={54} color="#B0B5C3" />
                <AppText
                  title="No pending requests"
                  textFontWeight
                  textColor={AppColors.BLACK}
                  textSize={1.8}
                  textAlignment="center"
                />
              </View>
            )}
          </BoxShadow>
        </View>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <View>
          <AppText title="Community Members" textFontWeight textSize={2} />
          <AppText
            title={`${members.length} members in ${communityData?.name || 'this community'}`}
            textColor={AppColors.DARKGRAY}
            textSize={1.7}
          />
          <LineBreak space={1} />
          <BoxShadow
            scroll={true}
            style={[styles.sectionCard, { maxHeight: responsiveHeight(40), padding: 0 }]}
            contentContainerStyle={{ padding: responsiveWidth(2) }}>
            <View style={{ gap: responsiveHeight(0.5) }}>
              {members.map(member => (
                <View key={member._id} style={styles.requestCard}>
                  <View style={styles.avatarCircle}>
                    {member.avatarUrl ? (
                      <Image
                        source={{ uri: member.avatarUrl }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <Text style={{ fontSize: 22, color: AppColors.ThemeColor }}>
                        👤
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText
                      title={`${member.name}${member.communityRole === 'admin' ? ' (You)' : ''}`}
                      textFontWeight
                      textColor={AppColors.WHITE}
                      textSize={1.8}
                    />
                    <AppText
                      title={`ID: ${member._id?.slice(0, 10)}`}
                      textColor={AppColors.WHITE}
                      textSize={1.4}
                    />
                  </View>
                  {member.communityRole === "admin" && (
                    <View style={styles.adminBadge}>
                      <AppText
                        title="Admin"
                        textColor={AppColors.ThemeColor}
                        textFontWeight
                        textSize={1.4}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </BoxShadow>
        </View>
      )}

      {/* Rides Tab */}
      {activeTab === 'rides' && (
        <View>
          <AppText title="Community Rides" textFontWeight textSize={2} />
          <AppText
            title="Monitor all rides posted in your community"
            textColor={AppColors.DARKGRAY}
            textSize={1.7}
          />
          <LineBreak space={1} />
          <BoxShadow
            style={[styles.sectionCard, { padding: 0 }]}
            contentContainerStyle={{ padding: responsiveWidth(2) }}
          >
            <View style={styles.emptyContainer}>
              <Ionicons name="car" size={54} color="#B0B5C3" />
              <AppText
                title="No rides at this time"
                textFontWeight
                textColor={AppColors.BLACK}
                textSize={1.8}
                textAlignment="center"
              />
            </View>
          </BoxShadow>
        </View>
      )}

      {/* Community Information */}
      <BoxShadow style={[styles.sectionCard, { gap: responsiveWidth(2) }]}>
        <AppText
          title="Community Information"
          textFontWeight
          textSize={2}
          textAlignment="center"
        />
        <View style={styles.infoRow}>
          <AppText title="Community Code" textFontWeight textSize={1.7} />
          <TouchableOpacity
            style={styles.codeBox}
            activeOpacity={0.7}
            onLongPress={handleCopyCode}
          >
            <AppText title={communityData?.inviteCode || 'NA'} textFontWeight textSize={1.7} />
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <AppText title="Total Members" textSize={1.7} />
          <AppText title={communityData?.members?.length ?? 'NA'} textFontWeight textSize={1.7} />
        </View>
        <View style={styles.infoRow}>
          <AppText title="Active Rides" textSize={1.7} />
          <AppText title="0" textFontWeight textSize={1.7} />
        </View>
        <View style={styles.infoRow}>
          <AppText title="Pending Requests" textSize={1.7} />
          <AppText title={communityData?.pendingRequests?.length ?? 'NA'} textFontWeight textSize={1.7} />
        </View>
      </BoxShadow>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: AppColors.disable,
    borderRadius: 16,
    marginVertical: responsiveHeight(1.5),
    padding: responsiveWidth(0.5),
    gap: responsiveWidth(0.5),
  },
  tabBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: responsiveHeight(1.2),
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: AppColors.WHITE,
    shadowColor: '#1E2A4A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionCard: {
    backgroundColor: AppColors.WHITE,
    borderRadius: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    padding: responsiveWidth(2),
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D7CF4',
    borderRadius: responsiveWidth(2),
    padding: 12,
    // marginBottom: 12,
    gap: 5,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E7EAF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarImage: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(10),
  },
  approveBtn: {
    backgroundColor: '#3AC569',
    borderRadius: 8,
    height: responsiveWidth(7),
    width: responsiveWidth(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  denyBtn: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    height: responsiveWidth(7),
    width: responsiveWidth(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(4),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  codeBox: {
    backgroundColor: AppColors.WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E3E6EF',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  adminBadge: {
    backgroundColor: '#FFF3E9',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#FFB26B',
  },
});

export default AdminPanel;
