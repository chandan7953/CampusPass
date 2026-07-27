import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

import OTPInput from "../../components/inputs/OTPInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import SecondaryButton from "../../components/common/SecondaryButton";
import authService from "../../services/authService";
import { updateUser } from "../../redux/slices/authSlice";

const OTPVerificationScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const email = route.params?.email || useSelector((state) => state.auth.user?.email);
  
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter a 6-digit OTP code",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(email, otp);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Verification Successful",
          text2: "Your email has been verified",
        });

        // Update verification flag in Redux
        dispatch(updateUser({ isVerified: true }));
        
        // If navigation stack has a goBack or home, go there
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Invalid OTP entered";
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const response = await authService.sendOTP(email);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "OTP Sent",
          text2: "A new code has been sent to your email",
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to resend OTP";
      Toast.show({
        type: "error",
        text1: "Resend Failed",
        text2: message,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Verify Email</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          We have sent a 6-digit verification code to{"\n"}
          <Text style={{ fontWeight: "bold", color: theme.colors.onBackground }}>{email}</Text>
        </Text>
      </View>

      <View style={styles.form}>
        <OTPInput value={otp} onChangeText={setOtp} />

        <PrimaryButton
          onPress={handleVerify}
          loading={isLoading}
          style={styles.button}
        >
          Verify & Proceed
        </PrimaryButton>

        <SecondaryButton
          onPress={handleResend}
          loading={isResending}
          style={styles.resend}
        >
          Resend Code
        </SecondaryButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: 20,
  },
  resend: {
    marginTop: 10,
  },
});

export default OTPVerificationScreen;
