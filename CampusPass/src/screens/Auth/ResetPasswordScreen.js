import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toast from "react-native-toast-message";

import CustomInput from "../../components/inputs/CustomInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import OTPInput from "../../components/inputs/OTPInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { resetPasswordSchema } from "../../validation/schemas";
import authService from "../../services/authService";

const ResetPasswordScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const email = route.params?.email || "";

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      otp: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(
        data.email,
        data.otp,
        data.password
      );
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Password Reset Successful",
          text2: "You can now log in with your new password",
        });
        navigation.navigate("Login");
      } else {
        Toast.show({
          type: "error",
          text1: "Reset Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred";
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: message,
      });
    } finally {
      setIsLoading(false);
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
        <Text style={[styles.title, { color: theme.colors.primary }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Enter the 6-digit OTP code sent to your email and your new password.
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, value } }) => (
            <OTPInput
              value={value}
              onChangeText={(val) => {
                onChange(val);
                setValue("otp", val);
              }}
              error={errors.otp?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        <PrimaryButton
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          style={styles.button}
        >
          Reset Password
        </PrimaryButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContainer: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
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
});

export default ResetPasswordScreen;
