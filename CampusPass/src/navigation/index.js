import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";

// Auth Screens
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import OTPVerificationScreen from "../screens/Auth/OTPVerificationScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/Auth/ResetPasswordScreen";

// Student Screens
import StudentHomeScreen from "../screens/Student/StudentHomeScreen";
import EventDetailsScreen from "../screens/Student/EventDetailsScreen";
import SearchScreen from "../screens/Student/SearchScreen";
import CategoryEventsScreen from "../screens/Student/CategoryEventsScreen";
import FavoritesScreen from "../screens/Student/FavoritesScreen";
import NotificationCenterScreen from "../screens/Student/NotificationCenterScreen";
import StudentBookingsScreen from "../screens/Student/StudentBookingsScreen";

// Booking & Payment Screens
import TicketSelectionScreen from "../screens/Booking/TicketSelectionScreen";
import CheckoutScreen from "../screens/Booking/CheckoutScreen";
import PaymentScreen from "../screens/Booking/PaymentScreen";
import TicketDetailsScreen from "../screens/Booking/TicketDetailsScreen";

// Profile Screens
import ProfileHomeScreen from "../screens/Profile/ProfileHomeScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";

// Organizer Screens
import OrganizerDashboardScreen from "../screens/Organizer/OrganizerDashboardScreen";
import OrganizerEventsScreen from "../screens/Organizer/OrganizerEventsScreen";
import OrganizerCreateEventScreen from "../screens/Organizer/OrganizerCreateEventScreen";
import OrganizerEditEventScreen from "../screens/Organizer/OrganizerEditEventScreen";
import OrganizerScannerScreen from "../screens/Organizer/OrganizerScannerScreen";
import EventAttendeesScreen from "../screens/Organizer/EventAttendeesScreen";
import TicketManagementScreen from "../screens/Organizer/TicketManagementScreen";
import AddTicketScreen from "../screens/Organizer/AddTicketScreen";

// Admin Screens
import AdminDashboardScreen from "../screens/SuperAdmin/AdminDashboardScreen";
import AdminUsersScreen from "../screens/SuperAdmin/AdminUsersScreen";
import AdminUserDetailScreen from "../screens/SuperAdmin/AdminUserDetailScreen";
import AdminApprovalsScreen from "../screens/SuperAdmin/AdminApprovalsScreen";
import AdminEventDetailScreen from "../screens/SuperAdmin/AdminEventDetailScreen";
import AdminSettingsScreen from "../screens/SuperAdmin/AdminSettingsScreen";
import AddCategoryScreen from "../screens/SuperAdmin/AddCategoryScreen";
import AddVenueScreen from "../screens/SuperAdmin/AddVenueScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigation
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

// Helper Student Home Stack
const StudentHomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={StudentHomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Search" component={SearchScreen} options={{ title: "Search Events" }} />
    <Stack.Screen name="CategoryEvents" component={CategoryEventsScreen} options={({ route }) => ({ title: route.params.categoryName })} />
    <Stack.Screen name="TicketSelection" component={TicketSelectionScreen} options={{ title: "Select Tickets" }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Booking Checkout" }} />
    <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Razorpay Secure Gateway" }} />
    <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} options={{ title: "My Ticket QR" }} />
    <Stack.Screen name="Notifications" component={NotificationCenterScreen} options={{ title: "Notifications" }} />
  </Stack.Navigator>
);

const StudentBookingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Bookings" component={StudentBookingsScreen} options={{ title: "My Registered Bookings" }} />
    <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} options={{ title: "My Ticket QR" }} />
  </Stack.Navigator>
);

const StudentProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileHomeScreen} options={{ title: "My Settings" }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Update Profile" }} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: "Reset Password" }} />
    <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: "My Saved Favorites" }} />
  </Stack.Navigator>
);

// Student Tab Layout
const StudentTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={StudentHomeStack}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="compass-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={StudentBookingsStack}
        options={{
          tabBarLabel: "Bookings",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="ticket-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={StudentProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Organizer Navigation
const OrganizerDashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Dashboard" component={OrganizerDashboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ScanTicket" component={OrganizerScannerScreen} options={{ title: "Gate Entry Scanner" }} />
  </Stack.Navigator>
);

const OrganizerEventsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="OrganizerEvents" component={OrganizerEventsScreen} options={{ title: "My Created Events" }} />
    <Stack.Screen name="CreateEvent" component={OrganizerCreateEventScreen} options={{ title: "Schedule Event" }} />
    <Stack.Screen name="EditEvent" component={OrganizerEditEventScreen} options={{ title: "Modify Event" }} />
    <Stack.Screen name="TicketManagement" component={TicketManagementScreen} options={{ title: "Ticketing Classes" }} />
    <Stack.Screen name="AddTicket" component={AddTicketScreen} options={{ title: "Add Ticket Tier" }} />
    <Stack.Screen name="EventAttendees" component={EventAttendeesScreen} options={{ title: "Registered Attendees" }} />
  </Stack.Navigator>
);

const OrganizerTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={OrganizerDashboardStack}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-box-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="EventsTab"
        component={OrganizerEventsStack}
        options={{
          tabBarLabel: "My Events",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-text-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={StudentProfileStack} // Shared profile navigation
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Admin Navigation Stacks
const AdminDashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Dashboard" component={AdminDashboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: "User Accounts" }} />
    <Stack.Screen name="AdminUserDetail" component={AdminUserDetailScreen} options={{ title: "User Management" }} />
    <Stack.Screen name="AdminApprovals" component={AdminApprovalsScreen} options={{ title: "Pending Moderations" }} />
    <Stack.Screen name="AdminEventDetail" component={AdminEventDetailScreen} options={{ title: "Approve Listing" }} />
    <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} options={{ title: "Campus Settings" }} />
    <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={{ title: "New Category" }} />
    <Stack.Screen name="AddVenue" component={AddVenueScreen} options={{ title: "New Venue" }} />
  </Stack.Navigator>
);

const AdminTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={AdminDashboardStack}
        options={{
          tabBarLabel: "Console",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="shield-crown-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={StudentProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Main Routing Router Switcher
const NavigationRouter = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const getRoleStack = () => {
    if (user?.role === "admin") {
      return <Stack.Screen name="AdminApp" component={AdminTabs} />;
    } else if (user?.role === "organizer") {
      return <Stack.Screen name="OrganizerApp" component={OrganizerTabs} />;
    }
    return <Stack.Screen name="StudentApp" component={StudentTabs} />;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          getRoleStack()
        ) : (
          <Stack.Screen name="AuthApp" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationRouter;
