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
import SecondaryButton from "../../components/common/SecondaryButton";
import { loginSchema } from "../../validation/schemas";
import authService from "../../services/authService";
import { loginStart, loginSuccess, loginFailure } from "../../redux/slices/authSlice";

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const response = await authService.login(data.email, data.password);
      if (response.success) {
        dispatch(loginSuccess(response.data));
        Toast.show({
          type: "success",
          text1: "Welcome Back!",
          text2: "Login successful",
        });
      } else {
        dispatch(loginFailure(response.message || "Login failed"));
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred";
      dispatch(loginFailure(message));
      Toast.show({
        type: "error",
        text1: "Login Failed",
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
        <Text style={[styles.title, { color: theme.colors.primary }]}>CampusPass</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Discover and book exciting campus events
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

        <View style={styles.forgotContainer}>
          <Text
            style={[styles.forgotText, { color: theme.colors.primary }]}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            Forgot Password?
          </Text>
        </View>

        <PrimaryButton
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          style={styles.button}
        >
          Sign In
        </PrimaryButton>

        <View style={styles.footer}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Don't have an account? </Text>
          <Text
            style={[styles.link, { color: theme.colors.primary }]}
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
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
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: 1,
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
  forgotContainer: {
    alignItems: "flex-end",
    marginVertical: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "600",
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

export default LoginScreen;
