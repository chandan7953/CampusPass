import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

import CustomInput from "../../components/inputs/CustomInput";
import PasswordInput from "../../components/inputs/PasswordInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { registerSchema } from "../../validation/schemas";
import authService from "../../services/authService";
import { loginStart, loginSuccess, loginFailure } from "../../redux/slices/authSlice";

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const response = await authService.register(
        data.fullName,
        data.email,
        data.mobile,
        data.password
      );

      if (response.success) {
        // Automatically save login payload to Redux
        dispatch(loginSuccess(response.data));
        
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "An OTP has been sent to your email.",
        });

        // Trigger OTP generation and navigate
        await authService.sendOTP(data.email);
        navigation.navigate("OTPVerification", { email: data.email });
      } else {
        dispatch(loginFailure(response.message || "Registration failed"));
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred";
      dispatch(loginFailure(message));
      Toast.show({
        type: "error",
        text1: "Sign Up Failed",
        text2: message,
      });
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
        <Text style={[styles.title, { color: theme.colors.primary }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Join CampusPass to access events and tickets
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Full Name"
              value={value}
              onChangeText={onChange}
              error={errors.fullName?.message}
              leftIcon="account-outline"
            />
          )}
        />

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

        <Controller
          control={control}
          name="mobile"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Mobile Number"
              value={value}
              onChangeText={onChange}
              error={errors.mobile?.message}
              keyboardType="phone-pad"
              leftIcon="phone-outline"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
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
          Sign Up
        </PrimaryButton>

        <View style={styles.footer}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Already have an account? </Text>
          <Text
            style={[styles.link, { color: theme.colors.primary }]}
            onPress={() => navigation.navigate("Login")}
          >
            Sign In
          </Text>
        </View>
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
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  link: {
    fontWeight: "bold",
  },
});

export default RegisterScreen;
