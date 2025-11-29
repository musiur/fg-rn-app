# FFL AI Assistant - Testing Guide

## Quick Test Scenarios

### 1. Test View SOP Flow ✅

**Steps:**
1. Open the app and navigate to the "ask FFL" tab
2. Type: `"Find Fire Drill Procedure"`
3. Send the message
4. **Expected Result:**
   - Bot responds with: "Found: Fire Drill Procedure v3.2" + brief excerpt
   - Citation appears at bottom: "Source: Drill Frequency & Notification"
   - "View SOP →" link is visible and clickable
5. Click on "View SOP →"
6. **Expected Result:**
   - App navigates to the KB (Knowledge Base) tab
   - User can view the full SOP document

**Alternative queries to test:**
- "Where is NDA template?"
- "Show me the password policy"
- "Fire drill procedure"

---

### 2. Test Download Payslip Function ✅

**Steps:**
1. In the "ask FFL" tab
2. Type: `"Download payslip"`
3. Send the message
4. **Expected Result:**
   - Bot responds: "Select a month to download your payslip:"
   - Modal slides up from bottom showing "Download Payslip"
   - 4 months are listed:
     * November 2025 (Net: ৳ 47,800)
     * October 2025 (Net: ৳ 47,800)
     * September 2025 (Net: ৳ 47,800)
     * August 2025 (Net: ৳ 47,800)
   - Each has a download icon
5. Click on any month (e.g., "November 2025")
6. **Expected Result:**
   - Loading indicator appears on that option
   - File downloads to device
   - Modal closes
   - Bot confirms: "✓ Payslip for November 2025 downloaded successfully."

**Edge cases to test:**
- Click "Cancel" button → Modal should close
- Tap outside modal → Modal should close
- Try downloading multiple payslips in sequence

---

### 3. Test Keyboard Handling ✅

**Steps:**
1. In the "ask FFL" tab
2. Tap on the input field
3. **Expected Result:**
   - Keyboard appears
   - Input field moves up appropriately
   - Chat messages remain visible
4. Type a long message (e.g., "What is my leave balance and how do I apply for annual leave?")
5. **Expected Result:**
   - Input field expands (multiline)
   - Character limit is 500 characters
6. Press the send button
7. **Expected Result:**
   - Message sends
   - Keyboard dismisses automatically
   - Chat scrolls to show new messages
   - Input field clears
8. **Test send button states:**
   - Empty input → Send button is gray/disabled
   - With text → Send button is cyan/enabled

**Edge cases:**
- Try typing while keyboard is open
- Send message using keyboard "send" button
- Switch between apps while keyboard is open

---

### 4. Test Brief Content with Citations ✅

**Test Case A: Leave Balance**
1. Type: `"What is my leave balance?"`
2. **Expected Result:**
   - Brief response: "Annual: 12 days, Sick: 8 days, Casual: 6 days."
   - Citation: "Source: Leave Policy" with "View SOP →" link
   - Response is concise (not verbose)

**Test Case B: Maternity Leave**
1. Type: `"How to apply maternity leave?"`
2. **Expected Result:**
   - Brief response: "16 weeks paid maternity leave (8 before, 8 after delivery). Submit via Leave module with medical docs."
   - Citation to "Maternity & Paternity" section
   - One-sentence answer (not a paragraph)

**Test Case C: SOP Queries**
1. Type: `"Where is the NDA template?"`
2. **Expected Result:**
   - Response shows document title
   - Shows 150-character excerpt (truncated with "...")
   - Full text NOT shown in chat
   - Citation with "View SOP →" link provided

**Comparison (Before vs After):**
- **Before:** Long responses with full SOP text
- **After:** Brief excerpts with citations and links

---

### 5. Test Agentic Flow for Document Signing ✅

**Scenario: User has pending documents to sign**

**Steps:**
1. Type: `"Start a new signing request"`
2. **Expected Result:**
   - Bot analyzes pending documents
   - Shows summary:
     ```
     You have 2 document(s) to sign:

     1. Policy Acknowledgement 2025 (High priority)
     2. Vendor NDA — Buyer X (Normal priority)

     Key points:
     • Review each document carefully
     • Check signee order and deadlines
     • I can auto-sign with your confirmation

     Proceed with signing?
     ```
3. Type: `"Yes"` or `"Proceed"` or `"Confirm"`
4. **Expected Result:**
   - Bot responds: "Signing documents..."
   - After 1.5 seconds:
   - Bot confirms: "✓ Processing signatures for 2 document(s)... All documents signed successfully! Check E-Sign tab for details."
   - Agentic flow ends

**Alternative responses:**
- Type: `"No"` or `"Cancel"`
- **Expected:** "Signing cancelled. You can review documents in the E-Sign tab."

**Edge Case: No pending documents**
1. Type: `"Start a new signing request"` (when no documents pending)
2. **Expected:** "No pending documents to sign. Navigate to E-Sign to create a new request."

**Key Features to Verify:**
- ✅ Multi-step conversation (bot remembers context)
- ✅ Document summary with priorities
- ✅ Key points highlighted
- ✅ User confirmation required
- ✅ Progress feedback
- ✅ Completion confirmation
- ✅ Graceful cancellation

---

## Additional Features to Test

### Auto-scroll Behavior
1. Have a long conversation (10+ messages)
2. Send a new message
3. **Expected:** Chat automatically scrolls to show the latest message

### Rotating Suggestions
1. Open the chat with no messages
2. Wait and observe the input placeholder
3. **Expected:** Placeholder text rotates through suggestions every 2 seconds

### Welcome Screen
1. Open the app for the first time (or clear chat)
2. **Expected:**
   - "Welcome" message
   - "Try a quick prompt:" text
   - 4 suggestion chips displayed
   - Tapping a chip fills the input field

### Modal Interactions
1. Open payslip modal
2. Tap outside the modal (on the dark overlay)
3. **Expected:** Modal closes
4. Open modal again
5. Click "Cancel" button
6. **Expected:** Modal closes

---

## Visual Checklist

### UI Elements Present:
- ✅ Header with "ask FFL — AI Assistant"
- ✅ Subtitle: "Brief answers • SOP citations • Agentic workflows"
- ✅ Chat messages with proper alignment (user right, bot left)
- ✅ Citations with "Source:" label
- ✅ Clickable "View SOP →" links in cyan color
- ✅ Input field with rotating placeholders
- ✅ Send button (cyan when enabled, gray when disabled)
- ✅ Payslip modal with proper styling
- ✅ Loading indicators during async operations

### Styling Consistency:
- ✅ Dark theme throughout (#0a0a0a background)
- ✅ Rounded corners on all cards/buttons
- ✅ Proper spacing and padding
- ✅ Readable text contrast
- ✅ Smooth animations

---

## Performance Checklist

- ✅ No lag when typing
- ✅ Smooth scrolling
- ✅ Fast response times (300ms delay is acceptable)
- ✅ No memory leaks (test with long conversations)
- ✅ Keyboard animations are smooth
- ✅ Modal transitions are smooth

---

## Accessibility Checklist

- ✅ Touch targets are large enough (minimum 44x44 points)
- ✅ Text is readable (proper contrast ratios)
- ✅ Interactive elements have visual feedback
- ✅ Loading states are indicated
- ✅ Error states are handled gracefully

---

## Known Limitations

1. **View SOP Navigation:** Currently navigates to KB tab but doesn't auto-open the specific document. Future enhancement: pass docId as navigation parameter.

2. **Agentic Flow:** Currently simulated. In production, would integrate with actual E-Sign API.

3. **Payslip Data:** Currently uses mock data (৳ 47,800 for all months). In production, would fetch from payroll API.

4. **Language Support:** Currently English only. Bangla support planned for future release.

---

## Regression Testing

After making changes, verify these still work:
- ✅ Leave balance query
- ✅ Clock-in issue query
- ✅ All existing SOP queries
- ✅ Suggestion chips
- ✅ Message sending
- ✅ Keyboard behavior

---

## Bug Reporting Template

If you find issues, report using this format:

**Issue Title:** [Brief description]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshots:**
[If applicable]

**Device Info:**
- OS: [iOS/Android]
- Version: [e.g., iOS 17.0]
- Device: [e.g., iPhone 14 Pro]

---

## Success Criteria

All 5 main issues should be resolved:
- ✅ View SOP flow is clickable and functional
- ✅ Download payslip shows options and works
- ✅ Keyboard behavior is smooth and predictable
- ✅ Content is brief with proper citations
- ✅ Agentic flow for document signing is implemented

Additional improvements:
- ✅ Auto-scroll to latest message
- ✅ Visual feedback for all interactions
- ✅ Consistent styling
- ✅ Error handling
- ✅ Loading states
