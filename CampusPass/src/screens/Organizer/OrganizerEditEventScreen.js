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
import ErrorState from "../../components/common/ErrorState";

const OrganizerEditEventScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { eventId } = route.params;

  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [posterUri, setPosterUri] = useState(null);
  const [serverPoster, setServerPoster] = useState(null);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(eventSchema),
  });

  const loadData = async () => {
    try {
      setError(null);
      const [catRes, venueRes, eventRes] = await Promise.all([
        eventService.getCategories(),
        eventService.getVenues(),
        eventService.getEventById(eventId),
      ]);

      if (catRes.success) setCategories(catRes.data);
      if (venueRes.success) setVenues(venueRes.data);
      if (eventRes.success) {
        const ev = eventRes.data;
        setEvent(ev);
        setServerPoster(ev.poster);
        
        // Format dates to string
        const startStr = ev.startDate ? new Date(ev.startDate).toISOString().replace("T", " ").substring(0, 16) : "";
        const endStr = ev.endDate ? new Date(ev.endDate).toISOString().replace("T", " ").substring(0, 16) : "";

        reset({
          title: ev.title,
          description: ev.description,
          category: ev.category?._id || ev.category,
          venue: ev.venue?._id || ev.venue,
          startDate: startStr,
          endDate: endStr,
          capacity: ev.capacity,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

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
      console.log("Image picking error", err);
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

      const response = await eventService.updateEvent(eventId, formData);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Event Updated",
          text2: "Details saved successfully",
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
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Fetching event data..." />;
  }

  if (error || !event) {
    return <ErrorState error={error || "Event not found"} onRetry={loadData} />;
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
            ) : serverPoster ? (
              <Image source={{ uri: serverPoster }} style={styles.poster} />
            ) : (
              <View style={styles.pickerInner}>
                <MaterialCommunityIcons name="image-plus" size={40} color={theme.colors.primary} />
                <Text style={{ marginTop: 8, fontWeight: "600" }}>Upload Event Banner Poster</Text>
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
              value={value ? value.toString() : ""}
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
          Save Details
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

export default OrganizerEditEventScreen;
