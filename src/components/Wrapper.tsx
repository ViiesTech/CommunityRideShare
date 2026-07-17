import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, StatusBar, ColorValue } from 'react-native'
import { SafeAreaView, Edge } from 'react-native-safe-area-context'
import AppColors from '../utils/AppColors';
import { responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';

type Props = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    barStyle?: 'default' | 'light-content' | 'dark-content';
    statusBarHidden?: boolean;
    statusBarTranslucent?: boolean;
    statusBarBackgroundColor?: ColorValue;
    edges?: Edge[];
    paddingBottom?: number
    paddingHorizontal?: boolean
    bgColor?: string
}

const Wrapper = ({
    children,
    style,
    barStyle = 'dark-content',
    statusBarHidden = false,
    statusBarTranslucent = false,
    statusBarBackgroundColor = AppColors.WHITE,
    edges = ['top'],
    paddingBottom,
    paddingHorizontal = true,
    bgColor = AppColors.WHITE
}: Props) => {

    return (
        <SafeAreaView
            edges={edges}
            style={[
                styles.container,
                {
                    backgroundColor: bgColor,
                    paddingBottom: paddingBottom ? responsiveHeight(paddingBottom) : responsiveHeight(2),
                    paddingHorizontal: paddingHorizontal ? responsiveWidth(5) : 0,
                },
                style,
            ]} >
            <StatusBar
                barStyle={barStyle}
                hidden={statusBarHidden}
                translucent={statusBarTranslucent}
                backgroundColor={statusBarBackgroundColor}
            />
            {children}
        </SafeAreaView>
    )
}

export default Wrapper

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
