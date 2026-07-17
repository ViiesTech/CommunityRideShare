import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, ViewStyle, StyleSheet, Keyboard } from 'react-native';

type Props = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    isScrollable?: boolean;
    keyboardVerticalOffset?: number;
}

const AppKeyboardAvoidingView = ({
    children,
    style,
    contentContainerStyle,
    isScrollable = true,
    keyboardVerticalOffset
}: Props) => {
    const [behavior, setBehavior] = useState<'padding' | 'height' | undefined>(
        Platform.OS === 'ios' ? 'padding' : undefined
    );

    useEffect(() => {
        if (Platform.OS === 'ios') return;

        const showListener = Keyboard.addListener('keyboardDidShow', () => {
            setBehavior('padding');
        });
        const hideListener = Keyboard.addListener('keyboardDidHide', () => {
            setBehavior(undefined);
        });

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    const content = (
        <ScrollView
            scrollEnabled={isScrollable}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle, style]}
            keyboardShouldPersistTaps="handled"
        >
            {children}
        </ScrollView>
    );

    return (
        <KeyboardAvoidingView
            enabled={true}
            behavior={behavior}
            style={styles.container}
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            {content}
        </KeyboardAvoidingView>
    );
};

export default AppKeyboardAvoidingView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    simpleContent: {
        flex: 1,
    },
});
