import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, useTheme, Card, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import paymentService from "../../services/paymentService";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const PaymentScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { bookingId, amount } = route.params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [paying, setPaying] = useState(false);

  const initPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentService.createOrder(bookingId);
      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.message || "Failed to initiate payment order");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to payment server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initPayment();
  }, [bookingId]);

  const handleSimulatePayment = async (status) => {
    if (status === "fail") {
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: "The simulated transaction was declined",
      });
      navigation.goBack();
      return;
    }

    setPaying(true);
    try {
      // In a real environment, the Razorpay SDK returns these parameters after a successful payment.
      // We simulate signature verification here. If the backend is running with a real Razorpay Test Key,
      // it will verify this signature. If mock keys are used, verification might fail.
      // Note: Organizers can always bypass/manually confirm tickets via the PATCH /api/bookings/:id/confirm endpoint!
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;
      const mockSignature = `sig_${Math.random().toString(36).substring(2, 15)}`;

      const response = await paymentService.verifyPayment({
        razorpay_order_id: order.id,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature,
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Payment Verified",
          text2: "Your ticket has been booked!",
        });
        navigation.navigate("TicketDetails", { bookingId });
      } else {
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: response.message || "Signature check failed on backend",
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Verification failed";
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: `${msg}. Tip: An Organizer can confirm this booking from their dashboard.`,
      });
      // Navigate to details anyway so they can see the booking status as pending
      navigation.navigate("TicketDetails", { bookingId });
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <LoadingState message="Initiating secure gateway..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={initPayment} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.center}>
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            Secure Razorpay Checkout
          </Text>
          <Text style={[styles.amount, { color: theme.colors.primary }]}>
            ₹{amount}
          </Text>
          <Text style={[styles.desc, { color: theme.colors.onSurfaceVariant }]}>
            Order ID: {order?.id}
          </Text>
          
          <View style={styles.alertBox}>
            <MaterialCommunityIcons name="information-outline" size={20} color={theme.colors.info} />
            <Text style={[styles.alertText, { color: theme.colors.onSurfaceVariant }]}>
              This screen simulates the Razorpay gateway. If your backend uses real API credentials, signature verification will succeed. If not, you can manually confirm bookings using the Organizer role.
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          loading={paying}
          disabled={paying}
          onPress={() => handleSimulatePayment("success")}
          style={[styles.payBtn, { backgroundColor: theme.colors.success, borderRadius: theme.roundness }]}
          labelStyle={{ fontWeight: "bold" }}
        >
          Simulate Success
        </Button>

        <Button
          mode="outlined"
          disabled={paying}
          onPress={() => handleSimulatePayment("fail")}
          style={[styles.cancelBtn, { borderColor: theme.colors.error, borderRadius: theme.roundness }]}
          textColor={theme.colors.error}
          labelStyle={{ fontWeight: "bold" }}
        >
          Decline Payment
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    elevation: 2,
    paddingVertical: 20,
  },
  center: {
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 12,
  },
  desc: {
    fontSize: 12,
    marginBottom: 16,
  },
  alertBox: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    marginTop: 10,
    alignItems: "flex-start",
  },
  alertText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  actions: {
    marginTop: 24,
  },
  payBtn: {
    height: 48,
    justifyContent: "center",
    marginBottom: 12,
  },
  cancelBtn: {
    height: 48,
    justifyContent: "center",
  },
});

export default PaymentScreen;
