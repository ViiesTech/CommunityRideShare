/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppText';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import FieldCode from '../../components/CodeField';
import {
    responsiveHeight,
    responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Wrapper from '../../components/Wrapper';
import AppLogo from '../../components/AppLogo';
import { useDispatch } from 'react-redux';
import { setAuthToken, setCommunityRole, setUser } from '../../redux/slices/authSlice';
import { useVerifyAccountMutation } from '../../redux/api/apiSlice';
import { showToast } from '../../utils/toast';

const VerifyAccount = () => {
    const [VerifyAccount, { isLoading, error }] = useVerifyAccountMutation();
    const [code, setCode] = useState('');
    const nav = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const email = (route.params as { email?: string })?.email || '';

    const handleVerifyCode = async () => {
        try {
            const response = await VerifyAccount({ email: email, otp: code }).unwrap();
            if (response.success) {
                showToast(
                    'success', 'Congratulations',
                    response?.message || 'Your account has been successfully verified.',
                    () => {
                        const user = response.data.user
                        const token = response.data.token
                        const communityRole = user.communityRole || null
                        dispatch(setCommunityRole(communityRole))
                        dispatch(setAuthToken(token));
                        dispatch(setUser(user))
                    });
            } else {
                showToast(
                    'error',
                    response?.errorCode || 'Verification Failed',
                    response?.message || 'Something went wrong'
                )
            }
        } catch (err: any) {
            showToast(
                'error',
                err?.data?.errorCode || 'Verification Failed',
                err?.data?.message || 'Something went wrong'
            );
        }
    };

    return (
        <Wrapper style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <AppLogo style={{ marginVertical: responsiveHeight(5) }} />
                    <AppText title="Verify Your Account" textSize={4} textFontWeight textAlignment='center' />
                    <AppText title={`A 4-digit OTP has been sent to your email address:`} textSize={1.6} lineHeight={2} textFontWeight textColor={AppColors.darkGray} textAlignment='center' />
                    <AppText title={email} textSize={1.8} lineHeight={2} textFontWeight textColor={AppColors.darkGray} textAlignment='center' />
                    <FieldCode value={code} setValue={setCode} />
                    <AppButton
                        title={'Verify Account'}
                        bgColor={AppColors.BLACK}
                        handlePress={handleVerifyCode}
                        loading={isLoading}
                    />
                </View>
            </ScrollView>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    safeArea: {

    },
    scrollContent: {
        flexGrow: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginVertical: 'auto'
    },
    card: {
        gap: responsiveHeight(1.5),
    },
});

export default VerifyAccount;
