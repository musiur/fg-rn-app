import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusPill } from "../components/StatusPill";
import { Colors } from "../constants/Colors";
import { EMPLOYEES } from "../constants/Data";
import { Employee, LeaveRequest } from "../types";

export default function LeaveScreen() {
  const [tab, setTab] = useState<"leave" | "payroll">("leave");
  const [employee, setEmployee] = useState<Employee>(EMPLOYEES[0]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [formData, setFormData] = useState({
    type: "",
    from: "",
    to: "",
  });

  useEffect(() => {
    AsyncStorage.getItem("employeeId").then((id) => {
      const emp = EMPLOYEES.find((e) => e.id === id);
      if (emp) setEmployee(emp);
    });
  }, []);

  const submitLeave = () => {
    if (!formData.type || !formData.from || !formData.to) {
      Alert.alert("Required", "Please complete all fields");
      return;
    }

    const newRequest: LeaveRequest = {
      id: `LV-${Math.floor(Math.random() * 900 + 100)}`,
      type: formData.type,
      from: formData.from,
      to: formData.to,
      status: "pending",
    };

    setRequests([newRequest, ...requests]);
    setFormData({ type: "", from: "", to: "" });
    Alert.alert("Success", "Leave request submitted successfully!");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.balanceCard}>
          <Text style={styles.cardTitle}>Leave Balance</Text>
          <View style={styles.balanceGrid}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>ANNUAL</Text>
              <Text style={styles.balanceValue}>
                {employee.leaveBalance.annual}
              </Text>
              <Text style={styles.balanceDays}>days</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>SICK</Text>
              <Text style={styles.balanceValue}>
                {employee.leaveBalance.sick}
              </Text>
              <Text style={styles.balanceDays}>days</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>CASUAL</Text>
              <Text style={styles.balanceValue}>
                {employee.leaveBalance.casual}
              </Text>
              <Text style={styles.balanceDays}>days</Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Apply for Leave</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Leave Type</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => {
                  const types = [
                    "Annual",
                    "Sick",
                    "Casual",
                    "Maternity",
                    "Emergency",
                  ];
                  Alert.alert(
                    "Select Leave Type",
                    "",
                    types.map((t) => ({
                      text: t,
                      onPress: () => setFormData({ ...formData, type: t }),
                    }))
                  );
                }}
              >
                <Text
                  style={
                    formData.type ? styles.pickerText : styles.pickerPlaceholder
                  }
                >
                  {formData.type || "Select leave type"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dateGrid}>
            <View style={styles.dateGroup}>
              <Text style={styles.inputLabel}>From Date</Text>
              <TextInput
                style={styles.input}
                value={formData.from}
                onChangeText={(val) => setFormData({ ...formData, from: val })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.slate[500]}
              />
            </View>
            <View style={styles.dateGroup}>
              <Text style={styles.inputLabel}>To Date</Text>
              <TextInput
                style={styles.input}
                value={formData.to}
                onChangeText={(val) => setFormData({ ...formData, to: val })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.slate[500]}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={submitLeave}>
            <Text style={styles.submitButtonText}>Submit Leave Request</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>Leave History</Text>
          {requests.length === 0 && (
            <Text style={styles.emptyText}>No leave requests yet.</Text>
          )}
          {requests.map((req) => (
            <View key={req.id} style={styles.historyItem}>
              <View style={styles.historyItemLeft}>
                <Text style={styles.historyId}>
                  {req.id} — {req.type}
                </Text>
                <Text style={styles.historyDates}>
                  {req.from} → {req.to}
                </Text>
              </View>
              <StatusPill status={req.status} />
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  balanceCard: {
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
    marginBottom: 16,
  },
  balanceGrid: {
    flexDirection: "row",
    gap: 12,
  },
  balanceItem: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    padding: 16,
    alignItems: "center",
  },
  balanceLabel: {
    color: Colors.slate[400],
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "700",
    marginBottom: 8,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  balanceDays: {
    color: Colors.slate[500],
    fontSize: 12,
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    padding: 20,
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
  pickerContainer: {
    borderRadius: 14,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: Colors.neutral[900],
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    borderRadius: 14,
    padding: 14,
  },
  pickerText: {
    color: Colors.slate[200],
    fontSize: 14,
  },
  pickerPlaceholder: {
    color: Colors.slate[500],
    fontSize: 14,
  },
  dateGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateGroup: {
    flex: 1,
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
  historyCard: {
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
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  historyItemLeft: {
    flex: 1,
  },
  historyId: {
    color: Colors.slate[100],
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  historyDates: {
    color: Colors.slate[400],
    fontSize: 12,
  },
});
