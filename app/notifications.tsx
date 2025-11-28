import { useRouter } from "expo-router";
import { Bell, BellOff, CheckCheck, ChevronRight, FileText, Megaphone, PenTool, X } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { NOTIFICATIONS } from "../constants/Data";
import { AppNotification } from "../types";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    Alert.alert("Success", "All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedNotification(null);
    Alert.alert("Deleted", "Notification removed");
  };

  const handleNotificationPress = (notification: AppNotification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  const handleActionPress = (notification: AppNotification) => {
    if (notification.actionUrl) {
      setSelectedNotification(null);
      // In a real app, navigate to the related screen
      Alert.alert("Navigate", `Would navigate to: ${notification.actionUrl}`);
    }
  };

  const getNotificationIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "sop_change":
        return <FileText size={20} color={Colors.status.info} />;
      case "announcement":
        return <Megaphone size={20} color={Colors.brand.light} />;
      case "signature":
        return <PenTool size={20} color={Colors.status.warning} />;
      case "leave_approved":
      case "movement_approved":
      case "qs_approved":
        return <CheckCheck size={20} color={Colors.status.success} />;
      case "leave_rejected":
      case "movement_rejected":
      case "qs_rejected":
        return <X size={20} color={Colors.status.error} />;
      default:
        return <Bell size={20} color={Colors.slate[400]} />;
    }
  };

  const getPriorityColor = (priority: AppNotification["priority"]) => {
    switch (priority) {
      case "urgent":
        return Colors.status.error;
      case "high":
        return Colors.status.warning;
      case "normal":
        return Colors.status.info;
      case "low":
        return Colors.slate[400];
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck
            size={20}
            color={unreadCount > 0 ? Colors.brand.light : Colors.slate[500]}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.filterTabActive]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === "all" && styles.filterTabTextActive,
            ]}
          >
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "unread" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("unread")}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === "unread" && styles.filterTabTextActive,
            ]}
          >
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <BellOff size={48} color={Colors.slate[500]} />
            <Text style={styles.emptyText}>
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.notificationCardUnread,
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      !notification.read && styles.notificationTitleUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {notification.title}
                  </Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <View style={styles.notificationFooter}>
                  <Text style={styles.notificationTime}>
                    {formatTimestamp(notification.timestamp)}
                  </Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      {
                        borderColor: getPriorityColor(notification.priority),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        { color: getPriorityColor(notification.priority) },
                      ]}
                    >
                      {notification.priority}
                    </Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.slate[500]} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Notification Detail Modal */}
      <Modal
        visible={!!selectedNotification}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                {selectedNotification &&
                  getNotificationIcon(selectedNotification.type)}
                <Text style={styles.modalTitle} numberOfLines={2}>
                  {selectedNotification?.title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedNotification(null)}>
                <X size={24} color={Colors.slate[300]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                {selectedNotification?.message}
              </Text>

              <View style={styles.modalMeta}>
                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalMetaLabel}>Time:</Text>
                  <Text style={styles.modalMetaValue}>
                    {selectedNotification &&
                      new Date(selectedNotification.timestamp).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                  </Text>
                </View>
                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalMetaLabel}>Priority:</Text>
                  <Text
                    style={[
                      styles.modalMetaValue,
                      {
                        color: selectedNotification
                          ? getPriorityColor(selectedNotification.priority)
                          : Colors.slate[400],
                      },
                    ]}
                  >
                    {selectedNotification?.priority.toUpperCase()}
                  </Text>
                </View>
                {selectedNotification?.relatedId && (
                  <View style={styles.modalMetaRow}>
                    <Text style={styles.modalMetaLabel}>Reference:</Text>
                    <Text style={styles.modalMetaValue}>
                      {selectedNotification.relatedId}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              {selectedNotification?.actionUrl && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    selectedNotification &&
                    handleActionPress(selectedNotification)
                  }
                >
                  <Text style={styles.actionButtonText}>View Details</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  selectedNotification &&
                  deleteNotification(selectedNotification.id)
                }
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900],
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    color: Colors.slate[100],
    fontSize: 24,
    fontWeight: "700",
  },
  unreadBadge: {
    backgroundColor: Colors.status.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  markAllButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.neutral[800],
  },
  filterTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900],
  },
  filterTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  filterTabActive: {
    borderBottomColor: Colors.brand.light,
  },
  filterTabText: {
    color: Colors.slate[400],
    fontSize: 14,
    fontWeight: "600",
  },
  filterTabTextActive: {
    color: Colors.brand.light,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    color: Colors.slate[500],
    fontSize: 16,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900],
  },
  notificationCardUnread: {
    backgroundColor: Colors.neutral[800],
    borderColor: Colors.brand.light + "33",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[800],
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  notificationTitleUnread: {
    color: Colors.slate[100],
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brand.light,
  },
  notificationMessage: {
    color: Colors.slate[400],
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationTime: {
    color: Colors.slate[500],
    fontSize: 11,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.neutral[900],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 16,
  },
  modalTitle: {
    color: Colors.slate[100],
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalMessage: {
    color: Colors.slate[300],
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  modalMeta: {
    backgroundColor: Colors.neutral[800],
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  modalMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalMetaLabel: {
    color: Colors.slate[400],
    fontSize: 13,
    fontWeight: "500",
  },
  modalMetaValue: {
    color: Colors.slate[200],
    fontSize: 13,
    fontWeight: "600",
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
    gap: 12,
  },
  actionButton: {
    backgroundColor: Colors.brand.light,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  actionButtonText: {
    color: Colors.neutral[900],
    fontSize: 15,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: Colors.neutral[800],
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    color: Colors.status.error,
    fontSize: 15,
    fontWeight: "600",
  },
});
