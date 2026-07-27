import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const EventCard = ({ event, onPress }) => {
  const theme = useTheme();

  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
        <View style={styles.imageContainer}>
          {event.poster ? (
            <Image source={{ uri: event.poster }} style={styles.image} />
          ) : (
            <View style={[styles.fallbackImage, { backgroundColor: theme.colors.primaryContainer }]}>
              <MaterialCommunityIcons name="image-off" size={40} color={theme.colors.primary} />
            </View>
          )}
          {event.isFeatured && (
            <View style={[styles.badge, { backgroundColor: theme.colors.accent }]}>
              <Text style={styles.badgeText}>FEATURED</Text>
            </View>
          )}
        </View>

        <Card.Content style={styles.content}>
          <Text style={[styles.category, { color: theme.colors.primary }]}>
            {event.category?.name?.toUpperCase() || "EVENT"}
          </Text>
          <Text style={[styles.title, { color: theme.colors.onBackground }]} numberOfLines={1}>
            {event.title}
          </Text>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={16} color={theme.colors.outline} />
            <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
              {formattedDate}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.outline} />
            <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
              {event.venue?.name ? `${event.venue.name}, ${event.venue.collegeName}` : "Campus Venue"}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
  },
  imageContainer: {
    height: 150,
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  fallbackImage: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  category: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 13,
  },
});

export default EventCard;
