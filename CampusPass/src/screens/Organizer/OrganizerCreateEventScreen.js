import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Text, useTheme, Button, HelperText } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import CustomInput from "../../components/inputs/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { eventSchema } from "../../validation/schemas";
import eventService from "../../services/eventService";
import LoadingState from "../../components/common/LoadingState";

const OrganizerCreateEventScreen = ({ navigation }) => {
  const theme = useTheme();
  
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [posterUri, setPosterUri] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      venue: "",
      startDate: "",
      endDate: "",
      capacity: "",
    },
  });

  const loadInitialData = async () => {
    try {
      const [catRes, venueRes] = await Promise.all([
        eventService.getCategories(),
        eventService.getVenues(),
      ]);

      if (catRes.success) setCategories(catRes.data);
      if (venueRes.success) setVenues(venueRes.data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error loading config",
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handlePickPoster = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Media library access is needed to select poster.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        setPosterUri(result.assets[0].uri);
      }
    } catch (err) {
      Toast.log("Image picker error", err);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("venue", data.venue);
      // Ensure date strings are in standard ISO format for Mongoose
      formData.append("startDate", new Date(data.startDate).toISOString());
      formData.append("endDate", new Date(data.endDate).toISOString());
      formData.append("capacity", data.capacity.toString());

      if (posterUri) {
        const uriParts = posterUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("poster", {
          uri: posterUri,
          name: `poster.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await eventService.createEvent(formData);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Event Created",
          text2: "Add ticket tiers next",
        });
        navigation.navigate("OrganizerEvents");
      } else {
        Toast.show({
          type: "error",
          text1: "Creation Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred";
      Toast.show({
        type: "error",
        text1: "Creation Failed",
        text2: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading event setup configs..." />;
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        {/* Banner Pick */}
        <TouchableOpacity onPress={handlePickPoster} activeOpacity={0.8}>
          <View style={[styles.posterPicker, { borderColor: theme.colors.outline }]}>
            {posterUri ? (
              <Image source={{ uri: posterUri }} style={styles.poster} />
            ) : (
              <View style={styles.pickerInner}>
                <MaterialCommunityIcons name="image-plus" size={40} color={theme.colors.primary} />
                <Text style={{ marginTop: 8, fontWeight: "600" }}>Upload Event Banner Poster</Text>
                <Text style={{ fontSize: 11, color: theme.colors.outline }}>16:9 Aspect Ratio recommended</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Inputs */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Event Title"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
              leftIcon="pencil"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Event Description"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
              multiline={true}
              numberOfLines={4}
              leftIcon="text"
            />
          )}
        />

        {/* Category Picker Selector */}
        <Text style={styles.pickerLabel}>Select Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }}>
          {categories.map((c) => (
            <Controller
              key={c._id}
              control={control}
              name="category"
              render={({ field: { value } }) => (
                <TouchableOpacity
                  onPress={() => setValue("category", c._id, { shouldValidate: true })}
                  style={[
                    styles.selectionChip,
                    {
                      borderColor: value === c._id ? theme.colors.primary : theme.colors.border,
                      backgroundColor: value === c._id ? theme.colors.primaryContainer : theme.colors.surface,
                    },
                  ]}
                >
                  <Text style={{ color: value === c._id ? theme.colors.primary : "#333", fontWeight: "bold" }}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ))}
        </ScrollView>
        {errors.category?.message && (
          <HelperText type="error" visible={true}>
            {errors.category.message}
          </HelperText>
        )}

        {/* Venue Picker Selector */}
        <Text style={styles.pickerLabel}>Select Venue</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }}>
          {venues.map((v) => (
            <Controller
              key={v._id}
              control={control}
              name="venue"
              render={({ field: { value } }) => (
                <TouchableOpacity
                  onPress={() => setValue("venue", v._id, { shouldValidate: true })}
                  style={[
                    styles.selectionChip,
                    {
                      borderColor: value === v._id ? theme.colors.primary : theme.colors.border,
                      backgroundColor: value === v._id ? theme.colors.primaryContainer : theme.colors.surface,
                    },
                  ]}
                >
                  <Text style={{ color: value === v._id ? theme.colors.primary : "#333", fontWeight: "bold" }}>
                    {v.name} ({v.collegeName})
                  </Text>
                </TouchableOpacity>
              )}
            />
          ))}
        </ScrollView>
        {errors.venue?.message && (
          <HelperText type="error" visible={true}>
            {errors.venue.message}
          </HelperText>
        )}

        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Start Date & Time (YYYY-MM-DD HH:MM)"
              placeholder="e.g. 2026-08-15 14:00"
              value={value}
              onChangeText={onChange}
              error={errors.startDate?.message}
              leftIcon="calendar-clock"
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="End Date & Time (YYYY-MM-DD HH:MM)"
              placeholder="e.g. 2026-08-15 18:00"
              value={value}
              onChangeText={onChange}
              error={errors.endDate?.message}
              leftIcon="calendar-clock"
            />
          )}
        />

        <Controller
          control={control}
          name="capacity"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Capacity / Seats Limit"
              value={value}
              onChangeText={onChange}
              error={errors.capacity?.message}
              keyboardType="numeric"
              leftIcon="account-group"
            />
          )}
        />

        <PrimaryButton
          onPress={handleSubmit(onSubmit)}
          loading={submitting}
          style={styles.button}
        >
          Create Event Draft
        </PrimaryButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    width: "100%",
  },
  posterPicker: {
    width: "100%",
    height: 160,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pickerInner: {
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  selectionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 24,
  },
});

export default OrganizerCreateEventScreen;
