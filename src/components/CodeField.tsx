/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import AppColors from '../utils/AppColors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';

const CELL_COUNT = 4;

const FieldCode: React.FC = () => {
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    return (
        <View style={styles.container}>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View
                            style={[
                                styles.cellRoot,
                                { borderWidth: 1, borderColor: AppColors.LIGHTGRAY },
                                isFocused && styles.focusCell,
                            ]}
                            onLayout={getCellOnLayoutHandler(index)}>
                            <Text style={styles.cellText}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        </View>

                        {index < CELL_COUNT - 1 && (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 6,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: AppColors.GRAY,
                                        textAlign: 'center',
                                        lineHeight: 20,
                                    }}>
                                    -
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

export default FieldCode;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    codeFieldRoot: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: responsiveWidth(90),
    },
    cellRoot: {
        width: responsiveWidth(18),
        height: responsiveHeight(8),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: AppColors.BLACK,
        borderRadius: 10,
        backgroundColor: AppColors.inputBgColor
    },
    cellText: {
        fontSize: responsiveFontSize(3),
        color: AppColors.BLACK,
        fontWeight: '500',
    },
    focusCell: {
        borderColor: AppColors.ThemeColor,
        borderRadius: 10,
        overflow: 'hidden'
    },
});
