import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme, Button, Divider, List, Avatar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import eventService from "../../services/eventService";
import profileService from "../../services/profileService";
import reviewService from "../../services/reviewService";
import { updateUser } from "../../redux/slices/authSlice";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const EventDetailsScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { eventId } = route.params;

  const user = useSelector((state) => state.auth.user);
  const favorites = user?.favorites || [];
  const isFavorite = favorites.some((fav) => (fav._id || fav) === eventId);

  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingInfo, setRatingInfo] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavLoading, setIsFavLoading] = useState(false);

  const loadData = async () => {
    try {
      setError(null);
      const [eventRes, reviewsRes, ratingRes] = await Promise.all([
        eventService.getEventById(eventId),
        reviewService.getEventReviews(eventId),
        reviewService.getEventRating(eventId),
      ]);

      if (eventRes.success) setEvent(eventRes.data);
      if (reviewsRes.success) setReviews(reviewsRes.data);
      if (ratingRes.success) setRatingInfo(ratingRes.data);
    } catch (err) {
      setError(err.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const toggleFavorite = async () => {
    if (isFavLoading) return;
    setIsFavLoading(true);

    try {
      let updatedFavs;
      if (isFavorite) {
        await profileService.removeFavorite(eventId);
        updatedFavs = favorites.filter((fav) => (fav._id || fav) !== eventId);
        Toast.show({
          type: "success",
          text1: "Removed from Favorites",
        });
      } else {
        await profileService.addFavorite(eventId);
        updatedFavs = [...favorites, eventId];
        Toast.show({
          type: "success",
          text1: "Added to Favorites",
        });
      }
      dispatch(updateUser({ favorites: updatedFavs }));
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Favorite Error",
        text2: err.message,
      });
    } finally {
      setIsFavLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Fetching details..." />;
  }

  if (error || !event) {
    return <ErrorState error={error || "Event not found"} onRetry={loadData} />;
  }

  const formattedStartDate = new Date(event.startDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const availableSeats = event.capacity - event.bookedSeats;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView>
        {/* Banner Poster */}
        <View style={styles.imageContainer}>
          {event.poster ? (
            <Image source={{ uri: event.poster }} style={styles.poster} />
          ) : (
            <View style={[styles.fallbackPoster, { backgroundColor: theme.colors.primaryContainer }]}>
              <MaterialCommunityIcons name="image" size={64} color={theme.colors.primary} />
            </View>
          )}

          {/* Floating Actions */}
          <TouchableOpacity
            style={[styles.floatingButton, styles.backBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.floatingButton, styles.favBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
            onPress={toggleFavorite}
          >
            <MaterialCommunityIcons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? theme.colors.error : "#FFF"}
            />
          </TouchableOpacity>
        </View>

        {/* Title details */}
        <View style={styles.content}>
          <Text style={[styles.category, { color: theme.colors.primary }]}>
            {event.category?.name?.toUpperCase()}
          </Text>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>{event.title}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>{ratingInfo.averageRating} ({ratingInfo.totalReviews} reviews)</Text>
          </View>

          <Divider style={styles.divider} />

          {/* Organizer Info */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={22} color={theme.colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: theme.colors.onBackground }]}>Organizer</Text>
              <Text style={[styles.infoSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {event.organizer?.fullName || "Campus Club"} ({event.organizer?.email})
              </Text>
            </View>
          </View>

          {/* Date Info */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={22} color={theme.colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: theme.colors.onBackground }]}>Date & Time</Text>
              <Text style={[styles.infoSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {formattedStartDate}
              </Text>
            </View>
          </View>

          {/* Location Info */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={22} color={theme.colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: theme.colors.onBackground }]}>Venue</Text>
              <Text style={[styles.infoSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {event.venue?.name}, {event.venue?.collegeName}
              </Text>
              <Text style={[styles.infoDesc, { color: theme.colors.outline }]}>
                {event.venue?.address}
              </Text>
            </View>
          </View>

          {/* Seat Availability */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-group-outline" size={22} color={theme.colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: theme.colors.onBackground }]}>Availability</Text>
              <Text style={[styles.infoSubtitle, { color: availableSeats > 0 ? theme.colors.success : theme.colors.error }]}>
                {availableSeats > 0 ? `${availableSeats} seats left` : "Sold Out"}
              </Text>
              <Text style={[styles.infoDesc, { color: theme.colors.outline }]}>
                Total Capacity: {event.capacity}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Description */}
          <Text style={[styles.descTitle, { color: theme.colors.onBackground }]}>About Event</Text>
          <Text style={[styles.desc, { color: theme.colors.onSurfaceVariant }]}>{event.description}</Text>

          <Divider style={styles.divider} />

          {/* Reviews List */}
          <Text style={[styles.descTitle, { color: theme.colors.onBackground }]}>Reviews</Text>
          {reviews.length === 0 ? (
            <Text style={{ color: theme.colors.outline, marginVertical: 8 }}>
              No reviews yet. Be the first to attend and review this event!
            </Text>
          ) : (
            reviews.map((review) => (
              <List.Item
                key={review._id}
                title={review.userId?.fullName || "Anonymous Student"}
                description={review.comment}
                titleStyle={{ fontWeight: "bold" }}
                left={() => (
                  <Avatar.Image
                    size={40}
                    source={
                      review.userId?.profileImage
                        ? { uri: review.userId.profileImage }
                        : require("../../../assets/icon.png") // Fallback
                    }
                  />
                )}
                right={() => (
                  <View style={styles.reviewRating}>
                    <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                    <Text style={{ marginLeft: 4, fontWeight: "bold" }}>{review.rating}</Text>
                  </View>
                )}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Booking CTA Bar */}
      <View style={[styles.footerBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <Button
          mode="contained"
          disabled={availableSeats <= 0 || event.status === "cancelled"}
          onPress={() => navigation.navigate("TicketSelection", { eventId: event._id, eventTitle: event.title })}
          style={[styles.bookingBtn, { borderRadius: theme.roundness }]}
          labelStyle={{ fontWeight: "bold", fontSize: 16 }}
        >
          {event.status === "cancelled"
            ? "Event Cancelled"
            : availableSeats <= 0
            ? "Sold Out"
            : "Book Tickets"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 250,
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
  floatingButton: {
    position: "absolute",
    top: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backBtn: {
    left: 16,
  },
  favBtn: {
    right: 16,
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 30,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  infoDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  descTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  bookingBtn: {
    height: 48,
    justifyContent: "center",
  },
});

export default EventDetailsScreen;
