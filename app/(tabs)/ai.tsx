import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Download, FileText, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../constants/Colors";
import { EMPLOYEES, ESIGN_DOCS, KB_DOCS } from "../../constants/Data";
import { ChatMessage } from "../../types";
import { downloadFile, generatePayslip } from "../../utils/downloadHelper";

const SUGGESTIONS = [
  "Start a new signing request",
  "What is my leave balance?",
  "Find Fire Drill Procedure",
  "Download payslip",
  "How to apply maternity leave?",
  "Clock in not working",
  "Where is NDA template?",
  "Show holiday calendar",
];

interface AgenticState {
  active: boolean;
  type: "document_signing" | null;
  step: number;
  data?: any;
}

interface AnswerResponse {
  text: string;
  cite?: {
    docId: string;
    heading: string;
  };
  action?: string;
}

export default function AIScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const [suggIndex, setSuggIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      text: "Ask me anything. I provide brief answers with source citations.",
    },
  ]);
  const [employee, setEmployee] = useState(EMPLOYEES[0]);
  const [agenticState, setAgenticState] = useState<AgenticState>({
    active: false,
    type: null,
    step: 0,
  });

  // Payslip modal state
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [downloadingPayslip, setDownloadingPayslip] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("employeeId").then((id) => {
      const emp = EMPLOYEES.find((e) => e.id === id);
      if (emp) setEmployee(emp);
    });
  }, []);

  useEffect(() => {
    if (input) return;
    const interval = setInterval(() => {
      setSuggIndex((i) => (i + 1) % SUGGESTIONS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [input]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleViewSOP = (docId: string) => {
    const doc = KB_DOCS.find((d) => d.id === docId);
    if (doc) {
      // Navigate to KB tab (assuming it's the knowledge base tab)
      router.push("/(tabs)/kb");
      // In a real implementation, you would also pass the docId to open that specific document
    }
  };

  const handlePayslipDownload = async (month: string) => {
    setDownloadingPayslip(month);
    const filename = `Payslip_${month.replace(" ", "_")}.txt`;
    const content = generatePayslip(month, "৳ 47,800");
    await downloadFile(filename, content, "text/plain");
    setDownloadingPayslip(null);
    setShowPayslipModal(false);

    // Add confirmation message
    setTimeout(() => {
      const confirmMsg: ChatMessage = {
        role: "assistant",
        text: `✓ Payslip for ${month} downloaded successfully.`,
      };
      setMessages((prev) => [...prev, confirmMsg]);
    }, 300);
  };

  const answerFor = (q: string): AnswerResponse => {
    const ql = q.toLowerCase();
    const b = employee.leaveBalance;

    // Leave balance query
    if (ql.includes("leave balance")) {
      return {
        text: `Annual: ${b.annual} days, Sick: ${b.sick} days, Casual: ${b.casual} days.`,
        cite: { docId: "KB-LEAVE-23", heading: "Leave Policy" },
      };
    }

    // Payslip download query
    if (ql.includes("payslip") || ql.includes("download payslip")) {
      // Show payslip modal
      setTimeout(() => setShowPayslipModal(true), 400);
      return {
        text: "Select a month to download your payslip:",
        action: "show_payslip_options"
      };
    }

    // Clock in issue
    if (ql.includes("clock in") || ql.includes("geofence")) {
      return {
        text: "Clock-in requires factory geofence. Enable demo mode in Attendance settings.",
      };
    }

    // Start signing request - Agentic flow
    if (ql.includes("start") && ql.includes("sign")) {
      const pendingDocs = ESIGN_DOCS.filter(
        (doc) => !doc.completedAt && doc.signers.some((s) => s.id === employee.id && s.status === "pending")
      );

      if (pendingDocs.length > 0) {
        setAgenticState({
          active: true,
          type: "document_signing",
          step: 1,
          data: { documents: pendingDocs },
        });

        const docList = pendingDocs.map((d, i) => `${i + 1}. ${d.title} (${d.emergency} priority)`).join("\n");
        return {
          text: `You have ${pendingDocs.length} document(s) to sign:\n\n${docList}\n\nKey points:\n• Review each document carefully\n• Check signee order and deadlines\n• I can auto-sign with your confirmation\n\nProceed with signing?`,
        };
      } else {
        return {
          text: "No pending documents to sign. Navigate to E-Sign to create a new request.",
        };
      }
    }

    // Maternity leave query
    if (ql.includes("maternity")) {
      const doc = KB_DOCS.find((d) => d.id === "KB-LEAVE-23");
      const chunk = doc?.chunks?.find((c) => c.heading.includes("Maternity"));
      return {
        text: "16 weeks paid maternity leave (8 before, 8 after delivery). Submit via Leave module with medical docs.",
        cite: chunk ? { docId: doc!.id, heading: chunk.heading } : undefined,
      };
    }

    // Knowledge base queries (Fire drill, NDA, policies, etc.)
    if (
      KB_DOCS.length &&
      (ql.includes("fire") || ql.includes("nda") || ql.includes("policy") ||
        ql.includes("drill") || ql.includes("template") || ql.includes("sop"))
    ) {
      const doc =
        KB_DOCS.find(
          (d) =>
            d.title.toLowerCase().includes(ql) ||
            d.excerpt.toLowerCase().includes(ql) ||
            d.category.toLowerCase().includes(ql)
        ) || KB_DOCS[0];

      const chunk = doc.chunks?.[0];
      // Provide brief excerpt instead of full chunk
      const briefText = chunk?.text.substring(0, 150) + "..." || doc.excerpt;
      return {
        text: `Found: ${doc.title}\n\n${briefText}`,
        cite: { docId: doc.id, heading: chunk?.heading || "Overview" },
      };
    }

    // Default response
    return {
      text: "I'll help with that. Could you provide more details, or try asking about leave, payslips, SOPs, or e-sign?"
    };
  };

  const handleAgenticResponse = (response: string): AnswerResponse | null => {
    const rl = response.toLowerCase();

    if (agenticState.type === "document_signing" && agenticState.step === 1) {
      if (rl.includes("yes") || rl.includes("proceed") || rl.includes("confirm")) {
        // Simulate signing process
        const docs = agenticState.data.documents;
        setAgenticState({ ...agenticState, step: 2 });

        setTimeout(() => {
          const confirmMsg: ChatMessage = {
            role: "assistant",
            text: `✓ Processing signatures for ${docs.length} document(s)...\n\nAll documents signed successfully! Check E-Sign tab for details.`,
          };
          setMessages((prev) => [...prev, confirmMsg]);
          setAgenticState({ active: false, type: null, step: 0 });
        }, 1500);

        return { text: "Signing documents..." };
      } else if (rl.includes("no") || rl.includes("cancel")) {
        setAgenticState({ active: false, type: null, step: 0 });
        return { text: "Signing cancelled. You can review documents in the E-Sign tab." };
      }
    }

    return null;
  };

  const send = () => {
    const q = input.trim();
    if (!q) return;

    const userMsg: ChatMessage = { role: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    Keyboard.dismiss();

    setTimeout(() => {
      // Check if we're in an agentic flow
      let ans;
      if (agenticState.active) {
        ans = handleAgenticResponse(q);
        if (!ans) {
          ans = { text: "Please respond with 'yes' to proceed or 'no' to cancel." };
        }
      } else {
        ans = answerFor(q);
      }

      const assistantMsg: ChatMessage = {
        role: "assistant",
        text: ans.text,
        ...(ans.cite && { cite: ans.cite }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 300);
  };

  const payslipMonths = ["November 2025", "October 2025", "September 2025", "August 2025"];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ask FFL — AI Assistant</Text>
        <Text style={styles.headerSubtitle}>
          Brief answers • SOP citations • Agentic workflows
        </Text>
      </View>

      {messages.length === 1 && messages[0].role === "system" && (
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeText}>Try a quick prompt:</Text>
          <View style={styles.suggestionsGrid}>
            {SUGGESTIONS.slice(0, 4).map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.suggestionChip}
                onPress={() => setInput(s)}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(
          (msg, i) =>
            msg.role !== "system" && (
              <View
                key={i}
                style={[
                  styles.message,
                  msg.role === "user"
                    ? styles.messageUser
                    : styles.messageAssistant,
                ]}
              >
                <Text
                  style={
                    msg.role === "user"
                      ? styles.messageTextUser
                      : styles.messageTextAssistant
                  }
                >
                  {msg.text}
                </Text>
                {msg.cite && (
                  <View style={styles.citation}>
                    <Text style={styles.citationLabel}>Source:</Text>
                    <Text style={styles.citationText}>{msg.cite.heading}</Text>
                    <TouchableOpacity onPress={() => handleViewSOP(msg.cite!.docId)}>
                      <Text style={styles.citationLink}>View SOP →</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={input ? "Type a message…" : SUGGESTIONS[suggIndex]}
          placeholderTextColor={Colors.slate[500]}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={send}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={send}
          disabled={!input.trim()}
        >
          <Send size={20} color={input.trim() ? Colors.neutral[900] : Colors.slate[500]} />
        </TouchableOpacity>
      </View>

      {/* Payslip Download Modal */}
      <Modal visible={showPayslipModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPayslipModal(false)}
        >
          <View style={styles.payslipModal}>
            <View style={styles.payslipModalHeader}>
              <FileText size={24} color={Colors.brand.light} />
              <Text style={styles.payslipModalTitle}>Download Payslip</Text>
            </View>

            <Text style={styles.payslipModalSubtitle}>
              Select a month to download:
            </Text>

            <View style={styles.payslipOptions}>
              {payslipMonths.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={styles.payslipOption}
                  onPress={() => handlePayslipDownload(month)}
                  disabled={downloadingPayslip === month}
                >
                  <View style={styles.payslipOptionLeft}>
                    <Text style={styles.payslipOptionMonth}>{month}</Text>
                    <Text style={styles.payslipOptionAmount}>Net: ৳ 47,800</Text>
                  </View>
                  {downloadingPayslip === month ? (
                    <ActivityIndicator size="small" color={Colors.brand.light} />
                  ) : (
                    <Download size={20} color={Colors.brand.light} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.payslipModalClose}
              onPress={() => setShowPayslipModal(false)}
            >
              <Text style={styles.payslipModalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
  },
  headerTitle: {
    color: Colors.slate[200],
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  welcome: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "66",
  },
  welcomeTitle: {
    color: Colors.slate[200],
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  welcomeText: {
    color: Colors.slate[400],
    fontSize: 13,
    marginBottom: 16,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: Colors.neutral[800],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  suggestionText: {
    color: Colors.slate[300],
    fontSize: 12,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  message: {
    maxWidth: "85%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  messageUser: {
    alignSelf: "flex-end",
    backgroundColor: Colors.brand.light,
  },
  messageAssistant: {
    alignSelf: "flex-start",
    backgroundColor: Colors.neutral[800],
  },
  messageTextUser: {
    color: Colors.neutral[900],
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextAssistant: {
    color: Colors.slate[100],
    fontSize: 14,
    lineHeight: 20,
  },
  citation: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[700],
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  citationLabel: {
    color: Colors.slate[400],
    fontSize: 10,
  },
  citationText: {
    color: Colors.slate[300],
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
  },
  citationLink: {
    color: Colors.brand.light,
    fontSize: 11,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.neutral[900],
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.slate[200],
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brand.light,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.neutral[800],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  payslipModal: {
    backgroundColor: Colors.neutral[900],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  payslipModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  payslipModalTitle: {
    color: Colors.slate[100],
    fontSize: 20,
    fontWeight: "700",
  },
  payslipModalSubtitle: {
    color: Colors.slate[400],
    fontSize: 14,
    marginBottom: 20,
  },
  payslipOptions: {
    gap: 12,
    marginBottom: 20,
  },
  payslipOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.neutral[800],
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  payslipOptionLeft: {
    flex: 1,
  },
  payslipOptionMonth: {
    color: Colors.slate[200],
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  payslipOptionAmount: {
    color: Colors.slate[400],
    fontSize: 13,
  },
  payslipModalClose: {
    backgroundColor: Colors.neutral[800],
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  payslipModalCloseText: {
    color: Colors.slate[300],
    fontSize: 15,
    fontWeight: "600",
  },
});
