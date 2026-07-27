import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { Text, useTheme, Card, Button, List } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import adminService from "../../services/adminService";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const AdminDashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalBookings: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || "Failed to load dashboard metrics");
      }
    } catch (err) {
      setError(err.message || "Failed to load admin stats");
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
    return <LoadingState message="Loading administrative stats..." />;
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
        <Text style={[styles.welcome, { color: theme.colors.outline }]}>System Control</Text>
        <Text style={[styles.brand, { color: theme.colors.onBackground }]}>Admin Console</Text>
      </View>

      {/* Admin Grid */}
      <View style={styles.grid}>
        <Card style={[styles.gridCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardCenter}>
            <MaterialCommunityIcons name="account-multiple" size={26} color={theme.colors.primary} />
            <Text style={[styles.statValue, { color: theme.colors.onBackground }]}>{stats.totalUsers}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.outline }]}>Total Users</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.gridCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardCenter}>
            <MaterialCommunityIcons name="calendar-month" size={26} color={theme.colors.info} />
            <Text style={[styles.statValue, { color: theme.colors.onBackground }]}>{stats.totalEvents}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.outline }]}>Total Events</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.grid}>
        <Card style={[styles.gridCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardCenter}>
            <MaterialCommunityIcons name="ticket" size={26} color={theme.colors.success} />
            <Text style={[styles.statValue, { color: theme.colors.onBackground }]}>{stats.totalBookings}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.outline }]}>Bookings</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.gridCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardCenter}>
            <MaterialCommunityIcons name="currency-inr" size={26} color={theme.colors.warning} />
            <Text style={[styles.statValue, { color: theme.colors.onBackground }]}>₹{stats.totalRevenue}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.outline }]}>Gross Revenue</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Navigation Panel */}
      <View style={styles.navigationPanel}>
        <Text style={[styles.panelTitle, { color: theme.colors.onBackground }]}>Quick Actions</Text>
        
        <Card style={[styles.navCard, { backgroundColor: theme.colors.surface }]}>
          <List.Item
            title="User Accounts Management"
            subtitle="View profile lists, block or unblock students/organizers"
            left={(props) => <List.Icon {...props} icon="account-cog-outline" color={theme.colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate("AdminUsers")}
          />
        </Card>

        <Card style={[styles.navCard, { backgroundColor: theme.colors.surface }]}>
          <List.Item
            title="Event Approvals & Moderation"
            subtitle="Approve new organizer events or delete policy violations"
            left={(props) => <List.Icon {...props} icon="calendar-check" color={theme.colors.info} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate("AdminApprovals")}
          />
        </Card>

        <Card style={[styles.navCard, { backgroundColor: theme.colors.surface }]}>
          <List.Item
            title="Campus Settings Configuration"
            subtitle="Configure categories, icon assets, and campus venues"
            left={(props) => <List.Icon {...props} icon="cog-outline" color={theme.colors.warning} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate("AdminSettings")}
          />
        </Card>
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
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  gridCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 1,
    borderRadius: 12,
  },
  cardCenter: {
    alignItems: "center",
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  navigationPanel: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  navCard: {
    marginVertical: 6,
    elevation: 1,
  },
});

export default AdminDashboardScreen;
