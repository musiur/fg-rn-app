import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera, LogOut } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "../../components/Avatar";
import { Colors } from "../../constants/Colors";
import { EMPLOYEES } from "../../constants/Data";
import { Employee } from "../../types";

export default function ProfileScreen() {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee>(EMPLOYEES[0]);

  useEffect(() => {
    AsyncStorage.getItem("employeeId").then((id) => {
      const emp = EMPLOYEES.find((e) => e.id === id);
      if (emp) {
        setEmployee(emp);
      }
    });
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("employeeId");
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEmployee({ ...employee, avatar: result.assets[0].uri });
      Alert.alert("Success", "Profile picture updated!");
    }
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
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View>
              <Avatar
                name={employee.name}
                image={employee.avatar}
                color={Colors.brand.light}
                size={70}
              />
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={pickImage}
              >
                <Camera size={14} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{employee.name}</Text>
              <Text style={styles.profileDesignation}>
                {employee.designation}
              </Text>
              <Text style={styles.profileDepartment}>
                {employee.department}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee ID</Text>
              <Text style={styles.infoValue}>{employee.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Join Date</Text>
              <Text style={styles.infoValue}>
                {new Date(employee.joinDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Shift</Text>
              <Text style={styles.infoValue}>{employee.shift}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Biometrics</Text>
              <View
                style={[
                  styles.biometricBadge,
                  employee.biometricsEnabled
                    ? styles.biometricEnabled
                    : styles.biometricDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.biometricText,
                    employee.biometricsEnabled
                      ? styles.biometricTextEnabled
                      : styles.biometricTextDisabled,
                  ]}
                >
                  {employee.biometricsEnabled ? "Enabled" : "Disabled"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.readOnlyCard}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{employee.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Emergency Contact</Text>
              <Text style={styles.infoValue}>{employee.emergency}</Text>
            </View>
          </View>
        </View>

        {employee.medical && (
          <View style={styles.readOnlyCard}>
            <Text style={styles.cardTitle}>Medical Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Blood Group</Text>
                <Text style={styles.infoValue}>
                  {employee.medical.bloodGroup}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Allergies</Text>
                <Text style={styles.infoValue}>
                  {employee.medical.allergies.join(", ")}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Insurance ID</Text>
                <Text style={styles.infoValue}>
                  {employee.medical.insuranceId}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Checkup</Text>
                <Text style={styles.infoValue}>
                  {new Date(employee.medical.lastCheckup).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.status.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: Colors.slate[100],
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileDesignation: {
    color: Colors.slate[400],
    fontSize: 14,
    marginBottom: 2,
  },
  profileDepartment: {
    color: Colors.slate[500],
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[800],
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    color: Colors.slate[400],
    fontSize: 14,
    fontWeight: "500",
  },
  infoValue: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
  },
  biometricBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  biometricEnabled: {
    backgroundColor: Colors.status.successBg,
  },
  biometricDisabled: {
    backgroundColor: Colors.status.errorBg,
  },
  biometricText: {
    fontSize: 12,
    fontWeight: "600",
  },
  biometricTextEnabled: {
    color: Colors.status.successText,
  },
  biometricTextDisabled: {
    color: Colors.status.errorText,
  },
  readOnlyCard: {
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
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.status.error,
    backgroundColor: Colors.status.error + "1A",
  },
  logoutText: {
    color: Colors.status.error,
    fontSize: 15,
    fontWeight: "700",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: Colors.brand.light,
    padding: 6,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.neutral[900],
  },
});
