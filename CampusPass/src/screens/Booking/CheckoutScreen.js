import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme, Card, Divider, Button, List } from "react-native-paper";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import bookingService from "../../services/bookingService";

const CheckoutScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { eventId, eventTitle, ticket, quantity } = route.params;

  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const totalAmount = ticket.price * quantity;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await bookingService.createBooking(ticket._id, quantity);
      
      if (response.success) {
        const booking = response.data;
        Toast.show({
          type: "success",
          text1: "Booking Initialized",
          text2: "Order created successfully",
        });

        // If the ticket is free (price = 0), navigate directly to booking success/details
        if (booking.totalAmount === 0 || booking.bookingStatus === "confirmed") {
          navigation.navigate("TicketDetails", { bookingId: booking._id });
        } else {
          // Navigate to Payment Screen
          navigation.navigate("Payment", { bookingId: booking._id, amount: booking.totalAmount });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Booking Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred";
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>Checkout Summary</Text>

        {/* Event Details Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.eventTitle, { color: theme.colors.onBackground }]}>{eventTitle}</Text>
            <Divider style={styles.divider} />
            <List.Item
              title="Ticket Tier"
              description={ticket.title}
              titleStyle={{ fontWeight: "bold" }}
              left={(props) => <List.Icon {...props} icon="ticket-outline" />}
            />
            <List.Item
              title="Quantity"
              description={`${quantity} ticket(s)`}
              titleStyle={{ fontWeight: "bold" }}
              left={(props) => <List.Icon {...props} icon="numeric" />}
            />
            <List.Item
              title="Price per Ticket"
              description={`₹${ticket.price}`}
              titleStyle={{ fontWeight: "bold" }}
              left={(props) => <List.Icon {...props} icon="cash" />}
            />
          </Card.Content>
        </Card>

        {/* Student Details Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Title title="Attendee Information" titleStyle={{ fontWeight: "bold", fontSize: 16 }} />
          <Card.Content>
            <Divider style={{ marginBottom: 12 }} />
            <Text style={[styles.infoRow, { color: theme.colors.onSurfaceVariant }]}>
              Name: <Text style={styles.boldText}>{user?.fullName}</Text>
            </Text>
            <Text style={[styles.infoRow, { color: theme.colors.onSurfaceVariant }]}>
              Email: <Text style={styles.boldText}>{user?.email}</Text>
            </Text>
            <Text style={[styles.infoRow, { color: theme.colors.onSurfaceVariant }]}>
              Mobile: <Text style={styles.boldText}>{user?.mobile}</Text>
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Footer bar */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <View style={styles.priceRow}>
          <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>Payable Amount</Text>
          <Text style={[styles.totalPrice, { color: theme.colors.onBackground }]}>₹{totalAmount}</Text>
        </View>
        <Button
          mode="contained"
          loading={loading}
          disabled={loading}
          onPress={handleCheckout}
          style={[styles.checkoutBtn, { borderRadius: theme.roundness }]}
          labelStyle={{ fontWeight: "bold" }}
        >
          {totalAmount === 0 ? "Book Free Ticket" : "Pay & Book"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    marginVertical: 8,
    elevation: 0,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    fontSize: 14,
    marginVertical: 4,
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  checkoutBtn: {
    height: 48,
    justifyContent: "center",
  },
});

export default CheckoutScreen;
