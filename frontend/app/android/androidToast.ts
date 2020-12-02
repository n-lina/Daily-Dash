import { ToastAndroid } from "react-native";

export const toastAndroid = (message: string) => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.LONG,
    ToastAndroid.TOP,
  );
};
