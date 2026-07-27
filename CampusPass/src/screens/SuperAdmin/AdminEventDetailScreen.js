import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { Text, useTheme, Card, Divider, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import eventService from "../../services/eventService";
import adminService from "../../services/adminService";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const AdminEventDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const loadEventDetails = async () => {
    try {
      setError(null);
      const response = await eventService.getEventById(eventId);
      if (response.success) {
        setEvent(response.data);
      } else {
        setError(response.message || "Failed to load event details");
      }
    } catch (err) {
      setError(err.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const handleApprove = async () => {
    setUpdating(true);
    try {
      const response = await adminService.approveEvent(eventId);
      if (response.success) {
        Toast.show({ type: "success", text1: "Event Approved Successfully" });
        navigation.goBack();
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to approve", text2: err.message });
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    setUpdating(true);
    try {
      const response = await adminService.rejectEvent(eventId);
      if (response.success) {
        Toast.show({ type: "info", text1: "Event Listing Rejected" });
        navigation.goBack();
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to reject", text2: err.message });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setUpdating(true);
    try {
      const response = await adminService.deleteEvent(eventId);
      if (response.success) {
        Toast.show({ type: "success", text1: "Event Deleted permanently" });
        navigation.goBack();
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to delete", text2: err.message });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingState message="Fetching event specs..." />;
  }

  if (error || !event) {
    return <ErrorState error={error || "Event not found"} onRetry={loadEventDetails} />;
  }

  const formattedStartDate = new Date(event.startDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Banner */}
      <View style={styles.imageContainer}>
        {event.poster ? (
          <Image source={{ uri: event.poster }} style={styles.poster} />
        ) : (
          <View style={[styles.fallbackPoster, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="image" size={64} color={theme.colors.primary} />
          </View>
        )}
      </View>

      <Card style={[styles.detailsCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.category, { color: theme.colors.primary }]}>{event.category?.name?.toUpperCase()}</Text>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>{event.title}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.outline }]}>
            Hosted by: {event.organizer?.fullName} ({event.organizer?.email})
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.rowText, { color: theme.colors.onBackground }]}>{formattedStartDate}</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.rowText, { color: theme.colors.onBackground }]}>
              {event.venue?.name}, {event.venue?.collegeName}
            </Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="account-group-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.rowText, { color: theme.colors.onBackground }]}>Capacity: {event.capacity} seats</Text>
          </View>

          <Divider style={styles.divider} />

          <Text style={[styles.heading, { color: theme.colors.onBackground }]}>Event Description</Text>
          <Text style={[styles.desc, { color: theme.colors.onSurfaceVariant }]}>{event.description}</Text>
        </Card.Content>
      </Card>

      {/* Admin Actions */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          loading={updating}
          disabled={updating}
          onPress={handleApprove}
          style={[styles.btn, { backgroundColor: theme.colors.success, borderRadius: theme.roundness }]}
        >
          Approve Event Listing
        </Button>
        <Button
          mode="contained"
          loading={updating}
          disabled={updating}
          onPress={handleReject}
          style={[styles.btn, { backgroundColor: theme.colors.warning, borderRadius: theme.roundness }]}
        >
          Reject Event Listing
        </Button>
        <Button
          mode="outlined"
          loading={updating}
          disabled={updating}
          onPress={handleDelete}
          textColor={theme.colors.error}
          style={[styles.btn, { borderColor: theme.colors.error, borderRadius: theme.roundness }]}
        >
          Delete Event (Violations)
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 180,
    width: "100%",
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fallbackPoster: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  category: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  divider: {
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  rowText: {
    marginLeft: 12,
    fontSize: 14,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  btn: {
    marginVertical: 4,
    height: 44,
    justifyContent: "center",
  },
});

export default AdminEventDetailScreen;
