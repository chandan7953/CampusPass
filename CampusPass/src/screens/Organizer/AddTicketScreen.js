import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toast from "react-native-toast-message";

import CustomInput from "../../components/inputs/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import { ticketSchema } from "../../validation/schemas";
import eventService from "../../services/eventService";

const AddTicketScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { eventId, eventTitle } = route.params;
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      quantity: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await eventService.createTicket({
        eventId,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        quantity: Number(data.quantity),
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Ticket Tier Added",
          text2: "Ticket created successfully",
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to create",
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

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <Text style={[styles.subtitle, { color: theme.colors.outline }]} numberOfLines={1}>{eventTitle}</Text>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>New Ticket Tier</Text>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Ticket Tier Name (e.g. Early Bird, VIP)"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
              leftIcon="ticket-outline"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Description / Perks"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
              multiline={true}
              numberOfLines={3}
              leftIcon="text"
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Ticket Price (₹) - Enter 0 for free entry"
              value={value ? value.toString() : ""}
              onChangeText={onChange}
              error={errors.price?.message}
              keyboardType="numeric"
              leftIcon="currency-inr"
            />
          )}
        />

        <Controller
          control={control}
          name="quantity"
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Available Inventory Quantity"
              value={value ? value.toString() : ""}
              onChangeText={onChange}
              error={errors.quantity?.message}
              keyboardType="numeric"
              leftIcon="numeric"
            />
          )}
        />

        <PrimaryButton
          onPress={handleSubmit(onSubmit)}
          loading={submitting}
          style={styles.button}
        >
          Add Ticket Tier
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: 24,
  },
});

export default AddTicketScreen;
