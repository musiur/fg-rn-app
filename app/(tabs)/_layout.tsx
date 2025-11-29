import { Tabs, useRouter } from "expo-router";
import {
  Bell,
  Book,
  Clock,
  FileText,
  Home,
  MessageSquare,
  User
} from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { NOTIFICATIONS } from "../../constants/Data";

function NotificationButton() {
  const router = useRouter();
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <TouchableOpacity
      style={styles.notificationButton}
      onPress={() => router.push("/notifications")}
    >
      <Bell size={22} color={Colors.slate[200]} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerRight: () => <NotificationButton />,
        tabBarStyle: {
          backgroundColor: Colors.neutral[950],
          borderTopColor: Colors.neutral[800],
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.brand.light,
        tabBarInactiveTintColor: Colors.slate[400],
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: Colors.neutral[950],
          borderBottomColor: Colors.neutral[800],
          borderBottomWidth: 1,
        },
        headerTintColor: Colors.slate[200],
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "ask FFL",
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="esign"
        options={{
          title: "E-Sign",
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kb"
        options={{
          title: "KB",
          headerTitle: "Knowledge Base",
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  notificationButton: {
    position: "relative",
    marginRight: 16,
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.neutral[800],
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: Colors.status.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
});
