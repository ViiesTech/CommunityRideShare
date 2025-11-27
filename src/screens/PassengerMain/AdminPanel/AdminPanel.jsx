import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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

const TABS = [
  { id: 'requests', label: 'Join Request' },
  { id: 'members', label: 'Members (1)' },
  { id: 'rides', label: 'Rides (0)' },
];
const members = [
  { id: 1, name: 'Member 1', userId: 'user-1762296', isAdmin: true },
];

const joinRequests = [
  { id: 1, name: 'Member 1', userId: 'user-1762296' },
  { id: 2, name: 'Member 2', userId: 'user-1762296' },
];

const AdminPanel = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: AppColors.WHITE }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Header with back arrow */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: responsiveHeight(3),
          paddingHorizontal: responsiveWidth(5),
          backgroundColor: AppColors.WHITE,
          marginBottom: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 4, marginRight: 8 }}
        >
          <SVGXml icon={AppIcons.arrowLeft} width={24} height={24} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <AppText
            title="Admin Panel"
            textFontWeight
            textSize={2.3}
            textAlignment="center"
          />
          <LineBreak space={1} />
          <AppText
            title="Manage Downtown Place 2"
            textColor={AppColors.DARKGRAY}
            textSize={1.5}
            textAlignment="center"
          />
        </View>
      </View>

      {/* Tabs */}
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
        <View style={styles.sectionCard}>
          <AppText title="Pending Join Request" textFontWeight textSize={2} />
          <LineBreak space={1} />
          <AppText
            title="Review and approve users who want to join your community"
            textColor={AppColors.DARKGRAY}
            textSize={1.7}
          />
          <LineBreak space={1} />
          {joinRequests.map(member => (
            <View key={member.id} style={styles.requestCard}>
              <View style={styles.avatarCircle}>
                <Text style={{ fontSize: 22, color: AppColors.ThemeColor }}>
                  👤
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <AppText
                  title={member.name}
                  textFontWeight
                  textColor={AppColors.WHITE}
                  textSize={1.8}
                />
                <AppText
                  title={`ID: ${member.userId}`}
                  textColor={AppColors.WHITE}
                  textSize={1.4}
                />
              </View>
              <View style={{ flexDirection: 'column', gap: 8, marginLeft: 8 }}>
                <TouchableOpacity style={styles.approveBtn}>
                  <AppText
                    title="Approve"
                    textColor={AppColors.WHITE}
                    textFontWeight
                    textSize={1.5}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.denyBtn}>
                  <AppText
                    title="Deny"
                    textColor={AppColors.WHITE}
                    textFontWeight
                    textSize={1.5}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <View style={styles.sectionCard}>
          <AppText title="Community Members" textFontWeight textSize={2} />
          <LineBreak space={1} />
          <AppText
            title={`1 members in Downtown Place 2`}
            textColor={AppColors.DARKGRAY}
            textSize={1.7}
          />
          <LineBreak space={1} />
          {members.map(member => (
            <View key={member.id} style={styles.requestCard}>
              <View style={styles.avatarCircle}>
                <Text style={{ fontSize: 22, color: AppColors.ThemeColor }}>
                  👤
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <AppText
                  title={member.name}
                  textFontWeight
                  textColor={AppColors.WHITE}
                  textSize={1.8}
                />
                <AppText
                  title={`ID: ${member.userId}`}
                  textColor={AppColors.WHITE}
                  textSize={1.4}
                />
              </View>
              {member.isAdmin && (
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
      )}

      {/* Rides Tab */}
      {activeTab === 'rides' && (
        <View style={styles.sectionCard}>
          <AppText title="Community Members" textFontWeight textSize={2} />
          <LineBreak space={1} />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              minHeight: 140,
            }}
          >
            <AppText
              title="Monitor all rides posted in your community"
              textColor={AppColors.DARKGRAY}
              textSize={1.7}
            />
            <LineBreak space={1} />
            <Text style={{ fontSize: 54, color: '#B0B5C3' }}>👥</Text>
          </View>
        </View>
      )}

      {/* Community Information */}
      <View style={styles.sectionCard}>
        <AppText
          title="Community Information"
          textFontWeight
          textSize={1.7}
          textAlignment="center"
        />
        <LineBreak space={1} />
        <View style={styles.infoRow}>
          <AppText title="Community Code" textFontWeight textSize={1.7} />
          <View style={styles.codeBox}>
            <AppText title="WKDR2X" textFontWeight textSize={1.7} />
          </View>
        </View>
        <View style={styles.infoRow}>
          <AppText title="Total Members" textSize={1.7} />
          <AppText title="1" textFontWeight textSize={1.7} />
        </View>
        <View style={styles.infoRow}>
          <AppText title="Active Rides" textSize={1.7} />
          <AppText title="0" textFontWeight textSize={1.7} />
        </View>
        <View style={styles.infoRow}>
          <AppText title="Pending Requests" textSize={1.7} />
          <AppText title="0" textFontWeight textSize={1.7} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F6FA',
    borderRadius: 16,
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
    padding: 4,
    gap: 4,
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
    borderRadius: 16,
    marginHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    padding: responsiveWidth(4),
    shadowColor: '#050A30',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D7CF4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
  approveBtn: {
    backgroundColor: '#3AC569',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 2,
  },
  denyBtn: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
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
