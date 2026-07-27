import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { Text, useTheme, Card, IconButton, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import organizerService from "../../services/organizerService";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const OrganizerDashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  const [stats, setStats] = useState({ totalEvents: 0, totalBookings: 0, totalRevenue: 0 });
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);
      const [statsRes, analyticsRes] = await Promise.all([
        organizerService.getDashboardStats(),
        organizerService.getEventAnalytics(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <LoadingState message="Loading organizer dashboard..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadData} />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={[styles.welcome, { color: theme.colors.outline }]}>Control Center</Text>
        <Text style={[styles.brand, { color: theme.colors.onBackground }]}>Organizer Dashboard</Text>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.grid}>
        <Card style={[styles.gridCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardCenter}>
            <MaterialCommunityIcons name="calendar-multiselect" size={24} color={theme.colors.primary} />
            <Text style={[styles.statValue, { color: theme.colors.onBackground }]}>{stats.totalEvents}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.outline }]}>Total Events</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.gridCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardCenter}>
            <MaterialCommunityIcons name="ticket-confirmation" size={24} color={theme.colors.success} />
            <Text style={[styles.statValue, { color: theme.colors.onBackground }]}>{stats.totalBookings}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.outline }]}>Registrations</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.gridCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardCenter}>
            <MaterialCommunityIcons name="currency-inr" size={24} color={theme.colors.warning} />
            <Text style={[styles.statValue, { color: theme.colors.onBackground }]}>₹{stats.totalRevenue}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.outline }]}>Revenue</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Scanner Action */}
      <View style={styles.scanSection}>
        <Button
          mode="contained"
          icon="qrcode-scan"
          onPress={() => navigation.navigate("ScanTicket")}
          style={[styles.scanBtn, { borderRadius: theme.roundness }]}
          labelStyle={{ fontWeight: "bold", fontSize: 16 }}
        >
          Open Ticket Scanner
        </Button>
      </View>

      {/* Event Analytics */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Ticket Sales Analytics</Text>
        {analytics.length === 0 ? (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.cardCenter}>
              <MaterialCommunityIcons name="chart-bell-curve" size={40} color={theme.colors.outline} />
              <Text style={{ marginTop: 8, color: theme.colors.outline }}>No active event bookings.</Text>
            </Card.Content>
          </Card>
        ) : (
          analytics.map((item) => (
            <Card key={item.eventId} style={[styles.analyticCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content style={styles.analyticRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.eventTitle, { color: theme.colors.onBackground }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={{ color: theme.colors.outline, fontSize: 12 }}>
                    Event ID: {item.eventId.substring(18)}
                  </Text>
                </View>
                <View style={styles.analyticBadge}>
                  <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{item.bookings}</Text>
                  <Text style={{ fontSize: 9, color: theme.colors.outline }}>BOOKED</Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcome: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  brand: {
    fontSize: 24,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  gridCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 1,
    borderRadius: 12,
  },
  cardCenter: {
    alignItems: "center",
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  scanSection: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  scanBtn: {
    height: 48,
    justifyContent: "center",
  },
  section: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyCard: {
    elevation: 0,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  analyticCard: {
    marginVertical: 6,
    elevation: 1,
  },
  analyticRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  analyticBadge: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#E0E0E0",
  },
  badgeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default OrganizerDashboardScreen;
