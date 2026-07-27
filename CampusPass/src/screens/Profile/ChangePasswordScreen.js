import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toast from "react-native-toast-message";

import PasswordInput from "../../components/inputs/PasswordInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { changePasswordSchema } from "../../validation/schemas";
import profileService from "../../services/profileService";

const ChangePasswordScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await profileService.changePassword(
        data.currentPassword,
        data.newPassword
      );
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Password Changed",
          text2: "Your password has been updated successfully",
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred";
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              value={value}
              onChangeText={onChange}
              error={errors.currentPassword?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={value}
              onChangeText={onChange}
              error={errors.newPassword?.message}
            />
          )}
        />

        <PrimaryButton
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          style={styles.button}
        >
          Change Password
        </PrimaryButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: 24,
  },
});

export default ChangePasswordScreen;
