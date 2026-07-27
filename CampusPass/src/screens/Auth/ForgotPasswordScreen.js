import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toast from "react-native-toast-message";

import CustomInput from "../../components/inputs/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { forgotPasswordSchema } from "../../validation/schemas";
import authService from "../../services/authService";

const ForgotPasswordScreen = ({ navigation }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(data.email);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "OTP Sent",
          text2: "A reset code has been sent to your email",
        });
        navigation.navigate("ResetPassword", { email: data.email });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred";
      Toast.show({
        type: "error",
        text1: "Request Failed",
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
        <Text style={[styles.title, { color: theme.colors.primary }]}>Forgot Password?</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Enter your email address and we'll send you a 6-digit OTP to reset your password.
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Email Address"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              leftIcon="email-outline"
            />
          )}
        />

        <PrimaryButton
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          style={styles.button}
        >
          Send Reset OTP
        </PrimaryButton>
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
});

export default ForgotPasswordScreen;
