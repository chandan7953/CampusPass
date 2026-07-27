import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { useTheme } from "react-native-paper";
import bookingService from "../../services/bookingService";
import BookingCard from "../../components/cards/BookingCard";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const StudentBookingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    try {
      setError(null);
      const response = await bookingService.getMyBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        setError(response.message || "Failed to load bookings");
      }
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  if (loading) {
    return <LoadingState message="Fetching your bookings..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadBookings} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {bookings.length === 0 ? (
        <EmptyState
          icon="ticket-percent"
          title="No Bookings Yet"
          description="You haven't booked any event tickets yet. Explore events on the home tab!"
          actionLabel="Browse Events"
          onAction={() => navigation.navigate("Home")}
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onPress={() => navigation.navigate("TicketDetails", { bookingId: item._id })}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StudentBookingsScreen;
