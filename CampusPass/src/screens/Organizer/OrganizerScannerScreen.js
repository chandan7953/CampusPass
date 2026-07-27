import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme, Card, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import CustomInput from "../../components/inputs/CustomInput";
import PrimaryButton from "../../components/common/PrimaryButton";
import organizerService from "../../services/organizerService";

const OrganizerScannerScreen = ({ navigation }) => {
  const theme = useTheme();
  
  const [bookingCode, setBookingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);

  const handleCheckIn = async () => {
    if (!bookingCode.trim()) {
      Toast.show({
        type: "error",
        text1: "Empty Code",
        text2: "Please enter a valid ticket booking code",
      });
      return;
    }

    setLoading(true);
    setTicketDetails(null);

    try {
      const response = await organizerService.scanTicket(bookingCode.trim());
      if (response.success) {
        setTicketDetails(response.data);
        Toast.show({
          type: "success",
          text1: "Check-in Successful",
          text2: `Ticket ${bookingCode} has been verified`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Check-in Failed",
          text2: response.message,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Invalid ticket code";
      Toast.show({
        type: "error",
        text1: "Check-in Failed",
        text2: message,
      });
    } finally {
      setLoading(false);
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
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.center}>
          <MaterialCommunityIcons name="qrcode-scan" size={80} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            Gate Check-in Scanner
          </Text>
          <Text style={[styles.desc, { color: theme.colors.onSurfaceVariant }]}>
            Scan the attendee's QR ticket code or type their alphanumeric Booking Code manually to verify entry.
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.inputContainer}>
        <CustomInput
          label="Booking Code (e.g. CP-XXXXXX)"
          value={bookingCode}
          onChangeText={setBookingCode}
          placeholder="Enter ticket code"
          leftIcon="ticket-outline"
          autoCapitalize="characters"
        />

        <PrimaryButton
          onPress={handleCheckIn}
          loading={loading}
          style={styles.btn}
          icon="check-circle"
        >
          Verify & Check In
        </PrimaryButton>
      </View>

      {/* Ticket Scanned Result Details Panel */}
      {ticketDetails && (
        <Card style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.success }]}>
          <Card.Title
            title="Ticket Verified"
            subtitle={`Booking Code: ${ticketDetails.bookingCode}`}
            titleStyle={{ color: theme.colors.success, fontWeight: "bold" }}
            left={(props) => <MaterialCommunityIcons name="checkbox-marked-circle" size={32} color={theme.colors.success} />}
          />
          <Card.Content>
            <Text style={[styles.resultRow, { color: theme.colors.onBackground }]}>
              Booking Status: <Text style={{ fontWeight: "bold" }}>{ticketDetails.bookingStatus.toUpperCase()}</Text>
            </Text>
            <Text style={[styles.resultRow, { color: theme.colors.onBackground }]}>
              Payment Status: <Text style={{ fontWeight: "bold" }}>{ticketDetails.paymentStatus.toUpperCase()}</Text>
            </Text>
            <Text style={[styles.resultRow, { color: theme.colors.onBackground }]}>
              Checked-in At: <Text style={{ fontWeight: "bold" }}>{new Date().toLocaleTimeString()}</Text>
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    elevation: 2,
    paddingVertical: 20,
    marginBottom: 20,
  },
  center: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
  },
  desc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  inputContainer: {
    width: "100%",
  },
  btn: {
    marginTop: 12,
  },
  resultCard: {
    marginTop: 24,
    borderWidth: 2,
  },
  resultRow: {
    fontSize: 14,
    marginVertical: 4,
  },
});

export default OrganizerScannerScreen;
