# E-Sign Sample Data Reference

## Available Documents for Demo

### Active Documents (Pending Signatures)

#### 1. Policy Acknowledgement 2025
- **ID**: ES-100
- **Department**: Compliance
- **Issuing Person**: Ayesha Rahman
- **Priority**: High (Yellow)
- **Deadline**: 3 days from now
- **Signing Order**: Sequential
- **Status**: Pending
- **Signers**: 
  1. Fuad Tasrim Hossain (Pending)
  2. Ayesha Rahman (Pending)
- **Use for**: Showing sequential signing, high priority

#### 2. Vendor NDA — Buyer X
- **ID**: ES-101
- **Department**: Legal
- **Issuing Person**: Fuad Tasrim Hossain
- **Priority**: Normal (Green)
- **Deadline**: 7 days from now
- **Signing Order**: Sequential
- **Status**: Partially signed
- **Signers**: 
  1. Fuad Tasrim Hossain (✓ Signed via biometric)
  2. Ayesha Rahman (Pending)
- **Use for**: Showing partially completed sequential document

#### 3. Q3 Capital Expenditure Request
- **ID**: ES-090
- **Department**: Finance
- **Issuing Person**: Ayesha Rahman
- **Priority**: Critical (Red)
- **Deadline**: 1 day ago (OVERDUE)
- **Signing Order**: Parallel
- **Status**: Completed
- **Signers**: 
  1. Ayesha Rahman (✓ Signed via draw)
  2. Fuad Tasrim Hossain (✓ Signed via biometric)
- **Use for**: Showing completed document, overdue status, parallel signing

#### 4. Equipment Lease Agreement - Sewing Machines
- **ID**: ES-095
- **Department**: Operations
- **Issuing Person**: Fuad Tasrim Hossain
- **Priority**: Normal (Green)
- **Deadline**: 14 days from now
- **Signing Order**: Sequential
- **Status**: Pending
- **Signers**: 
  1. Fuad Tasrim Hossain (Pending)
  2. Ayesha Rahman (Pending)
- **Use for**: Showing normal priority, plenty of time

#### 5. Annual Performance Review - Team Acknowledgement
- **ID**: ES-088
- **Department**: HR
- **Issuing Person**: Ayesha Rahman
- **Priority**: High (Yellow)
- **Deadline**: 5 days from now
- **Signing Order**: Parallel
- **Status**: Pending
- **Signers**: 
  1. Fuad Tasrim Hossain (Pending)
  2. Ayesha Rahman (Pending)
- **Use for**: Showing parallel signing option

### Historical Documents (Completed)

#### 6. Employee Handbook 2024 Acknowledgement
- **ID**: ES-075
- **Department**: HR
- **Issuing Person**: Ayesha Rahman
- **Priority**: Normal
- **Deadline**: 30 days ago
- **Completed**: 32 days ago
- **Signing Order**: Parallel
- **Signers**: 
  1. Fuad Tasrim Hossain (✓ Signed via upload - 35 days ago)
  2. Ayesha Rahman (✓ Signed via biometric - 32 days ago)
- **Use for**: Showing history, upload signature method

#### 7. Q2 Budget Approval
- **ID**: ES-062
- **Department**: Finance
- **Issuing Person**: Ayesha Rahman
- **Priority**: High
- **Deadline**: 60 days ago
- **Completed**: 58 days ago
- **Signing Order**: Sequential
- **Signers**: 
  1. Ayesha Rahman (✓ Signed via biometric - 62 days ago)
  2. Fuad Tasrim Hossain (✓ Signed via draw - 58 days ago)
- **Use for**: Showing older history, sequential completion

#### 8. Safety Training Certificate - October 2024
- **ID**: ES-048
- **Department**: Safety & Compliance
- **Issuing Person**: Fuad Tasrim Hossain
- **Priority**: Normal
- **Deadline**: 90 days ago
- **Completed**: 88 days ago
- **Signing Order**: Parallel
- **Signers**: 
  1. Fuad Tasrim Hossain (✓ Signed via biometric - 90 days ago)
  2. Ayesha Rahman (✓ Signed via biometric - 88 days ago)
- **Use for**: Showing very old history, both used biometric

## Search Test Cases

### By Department
- Search "HR" → Shows: ES-100, ES-088, ES-075
- Search "Finance" → Shows: ES-090, ES-062
- Search "Legal" → Shows: ES-101
- Search "Operations" → Shows: ES-095
- Search "Compliance" → Shows: ES-100, ES-048

### By Month
- Search "November" → Shows current month documents
- Search "October" → Shows ES-048
- Search "September" → Shows ES-062 (if in date range)

### By Year
- Search "2024" → Shows historical documents
- Search "2025" → Shows current documents

### By Person
- Search "Fuad" → Shows all documents with Fuad as signer or issuer
- Search "Ayesha" → Shows all documents with Ayesha as signer or issuer

### By Document Type
- Search "Budget" → Shows: ES-090, ES-062
- Search "NDA" → Shows: ES-101
- Search "Policy" → Shows: ES-100
- Search "Training" → Shows: ES-048

### By Status/Priority
- Search "Sequential" → Shows sequential documents
- Search "Parallel" → Shows parallel documents

### By Document ID
- Search "ES-100" → Shows exact document
- Search "ES-0" → Shows all documents starting with ES-0

## Tab Filtering Results

### "To Sign" Tab
Shows documents where current user has pending signature:
- ES-100 (if you're Fuad or Ayesha)
- ES-101 (if you're Ayesha - Fuad already signed)
- ES-095 (if you're Fuad or Ayesha)
- ES-088 (if you're Fuad or Ayesha)

### "Sent" Tab
Shows documents created by current user:
- If logged in as Ayesha: ES-100, ES-090, ES-088, ES-075, ES-062
- If logged in as Fuad: ES-101, ES-095, ES-048

### "Done" Tab
Shows all completed documents:
- ES-090
- ES-075
- ES-062
- ES-048

### "History" Tab
Shows all documents current user has signed:
- All documents where current user's status is "signed"

## Signature Methods Used

### Biometric (Most Common)
- ES-101: Fuad
- ES-090: Fuad
- ES-075: Ayesha
- ES-062: Ayesha
- ES-048: Both Fuad and Ayesha

### Upload
- ES-075: Fuad

### Draw
- ES-090: Ayesha
- ES-062: Fuad

## Priority Distribution

### Critical (Red)
- ES-090 (overdue)

### High (Yellow)
- ES-100 (3 days)
- ES-088 (5 days)

### Normal (Green)
- ES-101 (7 days)
- ES-095 (14 days)
- All historical documents

## Signing Order Distribution

### Sequential
- ES-100
- ES-101
- ES-095
- ES-062

### Parallel
- ES-090
- ES-088
- ES-075
- ES-048

## Demo Scenarios

### Scenario 1: Urgent Signing
1. Go to "To Sign" tab
2. See ES-090 in red (critical/overdue)
3. Open it and show it's already completed
4. Show ES-100 in yellow (high priority, 3 days left)
5. Sign it using biometric method

### Scenario 2: Sequential Workflow
1. Open ES-101
2. Show Fuad already signed (first in sequence)
3. If you're Ayesha, you can now sign
4. If you're Fuad, show you can't sign again

### Scenario 3: Parallel Workflow
1. Open ES-088
2. Show both signers can sign simultaneously
3. Sign as current user
4. Show the other person can still sign

### Scenario 4: Creating New Request
1. Tap + button
2. Create "Q4 Marketing Budget"
3. Set deadline 5 days out (will be yellow)
4. Choose 2-3 signers
5. Select Sequential order
6. Upload document (simulate)
7. Create and show in "Sent" tab

### Scenario 5: Historical Lookup
1. Go to "History" tab
2. Search "October" or "2024"
3. Open ES-048 from 90 days ago
4. Show complete signing history
5. Show both used biometric method

### Scenario 6: Department Search
1. Tap search icon
2. Type "Finance"
3. Show ES-090 and ES-062
4. Open each to show different priorities and dates

## Employee Data Available

### Fuad Tasrim Hossain
- **ID**: FFL-1001
- **Designation**: Senior Merchandiser
- **Department**: Merchandising
- **Avatar**: Has profile picture

### Ayesha Rahman
- **ID**: FFL-1020
- **Designation**: HR Officer
- **Department**: HR & Admin
- **Avatar**: Has profile picture

## Color Coding Reference

### Urgency Colors
- **Red (#ef4444)**: 0 days or overdue
- **Yellow (#f59e0b)**: 1-3 days remaining
- **Green (#10b981)**: 4+ days remaining

### Status Colors
- **Pending**: Yellow (#f59e0b)
- **Signed**: Green (#10b981)
- **Overdue**: Red (#ef4444)
- **Completed**: Green (#10b981)

## Tips for Demo

1. **Start logged in as Fuad** - He has a good mix of pending and completed documents
2. **Show ES-090 first** - It's red/critical and demonstrates urgency
3. **Use ES-101 for sequential** - It's partially signed, perfect example
4. **Use ES-088 for parallel** - Both can sign simultaneously
5. **Create a new document** - Shows the full workflow
6. **End with history search** - Shows the audit trail capability
