import { Calendar, ChevronLeft, ChevronRight, Clock, Edit, FileText, Fingerprint, LogOut, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { DatePicker } from "../../components/DatePicker";
import { StatusPill } from "../../components/StatusPill";
import { TimePicker } from "../../components/TimePicker";
import { Colors } from "../../constants/Colors";
import { ATTENDANCE_HISTORY, MOVEMENT_REGISTERS, QS_ATTENDANCE_REQUESTS } from "../../constants/Data";
import { AttendanceRecord, MovementRegister, QSAttendanceRequest } from "../../types";

export default function AttendanceScreen() {
  const [step, setStep] = useState<"zone" | "biometric" | "success">("zone");
  const [geofenceOk, setGeofenceOk] = useState(true);
  const [clocked, setClocked] = useState(false);
  const [history, setHistory] = useState<AttendanceRecord[]>(ATTENDANCE_HISTORY);
  const [qsRequests, setQsRequests] = useState<QSAttendanceRequest[]>(QS_ATTENDANCE_REQUESTS);
  const [movementRegisters, setMovementRegisters] = useState<MovementRegister[]>(MOVEMENT_REGISTERS);
  
  // Current user info (would come from AsyncStorage in real app)
  const [currentUser] = useState({
    id: "FFL-1001",
    name: "Fuad Tasrim Hossain",
    department: "Merchandising"
  });

  // Calendar state
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // QS Request state
  const [showQSModal, setShowQSModal] = useState(false);
  const [showQSListModal, setShowQSListModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [qsClockIn, setQsClockIn] = useState("");
  const [qsClockOut, setQsClockOut] = useState("");
  const [qsReason, setQsReason] = useState("");

  // Edit attendance state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editClockIn, setEditClockIn] = useState("");
  const [editClockOut, setEditClockOut] = useState("");
  
  // Movement Register state
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showMovementListModal, setShowMovementListModal] = useState(false);
  const [requestsTab, setRequestsTab] = useState<"qs" | "movement">("qs");
  const [movementDate, setMovementDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");

  const proceedToBiometric = () => {
    if (!geofenceOk) {
      Alert.alert(
        "Location Required",
        "You need to be inside the Fakir Zone to clock in/out!"
      );
      return;
    }
    setStep("biometric");
  };

  const completeBiometric = () => {
    setStep("success");
    setClocked(!clocked);

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const today = new Date().toISOString().split("T")[0];

    setHistory((prev) => {
      const idx = prev.findIndex((x) => x.date === today);
      if (idx > -1) {
        const copy = [...prev];
        if (copy[idx].clockIn && copy[idx].clockIn !== "-") {
          copy[idx].clockOut = `${hh}:${mm}`;
        } else {
          copy[idx].clockIn = `${hh}:${mm}`;
        }
        copy[idx].status = "Present";
        return copy;
      }
      return [
        {
          date: today,
          status: "Present",
          clockIn: `${hh}:${mm}`,
          clockOut: "-",
          late: false,
        },
        ...prev,
      ];
    });

    setTimeout(() => setStep("zone"), 2000);
  };

  const handleSubmitQSRequest = () => {
    if (!selectedDate || !qsClockIn || !qsClockOut || !qsReason.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newRequest: QSAttendanceRequest = {
      id: `QSA-${Math.floor(Math.random() * 10000)}`,
      date: selectedDate,
      requestedClockIn: qsClockIn,
      requestedClockOut: qsClockOut,
      reason: qsReason,
      status: "pending",
      submittedOn: new Date().toISOString().split("T")[0],
    };

    setQsRequests([newRequest, ...qsRequests]);
    setShowQSModal(false);
    setSelectedDate("");
    setQsClockIn("");
    setQsClockOut("");
    setQsReason("");

    Alert.alert(
      "Request Submitted",
      "Your QS Attendance request has been submitted for approval."
    );
  };

  const handleEditAttendance = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setEditClockIn(record.clockIn);
    setEditClockOut(record.clockOut);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingRecord || !editClockIn || !editClockOut) {
      Alert.alert("Error", "Please fill in both clock in and clock out times");
      return;
    }

    setHistory((prev) =>
      prev.map((record) =>
        record.date === editingRecord.date
          ? { ...record, clockIn: editClockIn, clockOut: editClockOut }
          : record
      )
    );

    setShowEditModal(false);
    setEditingRecord(null);
    setEditClockIn("");
    setEditClockOut("");

    Alert.alert("Success", "Attendance times updated successfully");
  };
  
  const handleSubmitMovementRegister = () => {
    if (!movementDate || !departureTime || !returnTime || !destination.trim() || !purpose.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newMovement: MovementRegister = {
      id: `MR-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeDepartment: currentUser.department,
      date: movementDate,
      departureTime: departureTime,
      expectedReturnTime: returnTime,
      destination: destination,
      purpose: purpose,
      status: "pending",
      submittedOn: new Date().toISOString().split('T')[0],
      divisionHead: "Division Head",
    };

    setMovementRegisters([newMovement, ...movementRegisters]);
    setShowMovementModal(false);
    setMovementDate("");
    setDepartureTime("");
    setReturnTime("");
    setDestination("");
    setPurpose("");

    Alert.alert(
      "Movement Request Submitted",
      "Your movement register request has been submitted to your Division Head for approval. You will receive a notification once it's reviewed."
    );
  };

  const getMonthData = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getAttendanceForDate = (day: number) => {
    const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return history.find((record) => record.date === dateStr);
  };

  const changeMonth = (direction: number) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {step === "zone" && (
        <View style={styles.card}>
          <View
            style={[
              styles.zoneIcon,
              geofenceOk ? styles.zoneIconSuccess : styles.zoneIconError,
            ]}
          >
            <MapPin
              size={40}
              color={geofenceOk ? Colors.status.success : Colors.status.error}
            />
          </View>

          <Text
            style={[
              styles.zoneTitle,
              geofenceOk ? styles.zoneTitleSuccess : styles.zoneTitleError,
            ]}
          >
            {geofenceOk ? "You're in Fakir Zone!" : "Outside Fakir Zone"}
          </Text>

          <Text style={styles.zoneDescription}>
            {geofenceOk
              ? "Great! You're within the factory premises and can clock in/out."
              : "You need to be inside the factory premises to clock in/out."}
          </Text>

          {!geofenceOk && (
            <View style={styles.demoControls}>
              <Text style={styles.demoLabel}>
                Demo Mode - Toggle Zone Status:
              </Text>
              <TouchableOpacity
                style={styles.demoButton}
                onPress={() => setGeofenceOk(true)}
              >
                <Text style={styles.demoButtonText}>Simulate Inside Zone</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.clockButton,
              !geofenceOk && styles.clockButtonDisabled,
            ]}
            onPress={proceedToBiometric}
            disabled={!geofenceOk}
          >
            <Text style={styles.clockButtonText}>
              {clocked ? "Clock Out" : "Clock In"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "biometric" && (
        <View style={styles.card}>
          <View style={styles.biometricIcon}>
            <Fingerprint size={50} color={Colors.status.info} />
          </View>

          <Text style={styles.biometricTitle}>Biometric Required</Text>
          <Text style={styles.biometricDescription}>
            Place your finger on the sensor to{" "}
            {clocked ? "clock out" : "clock in"}
          </Text>

          <TouchableOpacity
            style={styles.biometricButton}
            onPress={completeBiometric}
          >
            <Fingerprint size={60} color={Colors.status.info} />
            <Text style={styles.biometricButtonText}>Touch Sensor</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "success" && (
        <View style={styles.card}>
          <View style={styles.successIcon}>
            <Text style={styles.successCheckmark}>✓</Text>
          </View>

          <Text style={styles.successTitle}>Success!</Text>
          <Text style={styles.successDescription}>
            You have successfully {clocked ? "clocked out" : "clocked in"}
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowCalendar(true)}
        >
          <Calendar size={18} color={Colors.brand.light} />
          <Text style={styles.actionButtonText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowQSModal(true)}
        >
          <Edit size={18} color={Colors.brand.light} />
          <Text style={styles.actionButtonText}>QS Request</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowMovementModal(true)}
        >
          <LogOut size={18} color={Colors.brand.light} />
          <Text style={styles.actionButtonText}>Movement</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowMovementListModal(true)}
        >
          <FileText size={18} color={Colors.brand.light} />
          <Text style={styles.actionButtonText}>Requests</Text>
        </TouchableOpacity>
      </View>

      {/* Attendance History */}
      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>Recent Attendance</Text>
        <View style={styles.historyList}>
          {history.slice(0, 10).map((record, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyItemLeft}>
                <Text style={styles.historyDate}>{record.date}</Text>
                <View style={styles.timeRow}>
                  <View style={styles.timeItem}>
                    <Clock size={12} color={Colors.slate[400]} />
                    <Text style={styles.historyTime}>In: {record.clockIn}</Text>
                  </View>
                  <View style={styles.timeItem}>
                    <Clock size={12} color={Colors.slate[400]} />
                    <Text style={styles.historyTime}>Out: {record.clockOut}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.historyItemRight}>
                <StatusPill status={record.status.toLowerCase()} />
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditAttendance(record)}
                >
                  <Edit size={16} color={Colors.brand.light} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Calendar Modal */}
      <Modal visible={showCalendar} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <ChevronLeft size={24} color={Colors.slate[200]} />
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>
                {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </Text>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <ChevronRight size={24} color={Colors.slate[200]} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarGrid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.dayHeader}>
                  {day}
                </Text>
              ))}
              {getMonthData().map((day, index) => {
                const attendance = day ? getAttendanceForDate(day) : null;
                return (
                  <View key={index} style={styles.dayCell}>
                    {day && (
                      <>
                        <Text style={styles.dayNumber}>{day}</Text>
                        {attendance && (
                          <View
                            style={[
                              styles.dayStatus,
                              attendance.status === "Present" && styles.dayStatusPresent,
                              attendance.status === "Absent" && styles.dayStatusAbsent,
                              attendance.status === "Late" && styles.dayStatusLate,
                            ]}
                          />
                        )}
                      </>
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QS Request Modal */}
      <Modal visible={showQSModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.qsModal}>
            <Text style={styles.qsModalTitle}>QS Attendance Request</Text>
            <Text style={styles.qsModalSubtitle}>
              Submit a request to correct your attendance record
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.slate[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Clock In Time</Text>
              <TimePicker
                value={qsClockIn}
                onChange={setQsClockIn}
                label="Select Clock In Time"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Clock Out Time</Text>
              <TimePicker
                value={qsClockOut}
                onChange={setQsClockOut}
                label="Select Clock Out Time"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reason</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={qsReason}
                onChangeText={setQsReason}
                placeholder="Explain why you need this correction..."
                placeholderTextColor={Colors.slate[500]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitQSRequest}
              >
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowQSModal(false);
                  setSelectedDate("");
                  setQsClockIn("");
                  setQsClockOut("");
                  setQsReason("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* QS Requests List Modal */}
      <Modal visible={showQSListModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.qsListModal}>
            <Text style={styles.qsModalTitle}>My QS Requests</Text>
            <ScrollView style={styles.qsRequestsList}>
              {qsRequests.length === 0 ? (
                <Text style={styles.emptyText}>No requests submitted yet</Text>
              ) : (
                qsRequests.map((request) => (
                  <View key={request.id} style={styles.qsRequestCard}>
                    <View style={styles.qsRequestHeader}>
                      <Text style={styles.qsRequestId}>{request.id}</Text>
                      <View
                        style={[
                          styles.qsStatusBadge,
                          request.status === "approved" && styles.qsStatusApproved,
                          request.status === "pending" && styles.qsStatusPending,
                          request.status === "rejected" && styles.qsStatusRejected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.qsStatusText,
                            request.status === "approved" && styles.qsStatusTextApproved,
                            request.status === "pending" && styles.qsStatusTextPending,
                            request.status === "rejected" && styles.qsStatusTextRejected,
                          ]}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.qsRequestDate}>Date: {request.date}</Text>
                    <Text style={styles.qsRequestTime}>
                      In: {request.requestedClockIn} • Out: {request.requestedClockOut}
                    </Text>
                    <Text style={styles.qsRequestReason}>{request.reason}</Text>
                    <Text style={styles.qsRequestMeta}>
                      Submitted: {request.submittedOn}
                    </Text>
                    {request.approvedBy && (
                      <Text style={styles.qsRequestMeta}>
                        Approved by: {request.approvedBy} on {request.approvedOn}
                      </Text>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQSListModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Attendance Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.qsModal}>
            <Text style={styles.qsModalTitle}>Edit Attendance Times</Text>
            <Text style={styles.qsModalSubtitle}>
              Update clock in/out times for {editingRecord?.date}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Clock In Time</Text>
              <TimePicker
                value={editClockIn}
                onChange={setEditClockIn}
                label="Select Clock In Time"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Clock Out Time</Text>
              <TimePicker
                value={editClockOut}
                onChange={setEditClockOut}
                label="Select Clock Out Time"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.submitButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowEditModal(false);
                  setEditingRecord(null);
                  setEditClockIn("");
                  setEditClockOut("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Movement Register Modal */}
      <Modal visible={showMovementModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.qsModal}>
            <Text style={styles.qsModalTitle}>Movement Register</Text>
            <Text style={styles.qsModalSubtitle}>
              Request permission to leave the factory premises
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date *</Text>
              <DatePicker
                value={movementDate}
                onValueChange={setMovementDate}
                placeholder="Select movement date"
                minDate={new Date()}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Departure Time *</Text>
              <TimePicker
                value={departureTime}
                onChange={setDepartureTime}
                label="Select departure time"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Expected Return Time *</Text>
              <TimePicker
                value={returnTime}
                onChange={setReturnTime}
                label="Select return time"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Destination *</Text>
              <TextInput
                style={styles.input}
                value={destination}
                onChangeText={setDestination}
                placeholder="e.g., Buyer Office - Gulshan, Bank - Motijheel"
                placeholderTextColor={Colors.slate[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Purpose *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={purpose}
                onChangeText={setPurpose}
                placeholder="Explain the reason for leaving factory premises..."
                placeholderTextColor={Colors.slate[500]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitMovementRegister}
              >
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowMovementModal(false);
                  setMovementDate("");
                  setDepartureTime("");
                  setReturnTime("");
                  setDestination("");
                  setPurpose("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* All Requests Modal (QS + Movement) */}
      <Modal visible={showMovementListModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.qsListModal}>
            <Text style={styles.qsModalTitle}>My Requests</Text>
            
            {/* Tabs */}
            <View style={styles.requestTabs}>
              <TouchableOpacity
                style={[
                  styles.requestTab,
                  requestsTab === "qs" && styles.requestTabActive,
                ]}
                onPress={() => setRequestsTab("qs")}
              >
                <Text
                  style={[
                    styles.requestTabText,
                    requestsTab === "qs" && styles.requestTabTextActive,
                  ]}
                >
                  QS Attendance
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.requestTab,
                  requestsTab === "movement" && styles.requestTabActive,
                ]}
                onPress={() => setRequestsTab("movement")}
              >
                <Text
                  style={[
                    styles.requestTabText,
                    requestsTab === "movement" && styles.requestTabTextActive,
                  ]}
                >
                  Movement Register
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.qsRequestsList}>
              {requestsTab === "qs" ? (
                // QS Requests Tab
                qsRequests.length === 0 ? (
                  <Text style={styles.emptyText}>No QS requests submitted yet</Text>
                ) : (
                  qsRequests.map((request) => (
                    <View key={request.id} style={styles.qsRequestCard}>
                      <View style={styles.qsRequestHeader}>
                        <Text style={styles.qsRequestId}>{request.id}</Text>
                        <View
                          style={[
                            styles.qsStatusBadge,
                            request.status === "approved" && styles.qsStatusApproved,
                            request.status === "pending" && styles.qsStatusPending,
                            request.status === "rejected" && styles.qsStatusRejected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.qsStatusText,
                              request.status === "approved" && styles.qsStatusTextApproved,
                              request.status === "pending" && styles.qsStatusTextPending,
                              request.status === "rejected" && styles.qsStatusTextRejected,
                            ]}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.qsRequestDate}>Date: {request.date}</Text>
                      <Text style={styles.qsRequestTime}>
                        In: {request.requestedClockIn} • Out: {request.requestedClockOut}
                      </Text>
                      <Text style={styles.qsRequestReason}>{request.reason}</Text>
                      <Text style={styles.qsRequestMeta}>
                        Submitted: {request.submittedOn}
                      </Text>
                      {request.approvedBy && (
                        <Text style={styles.qsRequestMeta}>
                          Approved by: {request.approvedBy} on {request.approvedOn}
                        </Text>
                      )}
                    </View>
                  ))
                )
              ) : (
                // Movement Requests Tab
                movementRegisters.filter(mr => mr.employeeId === currentUser.id).length === 0 ? (
                  <Text style={styles.emptyText}>No movement requests submitted yet</Text>
                ) : (
                  movementRegisters
                    .filter(mr => mr.employeeId === currentUser.id)
                    .map((movement) => (
                      <View key={movement.id} style={styles.movementCard}>
                        <View style={styles.qsRequestHeader}>
                          <Text style={styles.qsRequestId}>{movement.id}</Text>
                          <View
                            style={[
                              styles.qsStatusBadge,
                              movement.status === "approved" && styles.qsStatusApproved,
                              movement.status === "pending" && styles.qsStatusPending,
                              movement.status === "rejected" && styles.qsStatusRejected,
                              movement.status === "completed" && styles.qsStatusCompleted,
                            ]}
                          >
                            <Text
                              style={[
                                styles.qsStatusText,
                                movement.status === "approved" && styles.qsStatusTextApproved,
                                movement.status === "pending" && styles.qsStatusTextPending,
                                movement.status === "rejected" && styles.qsStatusTextRejected,
                                movement.status === "completed" && styles.qsStatusTextCompleted,
                              ]}
                            >
                              {movement.status.charAt(0).toUpperCase() + movement.status.slice(1)}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.movementInfoRow}>
                          <Text style={styles.movementLabel}>Date:</Text>
                          <Text style={styles.movementValue}>{movement.date}</Text>
                        </View>
                        
                        <View style={styles.movementInfoRow}>
                          <Text style={styles.movementLabel}>Time:</Text>
                          <Text style={styles.movementValue}>
                            {movement.departureTime} - {movement.expectedReturnTime}
                          </Text>
                        </View>
                        
                        {movement.actualReturnTime && (
                          <View style={styles.movementInfoRow}>
                            <Text style={styles.movementLabel}>Returned:</Text>
                            <Text style={styles.movementValue}>{movement.actualReturnTime}</Text>
                          </View>
                        )}
                        
                        <View style={styles.movementInfoRow}>
                          <Text style={styles.movementLabel}>Destination:</Text>
                          <Text style={styles.movementValue}>{movement.destination}</Text>
                        </View>
                        
                        <Text style={styles.qsRequestReason}>{movement.purpose}</Text>
                        
                        <Text style={styles.qsRequestMeta}>
                          Submitted: {movement.submittedOn}
                        </Text>
                        {movement.approvedBy && (
                          <Text style={styles.qsRequestMeta}>
                            Approved by: {movement.approvedBy} on {movement.approvedOn}
                          </Text>
                        )}
                      </View>
                    ))
                )
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMovementListModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    padding: 24,
    alignItems: "center",
  },
  zoneIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  zoneIconSuccess: {
    backgroundColor: Colors.status.success + "33",
    borderColor: Colors.status.success,
  },
  zoneIconError: {
    backgroundColor: Colors.status.error + "33",
    borderColor: Colors.status.error,
  },
  zoneTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  zoneTitleSuccess: {
    color: Colors.status.success,
  },
  zoneTitleError: {
    color: Colors.status.error,
  },
  zoneDescription: {
    color: Colors.slate[300],
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  demoControls: {
    width: "100%",
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.neutral[800] + "66",
    borderRadius: 12,
  },
  demoLabel: {
    color: Colors.slate[400],
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
  },
  demoButton: {
    backgroundColor: Colors.status.success,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  demoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  clockButton: {
    width: "100%",
    backgroundColor: Colors.brand.light,
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  clockButtonDisabled: {
    backgroundColor: Colors.neutral[700],
    opacity: 0.5,
  },
  clockButtonText: {
    color: Colors.neutral[900],
    fontSize: 16,
    fontWeight: "700",
  },
  biometricIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.status.info + "33",
    borderWidth: 2,
    borderColor: Colors.status.info,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  biometricTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.status.info,
    marginBottom: 12,
  },
  biometricDescription: {
    color: Colors.slate[300],
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  biometricButton: {
    width: "100%",
    padding: 50,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.status.info,
    backgroundColor: Colors.status.info + "1A",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  biometricButtonText: {
    color: Colors.status.info,
    fontSize: 16,
    fontWeight: "600",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.status.success + "33",
    borderWidth: 2,
    borderColor: Colors.status.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successCheckmark: {
    fontSize: 40,
    color: Colors.status.success,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.status.success,
    marginBottom: 12,
  },
  successDescription: {
    color: Colors.slate[300],
    fontSize: 14,
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    minHeight: 80,
  },
  actionButtonText: {
    color: Colors.slate[200],
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 12,
  },
  historyCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    overflow: "hidden",
  },
  historyTitle: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  historyList: {
    padding: 4,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  historyItemLeft: {
    flex: 1,
  },
  historyDate: {
    color: Colors.slate[100],
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    gap: 16,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  historyTime: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  historyItemRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  editButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: Colors.brand.light + "1A",
    borderWidth: 1,
    borderColor: Colors.brand.light + "33",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calendarModal: {
    backgroundColor: Colors.neutral[900],
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarTitle: {
    color: Colors.slate[100],
    fontSize: 18,
    fontWeight: "700",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  dayHeader: {
    width: "13.28%",
    textAlign: "center",
    color: Colors.slate[400],
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  dayCell: {
    width: "13.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dayNumber: {
    color: Colors.slate[200],
    fontSize: 14,
  },
  dayStatus: {
    position: "absolute",
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dayStatusPresent: {
    backgroundColor: Colors.status.success,
  },
  dayStatusAbsent: {
    backgroundColor: Colors.status.error,
  },
  dayStatusLate: {
    backgroundColor: Colors.status.warning,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.neutral[800],
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
  },
  qsModal: {
    backgroundColor: Colors.neutral[900],
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  qsModalTitle: {
    color: Colors.slate[100],
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  qsModalSubtitle: {
    color: Colors.slate[400],
    fontSize: 14,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.slate[300],
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.neutral[800],
    borderRadius: 12,
    padding: 12,
    color: Colors.slate[200],
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  textArea: {
    minHeight: 100,
  },
  modalButtons: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: Colors.brand.light,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.neutral[900],
    fontSize: 14,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: Colors.neutral[800],
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
  },
  qsListModal: {
    backgroundColor: Colors.neutral[900],
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  qsRequestsList: {
    marginTop: 16,
  },
  emptyText: {
    color: Colors.slate[400],
    fontSize: 14,
    textAlign: "center",
    padding: 40,
  },
  qsRequestCard: {
    backgroundColor: Colors.neutral[800],
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  qsRequestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  qsRequestId: {
    color: Colors.slate[300],
    fontSize: 12,
    fontWeight: "600",
  },
  qsStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  qsStatusPending: {
    backgroundColor: Colors.status.warning + "1A",
    borderColor: Colors.status.warning + "33",
  },
  qsStatusApproved: {
    backgroundColor: Colors.status.success + "1A",
    borderColor: Colors.status.success + "33",
  },
  qsStatusRejected: {
    backgroundColor: Colors.status.error + "1A",
    borderColor: Colors.status.error + "33",
  },
  qsStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  qsStatusTextPending: {
    color: Colors.status.warning,
  },
  qsStatusTextApproved: {
    color: Colors.status.success,
  },
  qsStatusTextRejected: {
    color: Colors.status.error,
  },
  qsRequestDate: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  qsRequestTime: {
    color: Colors.slate[300],
    fontSize: 13,
    marginBottom: 8,
  },
  qsRequestReason: {
    color: Colors.slate[400],
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  qsRequestMeta: {
    color: Colors.slate[500],
    fontSize: 11,
    marginTop: 4,
  },
  movementCard: {
    backgroundColor: Colors.neutral[800],
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    borderLeftWidth: 4,
    borderLeftColor: Colors.brand.light,
  },
  movementInfoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  movementLabel: {
    color: Colors.slate[400],
    fontSize: 12,
    fontWeight: "600",
    width: 90,
  },
  movementValue: {
    color: Colors.slate[200],
    fontSize: 12,
    flex: 1,
  },
  qsStatusCompleted: {
    backgroundColor: Colors.status.info + "1A",
    borderColor: Colors.status.info + "33",
  },
  qsStatusTextCompleted: {
    color: Colors.status.info,
  },
  requestTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    marginBottom: 16,
  },
  requestTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  requestTabActive: {
    borderBottomColor: Colors.brand.light,
  },
  requestTabText: {
    color: Colors.slate[400],
    fontSize: 14,
    fontWeight: "600",
  },
  requestTabTextActive: {
    color: Colors.brand.light,
  },
});
