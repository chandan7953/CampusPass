import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

import CustomInput from "../../components/inputs/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { editProfileSchema } from "../../validation/schemas";
import profileService from "../../services/profileService";
import { updateUser } from "../../redux/slices/authSlice";

const EditProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      mobile: user?.mobile || "",
      department: user?.department || "",
      year: user?.year || "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await profileService.updateProfile(data);
      if (response.success) {
        dispatch(updateUser(response.data));
        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Your details have been saved successfully",
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
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
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

        {user?.role === "student" && (
          <>
            <Controller
              control={control}
              name="department"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Department (Optional)"
                  value={value}
                  onChangeText={onChange}
                  error={errors.department?.message}
                  leftIcon="domain"
                />
              )}
            />

            <Controller
              control={control}
              name="year"
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Year (e.g. 1st, 2nd, 3rd)"
                  value={value}
                  onChangeText={onChange}
                  error={errors.year?.message}
                  leftIcon="school-outline"
                />
              )}
            />
          </>
        )}

        <PrimaryButton
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          style={styles.button}
        >
          Save Changes
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

export default EditProfileScreen;
