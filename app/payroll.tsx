import { Download } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../constants/Colors";
import { downloadFile, generatePayslip } from "../utils/downloadHelper";

export default function PayrollScreen() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (month: string) => {
    setDownloading(month);
    const filename = `Payslip_${month.replace(" ", "_")}.txt`;
    const content = generatePayslip(month, "৳ 47,800");
    await downloadFile(filename, content, "text/plain");
    setDownloading(null);
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
        <View style={styles.salaryCard}>
          <Text style={styles.cardTitle}>Monthly Salary Breakdown</Text>
          <View style={styles.salaryGrid}>
            {[
              ["Basic Salary", "৳ 30,000"],
              ["House Rent", "৳ 15,000"],
              ["Medical Allowance", "৳ 2,000"],
              ["Conveyance", "৳ 2,000"],
              ["Total Gross", "৳ 49,000"],
              ["Tax Deduction", "৳ 1,200"],
              ["Net Salary", "৳ 47,800"],
            ].map(([label, amount], i) => (
              <View key={i} style={styles.salaryRow}>
                <Text style={styles.salaryLabel}>{label}</Text>
                <Text
                  style={[
                    styles.salaryAmount,
                    label === "Net Salary" && {
                      color: Colors.brand.light,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.payslipsCard}>
          <Text style={styles.cardTitle}>Payslips</Text>
          {["August 2025", "July 2025", "June 2025", "May 2025"].map(
            (month, i) => (
              <View key={i} style={styles.payslipItem}>
                <View style={styles.payslipInfo}>
                  <Text style={styles.payslipMonth}>{month}</Text>
                  <Text style={styles.payslipAmount}>Net: ৳ 47,800</Text>
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownload(month)}
                  disabled={downloading === month}
                >
                  {downloading === month ? (
                    <ActivityIndicator size="small" color={Colors.brand.light} />
                  ) : (
                    <>
                      <Download size={16} color={Colors.brand.light} />
                      <Text style={styles.downloadText}>Download</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )
          )}
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
  cardTitle: {
    color: Colors.slate[200],
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  salaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    padding: 20,
  },
  salaryGrid: {
    gap: 4,
  },
  salaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  salaryLabel: {
    color: Colors.slate[400],
    fontSize: 14,
    fontWeight: "500",
  },
  salaryAmount: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
  },
  payslipsCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    padding: 20,
  },
  payslipItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    marginBottom: 12,
  },
  payslipInfo: {
    flex: 1,
  },
  payslipMonth: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  payslipAmount: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.brand.light,
  },
  downloadText: {
    color: Colors.brand.light,
    fontSize: 12,
    fontWeight: "600",
  },
});
