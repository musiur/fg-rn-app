import AsyncStorage from "@react-native-async-storage/async-storage";
import { Building2, Calendar, FileText, Fingerprint, Pen, Plus, Search, Upload, User, Users, X } from "lucide-react-native";
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
import { Avatar } from "../../components/Avatar";
import { DatePicker } from "../../components/DatePicker";
import { StatusPill } from "../../components/StatusPill";
import { Colors } from "../../constants/Colors";
import { EMPLOYEES, ESIGN_DOCS } from "../../constants/Data";
import { ESignDocument, Employee } from "../../types";

export default function ESignScreen() {
  const [view, setView] = useState<"inbox" | "sent" | "completed" | "history" | "all">(
    "inbox"
  );
  const [docs, setDocs] = useState<ESignDocument[]>(ESIGN_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<ESignDocument | null>(null);
  const [showBiometric, setShowBiometric] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [employee, setEmployee] = useState<Employee>(EMPLOYEES[0]);

  // Search state
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Create new document state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocDept, setNewDocDept] = useState("");
  const [newDocDeadline, setNewDocDeadline] = useState("");
  const [newDocRoute, setNewDocRoute] = useState<"Sequential" | "Parallel">("Sequential");
  const [newDocPriority, setNewDocPriority] = useState<"Normal" | "High" | "Critical">("Normal");
  const [selectedSigners, setSelectedSigners] = useState<Employee[]>([]);
  const [showSignerPicker, setShowSignerPicker] = useState(false);
  const [hasUploadedDoc, setHasUploadedDoc] = useState(false);

  // Signature method state
  const [showSignatureMethod, setShowSignatureMethod] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState<"biometric" | "upload" | "draw">("biometric");

  useEffect(() => {
    AsyncStorage.getItem("employeeId").then((id) => {
      const emp = EMPLOYEES.find((e) => e.id === id);
      if (emp) setEmployee(emp);
    });
  }, []);

  const getUrgencyColor = (deadline: string): "red" | "yellow" | "green" => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "red"; // Critical - today or overdue
    if (diffDays <= 3) return "yellow"; // Somewhat critical - within 3 days
    return "green"; // More than 3 days
  };

  const getUrgencyStyle = (color: "red" | "yellow" | "green") => {
    switch (color) {
      case "red":
        return { bg: Colors.status.error + "1A", border: Colors.status.error };
      case "yellow":
        return { bg: Colors.status.warning + "1A", border: Colors.status.warning };
      case "green":
        return { bg: Colors.status.success + "1A", border: Colors.status.success };
    }
  };

  const filtered = docs.filter((d) => {
    // Filter by view
    let viewMatch = true;
    if (view === "inbox")
      viewMatch = d.signers.some(
        (s) => s.id === employee.id && s.status === "pending"
      );
    else if (view === "sent") viewMatch = d.owner === employee.id;
    else if (view === "completed")
      viewMatch = d.signers.every((s) => s.status === "signed");
    else if (view === "history")
      viewMatch = d.signers.some(
        (s) => s.id === employee.id && s.status === "signed"
      );

    if (!viewMatch) return false;

    // Filter by search - enhanced to support date, month, and text-based search
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      const deadlineDate = new Date(d.deadline);
      const createdDate = new Date(d.createdAt);
      const completedDate = d.completedAt ? new Date(d.completedAt) : null;
      
      // Format dates for searching
      const deadlineStr = deadlineDate.toLocaleDateString("en-GB");
      const createdStr = createdDate.toLocaleDateString("en-GB");
      const completedStr = completedDate ? completedDate.toLocaleDateString("en-GB") : "";
      
      // Month names for searching
      const deadlineMonth = deadlineDate.toLocaleDateString("en-GB", { month: "long" }).toLowerCase();
      const createdMonth = createdDate.toLocaleDateString("en-GB", { month: "long" }).toLowerCase();
      const completedMonth = completedDate ? completedDate.toLocaleDateString("en-GB", { month: "long" }).toLowerCase() : "";
      
      // Year for searching
      const deadlineYear = deadlineDate.getFullYear().toString();
      const createdYear = createdDate.getFullYear().toString();
      const completedYear = completedDate ? completedDate.getFullYear().toString() : "";
      
      // Search in signers
      const signerMatch = d.signers.some(s => 
        s.name.toLowerCase().includes(search) ||
        s.designation.toLowerCase().includes(search)
      );
      
      // Search in issuing person
      const issuingPersonMatch = d.issuingPerson?.toLowerCase().includes(search) || false;
      
      return (
        d.title.toLowerCase().includes(search) ||
        d.dept.toLowerCase().includes(search) ||
        d.id.toLowerCase().includes(search) ||
        d.route.toLowerCase().includes(search) ||
        deadlineStr.includes(search) ||
        createdStr.includes(search) ||
        completedStr.includes(search) ||
        deadlineMonth.includes(search) ||
        createdMonth.includes(search) ||
        completedMonth.includes(search) ||
        deadlineYear.includes(search) ||
        createdYear.includes(search) ||
        completedYear.includes(search) ||
        signerMatch ||
        issuingPersonMatch
      );
    }

    return true;
  });

  const canSign = (d: ESignDocument) => {
    if (!d) return { ok: false };

    const idx = d.signers.findIndex((s) => s.id === employee.id);
    if (idx < 0) return { ok: false, reason: "Not a participant" };
    const me = d.signers[idx];
    if (me.status !== "pending")
      return {
        ok: false,
        reason: me.status === "signed" ? "Already signed" : "Not pending",
      };
    if (
      d.route === "Sequential" &&
      !d.signers.slice(0, idx).every((x) => x.status === "signed")
    ) {
      return { ok: false, reason: `Waiting for previous signer` };
    }
    return { ok: true };
  };

  const handleSign = (doc: ESignDocument) => {
    const check = canSign(doc);
    if (!check.ok) {
      Alert.alert("Cannot Sign", check.reason);
      return;
    }
    setSelectedDoc(doc);
    setShowSignatureMethod(true);
  };

  const proceedWithSignature = (method: "biometric" | "upload" | "draw") => {
    setSignatureMethod(method);
    setShowSignatureMethod(false);

    if (method === "biometric") {
      setShowBiometric(true);
    } else if (method === "upload") {
      Alert.alert("Upload Signature", "In a real app, this would open the file picker to upload your signature image.");
      completeSigning();
    } else if (method === "draw") {
      Alert.alert("Draw Signature", "In a real app, this would open a canvas where you can draw your signature with a stylus or finger.");
      completeSigning();
    }
  };

  const completeSigning = () => {
    if (!selectedDoc) return;

    setDocs((prev) =>
      prev.map((d) => {
        if (d.id !== selectedDoc.id) return d;
        const signers = d.signers.map((s) =>
          s.id === employee.id
            ? {
              ...s,
              status: "signed" as const,
              signedAt: new Date().toISOString(),
              signatureMethod: signatureMethod,
            }
            : s
        );
        const completedNow = signers.every((s) => s.status === "signed");
        return {
          ...d,
          signers,
          completedAt: completedNow ? new Date().toISOString() : undefined,
        };
      })
    );

    setShowBiometric(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedDoc(null);
    }, 2000);
  };

  const handleCreateDocument = () => {
    if (!newDocTitle.trim() || !newDocDept.trim() || !newDocDeadline || selectedSigners.length === 0) {
      Alert.alert("Error", "Please fill in all required fields and select at least one signer");
      return;
    }

    const newDoc: ESignDocument = {
      id: `ES-${Math.floor(Math.random() * 10000)}`,
      title: newDocTitle,
      dept: newDocDept,
      issuingPerson: employee.name,
      issuingPersonId: employee.id,
      emergency: newDocPriority,
      deadline: newDocDeadline,
      route: newDocRoute,
      owner: employee.id,
      createdAt: new Date().toISOString(),
      hasDocument: hasUploadedDoc,
      signers: selectedSigners.map((signer, index) => ({
        id: signer.id,
        name: signer.name,
        designation: signer.designation,
        avatar: signer.avatar,
        status: "pending" as const,
        order: index + 1,
      })),
    };

    setDocs([newDoc, ...docs]);
    setShowCreateModal(false);
    setNewDocTitle("");
    setNewDocDept("");
    setNewDocDeadline("");
    setNewDocRoute("Sequential");
    setNewDocPriority("Normal");
    setSelectedSigners([]);
    setHasUploadedDoc(false);

    Alert.alert("Success", "Signing request created successfully");
  };

  const toggleSigner = (signer: Employee) => {
    if (selectedSigners.find(s => s.id === signer.id)) {
      setSelectedSigners(selectedSigners.filter(s => s.id !== signer.id));
    } else {
      setSelectedSigners([...selectedSigners, signer]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              view === "inbox" && styles.filterButtonActive,
            ]}
            onPress={() => setView("inbox")}
          >
            <Text
              style={[
                styles.filterText,
                view === "inbox" && styles.filterTextActive,
              ]}
            >
              To Sign
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              view === "sent" && styles.filterButtonActive,
            ]}
            onPress={() => setView("sent")}
          >
            <Text
              style={[
                styles.filterText,
                view === "sent" && styles.filterTextActive,
              ]}
            >
              Sent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              view === "completed" && styles.filterButtonActive,
            ]}
            onPress={() => setView("completed")}
          >
            <Text
              style={[
                styles.filterText,
                view === "completed" && styles.filterTextActive,
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              view === "history" && styles.filterButtonActive,
            ]}
            onPress={() => setView("history")}
          >
            <Text
              style={[
                styles.filterText,
                view === "history" && styles.filterTextActive,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Search size={20} color={Colors.neutral[900]} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color={Colors.neutral[900]} />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.slate[400]} />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by title, department, or date..."
            placeholderTextColor={Colors.slate[500]}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <X size={18} color={Colors.slate[400]} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No documents found</Text>
        )}
        {filtered.map((doc) => {
          const urgencyColor = getUrgencyColor(doc.deadline);
          const urgencyStyle = getUrgencyStyle(urgencyColor);
          return (
            <TouchableOpacity
              key={doc.id}
              style={[
                styles.docCard,
                { backgroundColor: urgencyStyle.bg, borderColor: urgencyStyle.border },
              ]}
              onPress={() => setSelectedDoc(doc)}
            >
              <View style={styles.docContent}>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={styles.docMeta}>
                  {doc.dept} • Due{" "}
                  {new Date(doc.deadline).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </Text>
                <View style={styles.signersPreview}>
                  {doc.signers.slice(0, 3).map((signer) => (
                    <Avatar
                      key={signer.id}
                      name={signer.name}
                      image={signer.avatar}
                      size={24}
                      color={Colors.brand.light}
                    />
                  ))}
                  {doc.signers.length > 3 && (
                    <Text style={styles.moreSigners}>+{doc.signers.length - 3}</Text>
                  )}
                </View>
              </View>
              <View style={styles.docStatus}>
                {doc.signers.every((s) => s.status === "signed") ? (
                  <StatusPill status="completed" />
                ) : (
                  <StatusPill
                    status={urgencyColor === "red" ? "overdue" : "pending"}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Document Detail Modal */}
      <Modal
        visible={!!selectedDoc && !showBiometric && !showSuccess && !showSignatureMethod}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.modalTitle}>{selectedDoc?.title}</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedDoc?.dept} • {selectedDoc?.route}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedDoc(null)}>
                <X size={24} color={Colors.slate[300]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.docInfoSection}>
                <View style={styles.docInfoRow}>
                  <Text style={styles.docInfoLabel}>Document ID:</Text>
                  <Text style={styles.docInfoValue}>{selectedDoc?.id}</Text>
                </View>
                {selectedDoc?.issuingPerson && (
                  <View style={styles.docInfoRow}>
                    <Text style={styles.docInfoLabel}>Issuing Person:</Text>
                    <Text style={styles.docInfoValue}>{selectedDoc.issuingPerson}</Text>
                  </View>
                )}
                <View style={styles.docInfoRow}>
                  <Text style={styles.docInfoLabel}>Created:</Text>
                  <Text style={styles.docInfoValue}>
                    {new Date(selectedDoc?.createdAt || "").toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <View style={styles.docInfoRow}>
                  <Text style={styles.docInfoLabel}>Deadline:</Text>
                  <Text style={styles.docInfoValue}>
                    {new Date(selectedDoc?.deadline || "").toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                {selectedDoc?.completedAt && (
                  <View style={styles.docInfoRow}>
                    <Text style={styles.docInfoLabel}>Completed:</Text>
                    <Text style={[styles.docInfoValue, { color: Colors.status.success }]}>
                      {new Date(selectedDoc.completedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                )}
                <View style={styles.docInfoRow}>
                  <Text style={styles.docInfoLabel}>Signing Order:</Text>
                  <Text style={styles.docInfoValue}>{selectedDoc?.route}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Signers ({selectedDoc?.signers.length})</Text>
              {selectedDoc?.signers.map((signer, i) => {
                const isActive =
                  signer.status === "pending" &&
                  (selectedDoc.route === "Parallel" ||
                    selectedDoc.signers
                      .slice(0, i)
                      .every((x) => x.status === "signed"));
                return (
                  <View
                    key={signer.id}
                    style={[
                      styles.signerCard,
                      isActive && styles.signerCardActive,
                    ]}
                  >
                    <Avatar
                      name={signer.name}
                      image={signer.avatar}
                      size={40}
                      color={Colors.brand.light}
                    />
                    <View style={styles.signerInfo}>
                      <Text style={styles.signerName}>
                        {i + 1}. {signer.name}
                      </Text>
                      <Text style={styles.signerDesignation}>
                        {signer.designation}
                      </Text>
                      {signer.status === "signed" && signer.signedAt && (
                        <Text style={styles.signedAtText}>
                          Signed on {new Date(signer.signedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                          {signer.signatureMethod && ` via ${signer.signatureMethod}`}
                        </Text>
                      )}
                    </View>
                    <StatusPill status={signer.status} />
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.modalFooter}>
              {selectedDoc && canSign(selectedDoc).ok ? (
                <TouchableOpacity
                  style={styles.signButton}
                  onPress={() => handleSign(selectedDoc)}
                >
                  <Text style={styles.signButtonText}>Sign Document</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.disabledButton}>
                  <Text style={styles.disabledButtonText}>
                    {canSign(selectedDoc!)?.reason}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Signature Method Selection Modal */}
      <Modal visible={showSignatureMethod} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.signatureMethodModal}>
            <Text style={styles.signatureMethodTitle}>Choose Signature Method</Text>
            <Text style={styles.signatureMethodSubtitle}>
              Select how you want to sign this document
            </Text>

            <TouchableOpacity
              style={styles.methodOption}
              onPress={() => proceedWithSignature("biometric")}
            >
              <Fingerprint size={24} color={Colors.brand.light} />
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>Biometric Signature</Text>
                <Text style={styles.methodDescription}>
                  Use your fingerprint to sign
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.methodOption}
              onPress={() => proceedWithSignature("upload")}
            >
              <Upload size={24} color={Colors.brand.light} />
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>Upload Signature</Text>
                <Text style={styles.methodDescription}>
                  Upload your digital signature image
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.methodOption}
              onPress={() => proceedWithSignature("draw")}
            >
              <Pen size={24} color={Colors.brand.light} />
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>Draw Signature</Text>
                <Text style={styles.methodDescription}>
                  Sign with stylus or finger
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowSignatureMethod(false);
                setSelectedDoc(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Biometric Modal */}
      <Modal visible={showBiometric} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.biometricModal}>
            <View style={styles.biometricIcon}>
              <Fingerprint size={50} color={Colors.status.info} />
            </View>
            <Text style={styles.biometricTitle}>Biometric Verification</Text>
            <Text style={styles.biometricText}>
              Place your finger on the sensor to sign
            </Text>
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={completeSigning}
            >
              <Fingerprint size={60} color={Colors.status.info} />
              <Text style={styles.biometricButtonText}>Touch to Sign</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowBiometric(false);
                setSelectedDoc(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Text style={styles.successCheckmark}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Document Signed!</Text>
            <Text style={styles.successText}>
              Your digital signature has been applied
            </Text>
          </View>
        </View>
      </Modal>

      {/* Create New Document Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.createModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Signing Request</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color={Colors.slate[300]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.createForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <FileText size={14} color={Colors.slate[400]} /> Document Name *
                </Text>
                <TextInput
                  style={styles.input}
                  value={newDocTitle}
                  onChangeText={setNewDocTitle}
                  placeholder="Enter document title"
                  placeholderTextColor={Colors.slate[500]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Building2 size={14} color={Colors.slate[400]} /> Issuing Department *
                </Text>
                <TextInput
                  style={styles.input}
                  value={newDocDept}
                  onChangeText={setNewDocDept}
                  placeholder="e.g., HR, Finance, Legal"
                  placeholderTextColor={Colors.slate[500]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <User size={14} color={Colors.slate[400]} /> Issuing Person
                </Text>
                <Text style={styles.inputValue}>{employee.name}</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Calendar size={14} color={Colors.slate[400]} /> Sign By Date *
                </Text>
                <DatePicker
                  value={newDocDeadline}
                  onValueChange={setNewDocDeadline}
                  placeholder="Select Deadline"
                  minDate={new Date()}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Priority Level</Text>
                <View style={styles.routeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.routeOption,
                      newDocPriority === "Normal" && styles.routeOptionActive,
                    ]}
                    onPress={() => setNewDocPriority("Normal")}
                  >
                    <Text
                      style={[
                        styles.routeOptionText,
                        newDocPriority === "Normal" && styles.routeOptionTextActive,
                      ]}
                    >
                      Normal
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.routeOption,
                      newDocPriority === "High" && styles.routeOptionActive,
                    ]}
                    onPress={() => setNewDocPriority("High")}
                  >
                    <Text
                      style={[
                        styles.routeOptionText,
                        newDocPriority === "High" && styles.routeOptionTextActive,
                      ]}
                    >
                      High
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.routeOption,
                      newDocPriority === "Critical" && styles.routeOptionActive,
                    ]}
                    onPress={() => setNewDocPriority("Critical")}
                  >
                    <Text
                      style={[
                        styles.routeOptionText,
                        newDocPriority === "Critical" && styles.routeOptionTextActive,
                      ]}
                    >
                      Critical
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Signing Order</Text>
                <View style={styles.routeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.routeOption,
                      newDocRoute === "Sequential" && styles.routeOptionActive,
                    ]}
                    onPress={() => setNewDocRoute("Sequential")}
                  >
                    <Text
                      style={[
                        styles.routeOptionText,
                        newDocRoute === "Sequential" && styles.routeOptionTextActive,
                      ]}
                    >
                      Sequential
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.routeOption,
                      newDocRoute === "Parallel" && styles.routeOptionActive,
                    ]}
                    onPress={() => setNewDocRoute("Parallel")}
                  >
                    <Text
                      style={[
                        styles.routeOptionText,
                        newDocRoute === "Parallel" && styles.routeOptionTextActive,
                      ]}
                    >
                      Parallel
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>
                  Sequential: Signers must sign in order. Parallel: All can sign simultaneously.
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Users size={14} color={Colors.slate[400]} /> Signers * ({selectedSigners.length} selected)
                </Text>
                <TouchableOpacity
                  style={styles.selectSignersButton}
                  onPress={() => setShowSignerPicker(true)}
                >
                  <Text style={styles.selectSignersText}>
                    {selectedSigners.length === 0 ? "Select Signers" : "Modify Signers"}
                  </Text>
                </TouchableOpacity>
                {selectedSigners.length > 0 && (
                  <View style={styles.selectedSignersList}>
                    {selectedSigners.map((signer, index) => (
                      <View key={signer.id} style={styles.selectedSignerItem}>
                        <Avatar
                          name={signer.name}
                          image={signer.avatar}
                          size={32}
                          color={Colors.brand.light}
                        />
                        <View style={styles.selectedSignerInfo}>
                          <Text style={styles.selectedSignerName}>
                            {index + 1}. {signer.name}
                          </Text>
                          <Text style={styles.selectedSignerDesignation}>
                            {signer.designation}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => toggleSigner(signer)}>
                          <X size={18} color={Colors.slate[400]} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Upload size={14} color={Colors.slate[400]} /> Document Upload (Optional)
                </Text>
                <TouchableOpacity 
                  style={[styles.uploadButton, hasUploadedDoc && styles.uploadButtonSuccess]}
                  onPress={() => {
                    Alert.alert(
                      "Upload Document",
                      "In a real app, this would open the file picker to select a PDF or image.",
                      [
                        { text: "Cancel", style: "cancel" },
                        { 
                          text: "Simulate Upload", 
                          onPress: () => {
                            setHasUploadedDoc(true);
                            Alert.alert("Success", "Document uploaded successfully");
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Upload size={18} color={hasUploadedDoc ? Colors.status.success : Colors.brand.light} />
                  <Text style={[styles.uploadButtonText, hasUploadedDoc && styles.uploadButtonTextSuccess]}>
                    {hasUploadedDoc ? "Document Uploaded ✓" : "Upload Document (PDF, Image)"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.createFooter}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateDocument}
              >
                <Text style={styles.createButtonText}>Create Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Signer Picker Modal */}
      <Modal visible={showSignerPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.signerPickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Signers</Text>
              <TouchableOpacity onPress={() => setShowSignerPicker(false)}>
                <X size={24} color={Colors.slate[300]} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.signerPickerList}>
              {EMPLOYEES.filter(emp => emp.id !== employee.id).map((emp) => {
                // Count unsigned documents for this employee
                const unsignedCount = docs.filter(doc =>
                  doc.signers.some(s => s.id === emp.id && s.status === "pending")
                ).length;

                return (
                  <TouchableOpacity
                    key={emp.id}
                    style={[
                      styles.signerPickerItem,
                      selectedSigners.find(s => s.id === emp.id) && styles.signerPickerItemSelected,
                    ]}
                    onPress={() => toggleSigner(emp)}
                  >
                    <Avatar
                      name={emp.name}
                      image={emp.avatar}
                      size={40}
                      color={Colors.brand.light}
                    />
                    <View style={styles.signerPickerInfo}>
                      <Text style={styles.signerPickerName}>{emp.name}</Text>
                      <Text style={styles.signerPickerDesignation}>{emp.designation}</Text>
                      {unsignedCount > 0 && (
                        <Text style={styles.unsignedIndicator}>
                          {unsignedCount} unsigned document{unsignedCount > 1 ? 's' : ''}
                        </Text>
                      )}
                    </View>
                    {selectedSigners.find(s => s.id === emp.id) && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowSignerPicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
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
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
  },
  filterContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  filterButtonActive: {
    backgroundColor: Colors.brand.light + "22",
    borderColor: Colors.brand.light,
  },
  filterText: {
    color: Colors.slate[300],
    fontSize: 12,
    fontWeight: "500",
  },
  filterTextActive: {
    color: Colors.brand.light,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.neutral[800],
    justifyContent: "center",
    alignItems: "center",
  },
  newButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.brand.light,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: Colors.neutral[900],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  searchInput: {
    flex: 1,
    color: Colors.slate[200],
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyText: {
    color: Colors.slate[400],
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },
  docCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: 12,
  },
  docContent: {
    flex: 1,
  },
  docTitle: {
    color: Colors.slate[100],
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  docMeta: {
    color: Colors.slate[400],
    fontSize: 12,
    marginBottom: 8,
  },
  signersPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  moreSigners: {
    color: Colors.slate[400],
    fontSize: 11,
    marginLeft: 4,
  },
  docStatus: {
    justifyContent: "center",
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
    maxHeight: "90%",
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
    flex: 1,
  },
  modalTitle: {
    color: Colors.slate[200],
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  modalSubtitle: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  modalBody: {
    padding: 20,
  },
  docInfoSection: {
    backgroundColor: Colors.neutral[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  docInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  docInfoLabel: {
    color: Colors.slate[400],
    fontSize: 13,
    fontWeight: "500",
  },
  docInfoValue: {
    color: Colors.slate[200],
    fontSize: 13,
    fontWeight: "600",
  },
  sectionTitle: {
    color: Colors.slate[400],
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
  },
  signedAtText: {
    color: Colors.slate[500],
    fontSize: 11,
    marginTop: 4,
  },
  signerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    marginBottom: 8,
  },
  signerCardActive: {
    borderColor: Colors.brand.light,
    backgroundColor: Colors.brand.light + "11",
  },
  signerInfo: {
    flex: 1,
  },
  signerName: {
    color: Colors.slate[100],
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  signerDesignation: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
  },
  signButton: {
    backgroundColor: Colors.brand.light,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  signButtonText: {
    color: Colors.neutral[900],
    fontSize: 15,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: Colors.neutral[800],
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  disabledButtonText: {
    color: Colors.slate[400],
    fontSize: 15,
    fontWeight: "500",
  },
  signatureMethodModal: {
    backgroundColor: Colors.neutral[900],
    margin: 20,
    padding: 24,
    borderRadius: 24,
  },
  signatureMethodTitle: {
    color: Colors.slate[100],
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  signatureMethodSubtitle: {
    color: Colors.slate[400],
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
  },
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    backgroundColor: Colors.neutral[800],
    marginBottom: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    color: Colors.slate[100],
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  methodDescription: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  biometricModal: {
    backgroundColor: Colors.neutral[900],
    margin: 20,
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
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
    color: Colors.slate[200],
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  biometricText: {
    color: Colors.slate[400],
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
  },
  biometricButton: {
    width: "100%",
    padding: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.status.info,
    backgroundColor: Colors.status.info + "1A",
    alignItems: "center",
    gap: 12,
  },
  biometricButtonText: {
    color: Colors.status.info,
    fontSize: 15,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 12,
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.slate[300],
    fontSize: 14,
  },
  successModal: {
    backgroundColor: Colors.neutral[900],
    margin: 20,
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
  },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.status.success + "33",
    borderWidth: 2,
    borderColor: Colors.status.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successCheckmark: {
    fontSize: 36,
    color: Colors.status.success,
  },
  successTitle: {
    color: Colors.slate[100],
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  successText: {
    color: Colors.slate[400],
    fontSize: 13,
    textAlign: "center",
  },
  createModal: {
    backgroundColor: Colors.neutral[900],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    flex: 1,
  },
  createForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: Colors.slate[300],
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  inputValue: {
    color: Colors.slate[200],
    fontSize: 14,
    padding: 12,
    backgroundColor: Colors.neutral[800] + "66",
    borderRadius: 12,
  },
  routeOptions: {
    flexDirection: "row",
    gap: 12,
  },
  routeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    alignItems: "center",
  },
  routeOptionActive: {
    backgroundColor: Colors.brand.light + "22",
    borderColor: Colors.brand.light,
  },
  routeOptionText: {
    color: Colors.slate[300],
    fontSize: 14,
    fontWeight: "500",
  },
  routeOptionTextActive: {
    color: Colors.brand.light,
  },
  selectSignersButton: {
    backgroundColor: Colors.neutral[800],
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    alignItems: "center",
  },
  selectSignersText: {
    color: Colors.brand.light,
    fontSize: 14,
    fontWeight: "600",
  },
  selectedSignersList: {
    marginTop: 12,
    gap: 8,
  },
  selectedSignerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: Colors.neutral[800],
    borderRadius: 12,
  },
  selectedSignerInfo: {
    flex: 1,
  },
  selectedSignerName: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "500",
  },
  selectedSignerDesignation: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.brand.light,
    backgroundColor: Colors.brand.light + "11",
  },
  uploadButtonText: {
    color: Colors.brand.light,
    fontSize: 14,
    fontWeight: "600",
  },
  uploadButtonSuccess: {
    borderColor: Colors.status.success,
    backgroundColor: Colors.status.success + "11",
  },
  uploadButtonTextSuccess: {
    color: Colors.status.success,
  },
  helperText: {
    color: Colors.slate[500],
    fontSize: 11,
    marginTop: 8,
    fontStyle: "italic",
  },
  createFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
  },
  createButton: {
    backgroundColor: Colors.brand.light,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  createButtonText: {
    color: Colors.neutral[900],
    fontSize: 15,
    fontWeight: "700",
  },
  signerPickerModal: {
    backgroundColor: Colors.neutral[900],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  signerPickerList: {
    padding: 20,
  },
  signerPickerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    marginBottom: 8,
  },
  signerPickerItemSelected: {
    backgroundColor: Colors.brand.light + "11",
    borderColor: Colors.brand.light,
  },
  signerPickerInfo: {
    flex: 1,
  },
  signerPickerName: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "500",
  },
  signerPickerDesignation: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  unsignedIndicator: {
    color: Colors.status.warning,
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.brand.light,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: Colors.neutral[900],
    fontSize: 14,
    fontWeight: "700",
  },
  doneButton: {
    margin: 16,
    backgroundColor: Colors.brand.light,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  doneButtonText: {
    color: Colors.neutral[900],
    fontSize: 15,
    fontWeight: "700",
  },
});
