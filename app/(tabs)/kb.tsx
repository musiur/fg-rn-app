import { CheckCircle, Clock, Download, Flag, Search, Share2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { Colors } from "../../constants/Colors";
import { ISSUES, KB_DOCS } from "../../constants/Data";
import { Issue, KBDocument } from "../../types";
import { downloadFile, generateKBDocument } from "../../utils/downloadHelper";

const CATEGORIES = [
  "HR Policies",
  "Compliance",
  "IT & Security",
  "Operations",
  "Safety",
  "Legal",
];

export default function KnowledgeBaseScreen() {
  const [activeTab, setActiveTab] = useState<"docs" | "issues">("docs");
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<KBDocument | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [downloading, setDownloading] = useState(false);

  // Issues State
  const [myIssues, setMyIssues] = useState<Issue[]>(ISSUES);
  const [issueText, setIssueText] = useState("");
  const [issueDepartment, setIssueDepartment] = useState("");
  const [issueArea, setIssueArea] = useState("");
  const [issueImportance, setIssueImportance] = useState<"low" | "moderate" | "high">("moderate");
  const [showGeneralReportModal, setShowGeneralReportModal] = useState(false);
  
  // Current user info (would come from AsyncStorage in real app)
  const [currentUser] = useState({
    name: "Fuad Tasrim Hossain",
    department: "Merchandising"
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredDocs = KB_DOCS.filter((doc) => {
    const inCat =
      selectedCategories.length === 0 ||
      selectedCategories.includes(doc.category);
    if (!inCat) return false;

    if (!search.trim()) return true;

    const searchLower = search.toLowerCase();
    return (
      doc.title.toLowerCase().includes(searchLower) ||
      doc.excerpt.toLowerCase().includes(searchLower) ||
      doc.category.toLowerCase().includes(searchLower)
    );
  });

  const handleDownload = async () => {
    if (!selectedDoc) return;

    setDownloading(true);
    const filename = `${selectedDoc.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    const content = generateKBDocument(
      selectedDoc.title,
      selectedDoc.category,
      selectedDoc.excerpt,
      selectedDoc.chunks || []
    );
    await downloadFile(filename, content, "text/plain");
    setDownloading(false);
  };

  const handleShare = (method: string) => {
    setShowShareModal(false);
    setTimeout(() => {
      Alert.alert("Shared", `Document shared via ${method}`);
    }, 500);
  };

  const handleReportSubmit = (reason: string) => {
    setShowReportModal(false);
    setTimeout(() => {
      Alert.alert(
        "Report Submitted",
        "Thank you for your feedback. We will review the document."
      );
    }, 500);
  };

  const handleGeneralReportSubmit = () => {
    if (!issueText.trim()) {
      Alert.alert("Error", "Please describe the issue.");
      return;
    }
    
    if (!issueDepartment.trim()) {
      Alert.alert("Error", "Please select the issue department.");
      return;
    }
    
    if (!issueArea.trim()) {
      Alert.alert("Error", "Please specify the issue area.");
      return;
    }

    const newIssue: Issue = {
      id: `ISS-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`,
      userName: currentUser.name,
      userDepartment: currentUser.department,
      issueDepartment: issueDepartment,
      issueArea: issueArea,
      description: issueText,
      importance: issueImportance,
      date: new Date().toISOString().split('T')[0],
      status: "open",
    };

    setMyIssues([newIssue, ...myIssues]);

    setShowGeneralReportModal(false);
    setIssueText("");
    setIssueDepartment("");
    setIssueArea("");
    setIssueImportance("moderate");
    
    setTimeout(() => {
      Alert.alert(
        "Issue Reported",
        "Your issue has been logged and will be reviewed by the admin team."
      );
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "docs" && styles.activeTab]}
          onPress={() => setActiveTab("docs")}
        >
          <Text style={[styles.tabText, activeTab === "docs" && styles.activeTabText]}>Documents</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "issues" && styles.activeTab]}
          onPress={() => setActiveTab("issues")}
        >
          <Text style={[styles.tabText, activeTab === "issues" && styles.activeTabText]}>My Issues</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "docs" ? (
        <>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={18} color={Colors.slate[400]} />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search SOPs, policies, templates"
                placeholderTextColor={Colors.slate[500]}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <X size={18} color={Colors.slate[400]} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={styles.categoriesContent}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(cat) && styles.categoryChipActive,
                  ]}
                  onPress={() => toggleCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategories.includes(cat) && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredDocs.length} {filteredDocs.length === 1 ? "Document" : "Documents"}
            </Text>
            <TouchableOpacity
              style={styles.reportIssueButton}
              onPress={() => setShowGeneralReportModal(true)}
            >
              <Flag size={14} color={Colors.status.error} />
              <Text style={styles.reportIssueText}>Report Issue</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
          >
            {filteredDocs.length === 0 && (
              <Text style={styles.emptyText}>
                No results found. Try different keywords.
              </Text>
            )}
            {filteredDocs.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={styles.docCard}
                onPress={() => setSelectedDoc(doc)}
              >
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={styles.docMeta}>
                  {doc.category} • Updated{" "}
                  {new Date(doc.lastUpdated).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {doc.ownerDept && ` • ${doc.ownerDept}`}
                </Text>
                <Text style={styles.docExcerpt} numberOfLines={2}>
                  {doc.excerpt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.issuesContainer}>
          <View style={styles.issuesHeader}>
            <Text style={styles.issuesTitle}>Reported Issues</Text>
            <TouchableOpacity
              style={styles.newIssueButton}
              onPress={() => setShowGeneralReportModal(true)}
            >
              <Text style={styles.newIssueButtonText}>+ New Issue</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {myIssues.length === 0 && (
              <Text style={styles.emptyText}>You haven't reported any issues yet.</Text>
            )}
            {myIssues.map((issue) => (
              <View key={issue.id} style={styles.issueCard}>
                <View style={styles.issueHeader}>
                  <Text style={styles.issueId}>{issue.id}</Text>
                  <View style={styles.issueHeaderRight}>
                    <View style={[
                      styles.importanceBadge,
                      issue.importance === 'high' && styles.importanceHigh,
                      issue.importance === 'moderate' && styles.importanceModerate,
                      issue.importance === 'low' && styles.importanceLow,
                    ]}>
                      <Text style={[
                        styles.importanceText,
                        issue.importance === 'high' && styles.importanceTextHigh,
                        issue.importance === 'moderate' && styles.importanceTextModerate,
                        issue.importance === 'low' && styles.importanceTextLow,
                      ]}>
                        {issue.importance.charAt(0).toUpperCase() + issue.importance.slice(1)}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, issue.status === 'resolved' ? styles.statusResolved : styles.statusOpen]}>
                      {issue.status === 'resolved' ? (
                        <CheckCircle size={12} color={Colors.status.success} />
                      ) : (
                        <Clock size={12} color={Colors.status.warning} />
                      )}
                      <Text style={[styles.statusText, issue.status === 'resolved' ? styles.statusTextResolved : styles.statusTextOpen]}>
                        {issue.status === 'resolved' ? 'Resolved' : 'Open'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.issueMetaRow}>
                  <Text style={styles.issueMetaLabel}>Reporter:</Text>
                  <Text style={styles.issueMetaValue}>{issue.userName} ({issue.userDepartment})</Text>
                </View>
                
                <View style={styles.issueMetaRow}>
                  <Text style={styles.issueMetaLabel}>Department:</Text>
                  <Text style={styles.issueMetaValue}>{issue.issueDepartment}</Text>
                </View>
                
                <View style={styles.issueMetaRow}>
                  <Text style={styles.issueMetaLabel}>Area:</Text>
                  <Text style={styles.issueMetaValue}>{issue.issueArea}</Text>
                </View>
                
                <Text style={styles.issueDescription}>{issue.description}</Text>
                <Text style={styles.issueDate}>Reported on {issue.date}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Document Detail Modal */}
      <Modal visible={!!selectedDoc} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.modalTitle}>{selectedDoc?.title}</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedDoc?.category} • Updated{" "}
                  {selectedDoc &&
                    new Date(selectedDoc.lastUpdated).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedDoc(null)}>
                <X size={24} color={Colors.slate[300]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Overview</Text>
                <Text style={styles.sectionText}>{selectedDoc?.excerpt}</Text>
              </View>

              {selectedDoc?.chunks?.map((chunk, i) => (
                <View key={i} style={styles.chunk}>
                  <Text style={styles.chunkHeading}>{chunk.heading}</Text>
                  <Text style={styles.chunkText}>{chunk.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color={Colors.slate[200]} />
                ) : (
                  <>
                    <Download size={18} color={Colors.slate[200]} />
                    <Text style={styles.footerButtonText}>Download</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => setShowShareModal(true)}
              >
                <Share2 size={18} color={Colors.slate[200]} />
                <Text style={styles.footerButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.footerButtonReport]}
                onPress={() => setShowReportModal(true)}
              >
                <Flag size={18} color={Colors.status.error} />
                <Text
                  style={[
                    styles.footerButtonText,
                    { color: Colors.status.error },
                  ]}
                >
                  Report
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal visible={showShareModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowShareModal(false)}
        >
          <View style={styles.actionModalContent}>
            <Text style={styles.actionModalTitle}>Share Document</Text>
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleShare("Email")}
            >
              <Text style={styles.actionOptionText}>Share via Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleShare("WhatsApp")}
            >
              <Text style={styles.actionOptionText}>Share via WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleShare("Copy Link")}
            >
              <Text style={styles.actionOptionText}>Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Document Report Modal */}
      <Modal visible={showReportModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowReportModal(false)}
        >
          <View style={styles.actionModalContent}>
            <Text style={styles.actionModalTitle}>Report Document Issue</Text>
            <Text style={styles.actionModalSubtitle}>
              Why are you reporting this document?
            </Text>
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleReportSubmit("Outdated Content")}
            >
              <Text style={styles.actionOptionText}>Outdated Content</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleReportSubmit("Incorrect Information")}
            >
              <Text style={styles.actionOptionText}>Incorrect Information</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleReportSubmit("Formatting Issues")}
            >
              <Text style={styles.actionOptionText}>Formatting Issues</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionOption}
              onPress={() => handleReportSubmit("Other")}
            >
              <Text style={styles.actionOptionText}>Other</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowReportModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* General Issue Report Modal */}
      <Modal visible={showGeneralReportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.issueReportModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report an Issue</Text>
              <TouchableOpacity onPress={() => {
                setShowGeneralReportModal(false);
                setIssueText("");
                setIssueDepartment("");
                setIssueArea("");
                setIssueImportance("moderate");
              }}>
                <X size={24} color={Colors.slate[300]} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.issueFormScroll} contentContainerStyle={styles.issueFormContent}>
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Reporter Information</Text>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Name:</Text>
                  <Text style={styles.formValue}>{currentUser.name}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.formLabel}>Department:</Text>
                  <Text style={styles.formValue}>{currentUser.department}</Text>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>Issue Details</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Issue Department *</Text>
                  <TextInput
                    style={styles.input}
                    value={issueDepartment}
                    onChangeText={setIssueDepartment}
                    placeholder="e.g., IT, HR, Facilities, Operations"
                    placeholderTextColor={Colors.slate[500]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Specific Issue Area *</Text>
                  <TextInput
                    style={styles.input}
                    value={issueArea}
                    onChangeText={setIssueArea}
                    placeholder="e.g., Payroll System, Meeting Room, Network"
                    placeholderTextColor={Colors.slate[500]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Issue Description *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={issueText}
                    onChangeText={setIssueText}
                    placeholder="Describe the issue in detail..."
                    placeholderTextColor={Colors.slate[500]}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Issue Importance *</Text>
                  <View style={styles.importanceOptions}>
                    <TouchableOpacity
                      style={[
                        styles.importanceOption,
                        issueImportance === "low" && styles.importanceOptionActiveLow,
                      ]}
                      onPress={() => setIssueImportance("low")}
                    >
                      <Text
                        style={[
                          styles.importanceOptionText,
                          issueImportance === "low" && styles.importanceOptionTextActiveLow,
                        ]}
                      >
                        Low
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.importanceOption,
                        issueImportance === "moderate" && styles.importanceOptionActiveModerate,
                      ]}
                      onPress={() => setIssueImportance("moderate")}
                    >
                      <Text
                        style={[
                          styles.importanceOptionText,
                          issueImportance === "moderate" && styles.importanceOptionTextActiveModerate,
                        ]}
                      >
                        Moderate
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.importanceOption,
                        issueImportance === "high" && styles.importanceOptionActiveHigh,
                      ]}
                      onPress={() => setIssueImportance("high")}
                    >
                      <Text
                        style={[
                          styles.importanceOptionText,
                          issueImportance === "high" && styles.importanceOptionTextActiveHigh,
                        ]}
                      >
                        High
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.issueFormFooter}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleGeneralReportSubmit}
              >
                <Text style={styles.submitButtonText}>Submit Issue Report</Text>
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
  headerTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900],
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.brand.light,
  },
  tabText: {
    color: Colors.slate[400],
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: Colors.brand.light,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "CC",
    gap: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.neutral[900],
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.slate[200],
    fontSize: 14,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContent: {
    gap: 8,
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  categoryChipActive: {
    backgroundColor: Colors.brand.light + "22",
    borderColor: Colors.brand.light,
  },
  categoryText: {
    color: Colors.slate[300],
    fontSize: 12,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: Colors.brand.light,
  },
  resultsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsCount: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
  },
  reportIssueButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.status.error + "1A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.status.error + "33",
  },
  reportIssueText: {
    color: Colors.status.error,
    fontSize: 12,
    fontWeight: "600",
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
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    borderLeftWidth: 4,
    borderLeftColor: Colors.brand.light,
    backgroundColor: Colors.neutral[900] + "99",
  },
  docTitle: {
    color: Colors.slate[100],
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  docMeta: {
    color: Colors.slate[400],
    fontSize: 11,
    marginBottom: 8,
  },
  docExcerpt: {
    color: Colors.slate[300],
    fontSize: 13,
    lineHeight: 18,
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
    paddingRight: 16,
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
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: Colors.slate[400],
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionText: {
    color: Colors.slate[300],
    fontSize: 14,
    lineHeight: 22,
  },
  chunk: {
    marginBottom: 20,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: Colors.brand.light,
  },
  chunkHeading: {
    color: Colors.slate[100],
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  chunkText: {
    color: Colors.slate[300],
    fontSize: 13,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
    gap: 8,
  },
  footerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  footerButtonReport: {
    borderColor: Colors.status.error,
  },
  footerButtonText: {
    color: Colors.slate[200],
    fontSize: 13,
    fontWeight: "500",
  },
  actionModalContent: {
    backgroundColor: Colors.neutral[900],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
  },
  actionModalTitle: {
    color: Colors.slate[100],
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  actionModalSubtitle: {
    color: Colors.slate[400],
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  actionOption: {
    backgroundColor: Colors.neutral[800],
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  actionOptionText: {
    color: Colors.slate[200],
    fontSize: 15,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 8,
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.slate[400],
    fontSize: 15,
    fontWeight: "600",
  },
  issueInput: {
    backgroundColor: Colors.neutral[800],
    borderRadius: 12,
    padding: 16,
    color: Colors.slate[200],
    fontSize: 14,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
  },
  submitButton: {
    backgroundColor: Colors.brand.light,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.neutral[900],
    fontSize: 15,
    fontWeight: "700",
  },
  issuesContainer: {
    flex: 1,
  },
  issuesHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  issuesTitle: {
    color: Colors.slate[200],
    fontSize: 16,
    fontWeight: "600",
  },
  newIssueButton: {
    backgroundColor: Colors.brand.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newIssueButtonText: {
    color: Colors.neutral[900],
    fontSize: 12,
    fontWeight: "600",
  },
  issueCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    backgroundColor: Colors.neutral[900] + "99",
  },
  issueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  issueHeaderRight: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  issueId: {
    color: Colors.slate[400],
    fontSize: 12,
    fontWeight: "600",
  },
  issueMetaRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  issueMetaLabel: {
    color: Colors.slate[500],
    fontSize: 12,
    fontWeight: "600",
    width: 90,
  },
  issueMetaValue: {
    color: Colors.slate[300],
    fontSize: 12,
    flex: 1,
  },
  importanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  importanceHigh: {
    backgroundColor: Colors.status.error + "1A",
    borderColor: Colors.status.error + "33",
  },
  importanceModerate: {
    backgroundColor: Colors.status.warning + "1A",
    borderColor: Colors.status.warning + "33",
  },
  importanceLow: {
    backgroundColor: Colors.status.info + "1A",
    borderColor: Colors.status.info + "33",
  },
  importanceText: {
    fontSize: 10,
    fontWeight: "600",
  },
  importanceTextHigh: {
    color: Colors.status.error,
  },
  importanceTextModerate: {
    color: Colors.status.warning,
  },
  importanceTextLow: {
    color: Colors.status.info,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusOpen: {
    backgroundColor: Colors.status.warning + "1A",
    borderColor: Colors.status.warning + "33",
  },
  statusResolved: {
    backgroundColor: Colors.status.success + "1A",
    borderColor: Colors.status.success + "33",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextOpen: {
    color: Colors.status.warning,
  },
  statusTextResolved: {
    color: Colors.status.success,
  },
  issueDescription: {
    color: Colors.slate[200],
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  issueDate: {
    color: Colors.slate[500],
    fontSize: 11,
  },
  issueReportModal: {
    backgroundColor: Colors.neutral[900],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    flex: 1,
  },
  issueFormScroll: {
    flex: 1,
  },
  issueFormContent: {
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formSectionTitle: {
    color: Colors.slate[200],
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  formLabel: {
    color: Colors.slate[400],
    fontSize: 14,
    fontWeight: "500",
    width: 100,
  },
  formValue: {
    color: Colors.slate[200],
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
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
    textAlignVertical: "top",
  },
  importanceOptions: {
    flexDirection: "row",
    gap: 12,
  },
  importanceOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[700],
    alignItems: "center",
    backgroundColor: Colors.neutral[800],
  },
  importanceOptionActiveLow: {
    backgroundColor: Colors.status.info + "22",
    borderColor: Colors.status.info,
  },
  importanceOptionActiveModerate: {
    backgroundColor: Colors.status.warning + "22",
    borderColor: Colors.status.warning,
  },
  importanceOptionActiveHigh: {
    backgroundColor: Colors.status.error + "22",
    borderColor: Colors.status.error,
  },
  importanceOptionText: {
    color: Colors.slate[300],
    fontSize: 14,
    fontWeight: "600",
  },
  importanceOptionTextActiveLow: {
    color: Colors.status.info,
  },
  importanceOptionTextActiveModerate: {
    color: Colors.status.warning,
  },
  importanceOptionTextActiveHigh: {
    color: Colors.status.error,
  },
  issueFormFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
  },
});
