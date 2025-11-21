/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { View, Text } from 'react-native'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import LineBreak from './LineBreak';
import AppText from './AppText';

type Prop = {
    pageHead?: string;
    space?: number;
    subTitle?: string;
    subTitleSpace?: number;
}

const AuthHeader = ({ pageHead, space, subTitle, subTitleSpace }: Prop) => {
    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{ backgroundColor: AppColors.ThemeColor, paddingVertical: responsiveHeight(0.8), width: responsiveWidth(35), borderRadius: 5 }}>
                <Text
                    style={{
                        fontSize: responsiveFontSize(2.5),
                        textAlign: 'center',
                        fontWeight: '500',
                        color: AppColors.WHITE,
                    }}
                >
                    Ride-Share
                </Text>
            </View>
            <LineBreak space={space ? space : 2.5} />
            <AppText
                title={pageHead}
                textColor={AppColors.BLACK}
                textFontWeight
                textSize={3.5}
            />
            {subTitle && <LineBreak space={subTitleSpace ? subTitleSpace : 2.5} />}
            {subTitle && <AppText
                title={subTitle}
                textSize={1.5}
                textFontWeight
                textAlignment={'center'}
                textColor={AppColors.GRAY}
            />}
        </View>
    );
};

export default AuthHeader;