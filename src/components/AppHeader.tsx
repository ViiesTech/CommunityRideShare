import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from './AppText';
import SVGXml from './SVGXML';
import { AppIcons } from '../assets/icons';
import AppColors from '../utils/AppColors';
import { responsiveWidth } from '../utils/Responsive_Dimensions';


const AppHeader = ({ title, description, paddingHorizontal = false }: { title: string; description?: string, paddingHorizontal?: boolean }) => {
    const navigation = useNavigation();
    return (
        <View style={[styles.headerRow, { paddingHorizontal: paddingHorizontal ? responsiveWidth(5) : 0 }]}>
            <TouchableOpacity
                style={{ padding: responsiveWidth(1) }}
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
            >
                <SVGXml icon={AppIcons.arrowLeft} width={18} height={18} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <AppText title={title} textColor={AppColors.BLACK} textFontWeight textSize={2} />
                {description && <AppText title={description} textColor={AppColors.GRAY} textFontWeight={false} textSize={1.5} />}
            </View>
            <View style={styles.headerSpacer} />
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        width: responsiveWidth(),
        paddingVertical: responsiveWidth(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerSpacer: {
        width: responsiveWidth(6),
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default AppHeader;
