import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme, Card, Button, IconButton } from "react-native-paper";
import Toast from "react-native-toast-message";
import eventService from "../../services/eventService";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const TicketSelectionScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { eventId, eventTitle } = route.params;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEventTickets(eventId);
      if (response.success) {
        const activeTickets = response.data.filter((t) => t.status === "active" && t.remainingQuantity > 0);
        setTickets(activeTickets);
        if (activeTickets.length > 0) {
          setSelectedTicketId(activeTickets[0]._id);
        }
      } else {
        setError(response.message || "Failed to load tickets");
      }
    } catch (err) {
      setError(err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [eventId]);

  if (loading) {
    return <LoadingState message="Checking ticket tiers..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadTickets} />;
  }

  const selectedTicket = tickets.find((t) => t._id === selectedTicketId);
  const totalAmount = selectedTicket ? selectedTicket.price * quantity : 0;

  const handleIncrement = () => {
    if (!selectedTicket) return;
    if (quantity >= Math.min(selectedTicket.remainingQuantity, 5)) {
      Toast.show({
        type: "info",
        text1: "Limit Reached",
        text2: "You can book max 5 tickets at once (subject to availability)",
      });
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) return;
    setQuantity((q) => q - 1);
  };

  const handleProceed = () => {
    if (!selectedTicket) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a ticket tier first",
      });
      return;
    }
    navigation.navigate("Checkout", {
      eventId,
      eventTitle,
      ticket: selectedTicket,
      quantity,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {tickets.length === 0 ? (
        <EmptyState
          icon="ticket-outline"
          title="No Tickets Available"
          description="There are currently no tickets available for this event."
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={[styles.subtitle, { color: theme.colors.outline }]}>
              {eventTitle}
            </Text>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
              Choose Ticket Tier
            </Text>

            {tickets.map((ticket) => {
              const isSelected = ticket._id === selectedTicketId;
              return (
                <TouchableOpacity
                  key={ticket._id}
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedTicketId(ticket._id);
                    setQuantity(1); // Reset quantity on changing ticket tier
                  }}
                >
                  <Card
                    style={[
                      styles.card,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                  >
                    <Card.Content style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <Text style={[styles.ticketTitle, { color: theme.colors.onBackground }]}>
                          {ticket.title}
                        </Text>
                        <Text style={[styles.price, { color: theme.colors.primary }]}>
                          ₹{ticket.price}
                        </Text>
                      </View>
                      <Text style={[styles.ticketDesc, { color: theme.colors.onSurfaceVariant }]}>
                        {ticket.description || "Access to the main event."}
                      </Text>
                      <Text style={[styles.remaining, { color: theme.colors.outline }]}>
                        {ticket.remainingQuantity} tickets left
                      </Text>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              );
            })}

            {/* Quantity Selector */}
            {selectedTicket && (
              <View style={[styles.quantitySection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.quantityTitle, { color: theme.colors.onBackground }]}>
                  Select Quantity
                </Text>
                <View style={styles.counter}>
                  <IconButton
                    icon="minus"
                    size={20}
                    disabled={quantity <= 1}
                    onPress={handleDecrement}
                    style={styles.counterBtn}
                  />
                  <Text style={[styles.counterText, { color: theme.colors.onBackground }]}>
                    {quantity}
                  </Text>
                  <IconButton
                    icon="plus"
                    size={20}
                    onPress={handleIncrement}
                    style={styles.counterBtn}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Pricing Summary & Proceed */}
          <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
            <View style={styles.priceRow}>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>Total Price</Text>
              <Text style={[styles.totalPrice, { color: theme.colors.onBackground }]}>₹{totalAmount}</Text>
            </View>
            <Button
              mode="contained"
              onPress={handleProceed}
              style={[styles.proceedBtn, { borderRadius: theme.roundness }]}
              labelStyle={{ fontWeight: "bold" }}
            >
              Proceed to Checkout
            </Button>
          </View>
        </>
      )}
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
  subtitle: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  card: {
    marginVertical: 8,
    elevation: 0,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ticketDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  remaining: {
    fontSize: 11,
    fontWeight: "600",
  },
  quantitySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  quantityTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterBtn: {
    margin: 0,
    backgroundColor: "#F0F0F0",
  },
  counterText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 12,
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
  proceedBtn: {
    height: 48,
    justifyContent: "center",
  },
});

export default TicketSelectionScreen;
