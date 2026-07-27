import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Card, Text, Chip, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const BookingCard = ({ booking, onPress }) => {
  const theme = useTheme();
  const event = booking.eventId;

  if (!event) return null;

  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return theme.colors.success;
      case "pending":
        return theme.colors.warning;
      case "cancelled":
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.container}>
          {event.poster ? (
            <Image source={{ uri: event.poster }} style={styles.poster} />
          ) : (
            <View style={[styles.fallbackPoster, { backgroundColor: theme.colors.primaryContainer }]}>
              <MaterialCommunityIcons name="ticket" size={24} color={theme.colors.primary} />
            </View>
          )}

          <View style={styles.details}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]} numberOfLines={1}>
              {event.title}
            </Text>
            <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
              {formattedDate}
            </Text>
            
            <View style={styles.meta}>
              <Text style={[styles.code, { color: theme.colors.outline }]}>
                Code: {booking.bookingCode}
              </Text>
              <Text style={[styles.qty, { color: theme.colors.onBackground }]}>
                Qty: {booking.quantity}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Chip
                compact
                textStyle={{ fontSize: 11, color: "#fff", fontWeight: "bold" }}
                style={{ backgroundColor: getStatusColor(booking.bookingStatus), marginRight: 6 }}
              >
                {booking.bookingStatus.toUpperCase()}
              </Chip>
              <Chip
                compact
                textStyle={{ fontSize: 11, color: "#fff", fontWeight: "bold" }}
                style={{ backgroundColor: getStatusColor(booking.paymentStatus) }}
              >
                {booking.paymentStatus.toUpperCase()}
              </Chip>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    elevation: 1,
  },
  container: {
    flexDirection: "row",
    padding: 12,
  },
  poster: {
    width: 80,
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },
  fallbackPoster: {
    width: 80,
    height: 100,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 13,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  code: {
    fontSize: 12,
    fontFamily: "System",
  },
  qty: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 4,
  },
});

export default BookingCard;
