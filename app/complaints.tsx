
import AsyncStorage from "@react-native-async-storage/async-storage";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Select } from "../components/Select";
import { StatusPill } from "../components/StatusPill";
import { Colors } from "../constants/Colors";
import { EMPLOYEES } from "../constants/Data";
import { Complaint, Employee, Suggestion } from "../types";

export default function ComplaintsScreen() {
  const [employee, setEmployee] = useState<Employee>(EMPLOYEES[0]);
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "C001",
      subject: "AC not working in Section B",
      category: "Facility",
      status: "pending",
      date: "2025-08-10",
      priority: "Medium",
      description:
        "The air conditioning unit in Section B has been malfunctioning for 3 days.",
    },
    {
      id: "C002",
      subject: "Overtime payment delay",
      category: "Payroll",
      status: "resolved",
      date: "2025-08-05",
      priority: "High",
      description: "Overtime for July has not been credited yet.",
    },
  ]);
  const [formData, setFormData] = useState({
    subject: "",
    category: "General",
    priority: "Low",
    description: "",
  });

  // Suggestion State
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "S001",
      text: "Please add more vegetarian options in the canteen.",
      date: "2025-08-12",
      status: "reviewed",
    },
  ]);
  const [suggestionModalVisible, setSuggestionModalVisible] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("employeeId").then((id) => {
      const emp = EMPLOYEES.find((e) => e.id === id);
      if (emp) setEmployee(emp);
    });
  }, []);

  const submitComplaint = () => {
    if (!formData.subject.trim() || !formData.description.trim()) {
      Alert.alert("Required", "Please fill in subject and description");
      return;
    }

    const newComplaint = {
      id: "C" + String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
      ...formData,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };

    setComplaints([newComplaint as Complaint, ...complaints]);
    setFormData({
      subject: "",
      category: "General",
      priority: "Low",
      description: "",
    });
    Alert.alert("Success", "Complaint submitted successfully!");
  };

  const submitSuggestion = () => {
    if (!newSuggestion.trim()) {
      Alert.alert("Required", "Please enter a suggestion");
      return;
    }

    const suggestion: Suggestion = {
      id: "S" + String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
      text: newSuggestion,
      date: new Date().toISOString().split("T")[0],
      status: "submitted",
    };

    setSuggestions([suggestion, ...suggestions]);
    setNewSuggestion("");
    Alert.alert("Success", "Suggestion submitted successfully!");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return {
          bg: Colors.status.errorBg,
          text: Colors.status.errorText,
          border: Colors.status.error,
        };
      case "Medium":
        return {
          bg: Colors.status.warningBg,
          text: Colors.status.warningText,
          border: Colors.status.warning,
        };
      default:
        return {
          bg: Colors.status.successBg,
          text: Colors.status.successText,
          border: Colors.status.success,
        };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>Submit New Complaint</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Subject</Text>
          <TextInput
            style={styles.input}
            value={formData.subject}
            onChangeText={(val) => setFormData({ ...formData, subject: val })}
            placeholder="Brief description of the issue"
            placeholderTextColor={Colors.slate[500]}
          />
        </View>

        <View style={styles.rowGroup}>
          <View style={styles.halfGroup}>
            <Select
              label="Category"
              options={[
                { label: "General", value: "General" },
                { label: "Facility", value: "Facility" },
                { label: "Payroll", value: "Payroll" },
                { label: "Safety", value: "Safety" },
                { label: "Management", value: "Management" },
                { label: "Discrimination", value: "Discrimination" },
                { label: "Equipment", value: "Equipment" },
              ]}
              value={formData.category}
              onValueChange={(val) => setFormData({ ...formData, category: val })}
            />
          </View>

          <View style={styles.halfGroup}>
            <Select
              label="Priority"
              options={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
              value={formData.priority}
              onValueChange={(val) =>
                setFormData({
                  ...formData,
                  priority: val as "Low" | "Medium" | "High",
                })
              }
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(val) =>
              setFormData({ ...formData, description: val })
            }
            placeholder="Provide detailed information about the issue..."
            placeholderTextColor={Colors.slate[500]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submitComplaint}>
          <Text style={styles.submitButtonText}>Submit Complaint</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listCard}>
        <Text style={styles.cardTitle}>
          My Complaints ({complaints.length})
        </Text>
        {complaints.length === 0 && (
          <Text style={styles.emptyText}>No complaints submitted yet.</Text>
        )}
        {complaints.map((complaint) => {
          const priority = getPriorityColor(complaint.priority);
          return (
            <View
              key={complaint.id}
              style={[
                styles.complaintItem,
                { borderLeftColor: priority.border }
              ]}
            >
              <View style={styles.complaintHeader}>
                <View style={styles.complaintHeaderLeft}>
                  <View style={styles.titleRow}>
                    <Text style={styles.complaintSubject}>
                      {complaint.subject}
                    </Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor: priority.bg,
                          borderColor: priority.border,
                        },
                      ]}
                    >
                      <View style={[styles.priorityDot, { backgroundColor: priority.border }]} />
                      <Text
                        style={[styles.priorityText, { color: priority.text }]}
                      >
                        {complaint.priority}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.complaintMeta}>
                    {complaint.id} • {complaint.category} • {complaint.date}
                  </Text>
                </View>
                <View style={styles.complaintHeaderRight}>
                  <StatusPill status={complaint.status} />
                </View>
              </View>
              {complaint.description && (
                <View style={styles.complaintDescription}>
                  <Text style={styles.descriptionText}>
                    {complaint.description}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Anonymous Reporting</Text>
        <Text style={styles.infoText}>
          For sensitive issues, you can submit anonymous complaints through the
          HR hotline or suggestion box.
        </Text>
        <View style={styles.infoButtons}>
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoButtonText}>HR Hotline: 01711-XXXXXX</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setSuggestionModalVisible(true)}
          >
            <Text style={styles.infoButtonText}>Suggestion Box (Floor 3)</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={suggestionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSuggestionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Suggestion Box</Text>
              <TouchableOpacity
                onPress={() => setSuggestionModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.slate[400]} />
              </TouchableOpacity>
            </View>

            <View style={styles.suggestionForm}>
              <Text style={styles.inputLabel}>New Suggestion</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newSuggestion}
                onChangeText={setNewSuggestion}
                placeholder="Share your ideas for improvement..."
                placeholderTextColor={Colors.slate[500]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitSuggestion}
              >
                <Text style={styles.submitButtonText}>Submit Suggestion</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Recent Suggestions</Text>
            <ScrollView style={styles.suggestionList}>
              {suggestions.map((item) => (
                <View key={item.id} style={styles.suggestionItem}>
                  <View style={styles.suggestionHeader}>
                    <Text style={styles.suggestionDate}>{item.date}</Text>
                    <StatusPill status={item.status} />
                  </View>
                  <Text style={styles.suggestionText}>{item.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    padding: 20,
  },
  cardTitle: {
    color: Colors.slate[200],
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.slate[400],
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.neutral[900],
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    borderRadius: 14,
    padding: 14,
    color: Colors.slate[200],
    fontSize: 14,
  },
  textArea: {
    height: 100,
  },
  rowGroup: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  halfGroup: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: Colors.brand.light,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.neutral[900],
    fontSize: 15,
    fontWeight: "700",
  },
  listCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    padding: 20,
  },
  emptyText: {
    color: Colors.slate[400],
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  complaintItem: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    borderLeftWidth: 4,
    backgroundColor: Colors.neutral[800] + "33",
    marginBottom: 12,
  },
  complaintHeader: {
    marginBottom: 12,
  },
  complaintHeaderLeft: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  complaintSubject: {
    flex: 1,
    color: Colors.slate[100],
    fontSize: 15,
    fontWeight: "600",
  },
  complaintMeta: {
    color: Colors.slate[400],
    fontSize: 11,
    marginBottom: 4,
  },
  complaintHeaderRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 5,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  complaintDescription: {
    padding: 12,
    backgroundColor: Colors.neutral[800] + "66",
    borderRadius: 10,
  },
  descriptionText: {
    color: Colors.slate[300],
    fontSize: 13,
    lineHeight: 18,
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    padding: 20,
  },
  infoTitle: {
    color: Colors.slate[200],
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    color: Colors.slate[400],
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  infoButtons: {
    gap: 8,
  },
  infoButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    alignItems: "center",
  },
  infoButtonText: {
    color: Colors.slate[200],
    fontSize: 13,
    fontWeight: "500",
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
    padding: 24,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    color: Colors.slate[100],
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  suggestionForm: {
    marginBottom: 24,
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[800],
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.slate[200],
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  suggestionList: {
    flex: 1,
  },
  suggestionItem: {
    backgroundColor: Colors.neutral[800],
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  suggestionDate: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  suggestionText: {
    color: Colors.slate[200],
    fontSize: 14,
    lineHeight: 20,
  },
});
