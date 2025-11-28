# E-Sign Demo Guide

## Quick Demo Script for Presentation

### 1. Show the Main Screen (30 seconds)
**What to highlight:**
- Point out the 4 tabs: "To Sign", "Sent", "Done", "History"
- Show the color-coded documents:
  - 🔴 Red border = Critical (due today)
  - 🟡 Yellow border = High priority (due within 3 days)
  - 🟢 Green border = Normal (more than 3 days)
- Point out profile pictures of signers on each card
- Show the search icon and + button

**Script:**
> "Here's our E-Sign dashboard. Notice how documents are color-coded by urgency - red means critical, yellow is high priority, and green gives you more time. You can see who needs to sign each document with their profile pictures right here."

### 2. Demo Search Functionality (30 seconds)
**Steps:**
1. Tap the search icon
2. Type "November" → shows all November documents
3. Clear and type "Finance" → shows Finance department docs
4. Clear and type a person's name → shows their documents

**Script:**
> "The search is really powerful. You can search by month, department, person's name, or even specific dates. Let me show you..."

### 3. Demo Document Details (45 seconds)
**Steps:**
1. Tap on any document card
2. Point out the document information section:
   - Document ID
   - Issuing person
   - Created date
   - Deadline
   - Signing order (Sequential/Parallel)
3. Scroll to show all signers with their:
   - Profile pictures
   - Names and designations
   - Status (pending/signed)
   - When they signed and how

**Script:**
> "When you tap a document, you get all the details. You can see who created it, when it's due, and the complete signing history. Notice how it shows when each person signed and which method they used - biometric, upload, or drawing."

### 4. Demo Signing Process (60 seconds)
**Steps:**
1. Find a document you can sign (green "Sign Document" button)
2. Tap "Sign Document"
3. Show the three signature method options:
   - **Biometric**: "Use your fingerprint"
   - **Upload**: "Upload your digital signature"
   - **Draw**: "Sign with stylus or finger"
4. Select "Biometric Signature"
5. Tap the fingerprint button
6. Show success message

**Script:**
> "When it's your turn to sign, you get three options. You can use biometric authentication with your fingerprint - the most secure option. Or upload a saved signature image. Or if you have a stylus or tablet, you can draw your signature directly. Let me use biometric..."

### 5. Demo Creating New Request (90 seconds)
**Steps:**
1. Tap the + button
2. Fill in the form:
   - Document name: "Q4 Marketing Budget"
   - Department: "Marketing"
   - Deadline: Pick a date 5 days from now
   - Priority: Select "High"
   - Signing order: Select "Sequential"
3. Tap "Select Signers"
4. Show the signer picker:
   - Point out profile pictures
   - Point out "X unsigned documents" indicator
   - Select 2-3 people
5. Tap "Done"
6. Show selected signers with order numbers
7. Tap "Upload Document" (simulate)
8. Tap "Create Request"
9. Show success message

**Script:**
> "Creating a new signing request is straightforward. You fill in the document details, set the deadline and priority level. Then you choose between sequential signing - where people must sign in order - or parallel, where everyone can sign at once. 
>
> When selecting signers, you can see how many pending documents each person has, which helps you avoid overloading anyone. The system automatically assigns order numbers for sequential signing.
>
> You can optionally upload the actual document - PDF or image. And that's it - the request is created and everyone gets notified."

### 6. Show History Tab (30 seconds)
**Steps:**
1. Tap "History" tab
2. Scroll through historical documents
3. Tap on an old document
4. Show completion date and all signatures

**Script:**
> "The History tab shows all documents you've signed in the past. This is your complete audit trail. You can search through it by date, month, or any other criteria. Each document shows when it was completed and how everyone signed it."

### 7. Show Sequential vs Parallel (30 seconds)
**Steps:**
1. Find a sequential document
2. Show how only the first person can sign
3. Find a parallel document
4. Show how everyone can sign simultaneously

**Script:**
> "Let me show you the difference between signing orders. In sequential mode, signers must go in order - person 2 can't sign until person 1 is done. This is great for approval chains. In parallel mode, everyone can sign at the same time, which is faster for acknowledgements."

## Key Points to Emphasize

### For Management:
- ✅ Complete audit trail of all signatures
- ✅ Color-coded urgency helps prioritize
- ✅ Historical data for compliance
- ✅ Flexible signing workflows (sequential/parallel)
- ✅ Multiple authentication methods for security

### For Users:
- ✅ Easy to see what needs your signature
- ✅ Quick search to find any document
- ✅ Profile pictures make it easy to recognize people
- ✅ Choose your preferred signing method
- ✅ Clear status indicators

### For IT/Security:
- ✅ Biometric authentication support
- ✅ Signature method tracking
- ✅ Complete timestamp records
- ✅ Document upload capability
- ✅ User-friendly interface reduces support calls

## Common Questions & Answers

**Q: Can I sign on behalf of someone else?**
A: No, each person must sign with their own credentials for security and legal compliance.

**Q: What happens if I miss a deadline?**
A: The document turns red (critical) and you'll see it prominently in your "To Sign" list. Reminders would be sent (in production).

**Q: Can I change the signing order after creating a request?**
A: In this demo, no. In production, the creator could modify before anyone signs.

**Q: What file types can be uploaded?**
A: PDF and common image formats (PNG, JPG). The actual implementation would validate file types.

**Q: Is the signature legally binding?**
A: With proper backend integration and compliance measures, yes. This demo shows the UI/UX flow.

**Q: Can I see who hasn't signed yet?**
A: Yes, in the document details, pending signers are clearly marked with yellow "pending" status.

**Q: How far back does the history go?**
A: Indefinitely. You can search by month or year to find old documents.

## Demo Tips

1. **Start with a clean state**: Make sure you're logged in as a user with pending documents
2. **Have examples ready**: Know which documents to show for each scenario
3. **Practice the flow**: Run through it 2-3 times before the actual demo
4. **Prepare for questions**: Have answers ready for common concerns
5. **Show mobile-friendly**: If possible, demo on an actual mobile device
6. **Highlight colors**: Make sure the urgency colors are visible on the display
7. **Emphasize ease of use**: Point out how few taps it takes to complete tasks

## Troubleshooting During Demo

**If search doesn't work:**
- Make sure you're typing in the search box that appears after tapping the search icon
- Try a simpler search term like just "HR" or "2024"

**If you can't sign a document:**
- Check if it's a sequential document and you're not first in line
- Make sure you're in the "To Sign" tab
- Verify the document isn't already signed by you

**If the + button doesn't work:**
- Make sure you're not in a modal already
- Try closing any open modals first

**If colors don't show:**
- The colors are based on deadline dates - make sure the sample data has varied deadlines
- Check that the device display is showing colors properly
