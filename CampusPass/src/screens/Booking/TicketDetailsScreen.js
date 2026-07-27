import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { Text, useTheme, Card, Divider, Button, Chip } from "react-native-paper";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import bookingService from "../../services/bookingService";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const TicketDetailsScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { bookingId } = route.params;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const loadDetails = async () => {
    try {
      setError(null);
      const response = await bookingService.getBookingDetails(bookingId);
      if (response.success) {
        setBooking(response.data);
      } else {
        setError(response.message || "Failed to load ticket details");
      }
    } catch (err) {
      setError(err.message || "Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      const response = await bookingService.cancelBooking(bookingId);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Booking Cancelled",
          text2: "Your tickets have been returned.",
        });
        loadDetails();
      } else {
        Toast.show({
          type: "error",
          text1: "Cancellation Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Cancellation Failed",
        text2: err.message || "Something went wrong",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingState message="Retrieving your ticket..." />;
  }

  if (error || !booking) {
    return <ErrorState error={error || "Booking not found"} onRetry={loadDetails} />;
  }

  const event = booking.eventId;
  const ticket = booking.ticketId;

  const formattedDate = new Date(event?.startDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        {/* Ticket Header Banner */}
        <View style={[styles.ticketHeader, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.headerTitle}>{event?.title}</Text>
          <Text style={styles.headerSubtitle}>{formattedDate}</Text>
        </View>

        {/* QR Code Section */}
        {booking.bookingStatus === "confirmed" && booking.qrCode ? (
          <View style={styles.qrSection}>
            <Image source={{ uri: booking.qrCode }} style={styles.qrCode} />
            <Text style={[styles.bookingCode, { color: theme.colors.onBackground }]}>
              {booking.bookingCode}
            </Text>
            <Text style={[styles.scanInstruction, { color: theme.colors.outline }]}>
              Show this QR code at the entrance gate to scan.
            </Text>
          </View>
        ) : booking.bookingStatus === "cancelled" ? (
          <View style={styles.qrSection}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={80} color={theme.colors.error} />
            <Text style={[styles.cancelledText, { color: theme.colors.error }]}>TICKET CANCELLED</Text>
          </View>
        ) : (
          <View style={styles.qrSection}>
            <MaterialCommunityIcons name="lock" size={60} color={theme.colors.warning} />
            <Text style={[styles.pendingText, { color: theme.colors.warning }]}>PAYMENT PENDING</Text>
            <Button
              mode="contained"
              style={{ marginTop: 12 }}
              onPress={() => navigation.navigate("Payment", { bookingId, amount: booking.totalAmount })}
            >
              Complete Payment (₹{booking.totalAmount})
            </Button>
          </View>
        )}

        <Divider />

        {/* Ticket Details Info */}
        <Card.Content style={styles.details}>
          <View style={styles.row}>
            <Text style={{ color: theme.colors.outline }}>Ticket Class</Text>
            <Text style={[styles.detailValue, { color: theme.colors.onBackground }]}>{ticket?.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: theme.colors.outline }}>Quantity</Text>
            <Text style={[styles.detailValue, { color: theme.colors.onBackground }]}>{booking.quantity} pass(es)</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: theme.colors.outline }}>Total Amount</Text>
            <Text style={[styles.detailValue, { color: theme.colors.onBackground }]}>₹{booking.totalAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: theme.colors.outline }}>Venue</Text>
            <Text style={[styles.detailValue, { color: theme.colors.onBackground, textAlign: "right", flex: 1 }]}>
              {event?.venue?.name}, {event?.venue?.collegeName}
            </Text>
          </View>
          
          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.row}>
            <Text style={{ color: theme.colors.outline }}>Booking Status</Text>
            <Chip compact style={{ backgroundColor: getStatusColor(booking.bookingStatus) }} textStyle={{ color: "#FFF", fontSize: 11, fontWeight: "bold" }}>
              {booking.bookingStatus.toUpperCase()}
            </Chip>
          </View>
          <View style={styles.row}>
            <Text style={{ color: theme.colors.outline }}>Payment Status</Text>
            <Chip compact style={{ backgroundColor: getStatusColor(booking.paymentStatus) }} textStyle={{ color: "#FFF", fontSize: 11, fontWeight: "bold" }}>
              {booking.paymentStatus.toUpperCase()}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Cancellation Action */}
      {booking.bookingStatus !== "cancelled" && (
        <View style={styles.actions}>
          <Button
            mode="outlined"
            loading={cancelling}
            disabled={cancelling}
            textColor={theme.colors.error}
            style={{ borderColor: theme.colors.error, borderRadius: theme.roundness }}
            onPress={handleCancelBooking}
          >
            Cancel Booking
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    elevation: 2,
    borderRadius: 16,
    overflow: "hidden",
  },
  ticketHeader: {
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#FFF",
    fontSize: 13,
    marginTop: 4,
    opacity: 0.9,
  },
  qrSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  bookingCode: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
    marginVertical: 12,
  },
  scanInstruction: {
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  cancelledText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  pendingText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
  },
  details: {
    paddingVertical: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  actions: {
    marginVertical: 24,
    paddingBottom: 24,
  },
});

export default TicketDetailsScreen;
