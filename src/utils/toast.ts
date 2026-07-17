import Toast from 'react-native-toast-message';

export const showToast = (type: 'success' | 'error' | 'info', message: string, text2?: string, onHide?: () => void) => {
  Toast.show({
    type: type,
    text1: message,
    text2: text2,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
    onHide: onHide,
  });
};
