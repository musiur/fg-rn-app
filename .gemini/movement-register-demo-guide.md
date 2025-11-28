# Movement Register - Quick Demo Guide

## 30-Second Demo Script

### Step 1: Show the Feature (5 seconds)
**Action**: Navigate to Attendance screen

**What to highlight**:
- Point out the 4 action buttons
- Highlight the new "Movement" button with LogOut icon
- Mention the "Requests" button shows all movement history

**Script**:
> "In the Attendance screen, we've added a Movement Register feature. Employees can request permission to leave the factory premises using this Movement button."

### Step 2: Create Movement Request (15 seconds)
**Action**: Tap "Movement" button

**What to fill**:
1. **Date**: Tap date picker, select tomorrow from calendar
2. **Departure Time**: Tap time picker, scroll to "10:00", confirm
3. **Return Time**: Tap time picker, scroll to "12:00", confirm
4. **Destination**: Type "Client Office - Gulshan"
5. **Purpose**: Type "Meeting with client to discuss new order requirements"

**Script**:
> "Let me create a movement request. I'll schedule it for tomorrow at 10 AM, going to a client office in Gulshan. I'll be back by noon. The purpose is a client meeting. Submit - and it's sent to my Division Head for approval."

### Step 3: View History (10 seconds)
**Action**: Tap "Requests" button

**What to highlight**:
- Show the tabbed interface with "QS Attendance" and "Movement Register" tabs
- Tap "Movement Register" tab
- Show the newly created request (Pending - Yellow)
- Point out an approved request (Green)
- Show a completed request (Blue) with actual return time
- Mention all details are visible

**Script**:
> "The Requests button shows all my requests in one place. There are two tabs - QS Attendance for attendance corrections, and Movement Register for leaving the factory. Here's my movement history. The new request is pending approval. This one was approved, and this completed one shows I returned on time. My Division Head can see all these requests and approve them with push notifications."

---

## Detailed Demo Flow (For Longer Presentations)

### Part 1: Introduction (1 minute)

**Context**:
"In a factory environment, employees sometimes need to leave the premises for business purposes - meeting clients, bank visits, supplier meetings, etc. Previously, this was managed with paper forms and manual approvals. Now it's digital."

**Benefits**:
- No paper forms
- Instant submission
- Push notifications to approvers
- Complete digital trail
- Easy to track who's out when

### Part 2: Creating a Movement Request (3 minutes)

1. **Access the Form**:
   - Show the Attendance screen
   - Point out the 4 action buttons
   - Tap "Movement" button
   - Modal slides up

2. **Explain the Form**:
   - "Notice how my name and department are already filled"
   - "This ensures accountability"

3. **Fill Date**:
   - Tap the date picker button
   - Calendar modal opens
   - Select tomorrow's date from the calendar
   - Explain: "You can request for today or schedule for future dates"
   - Note: "Past dates are disabled - you can only select today or future"

4. **Select Departure Time**:
   - Tap the time picker button
   - Scrollable hour and minute pickers appear
   - Scroll to select "10" for hour
   - Scroll to select "00" for minutes
   - Tap "Confirm"
   - Explain: "When you plan to leave the factory"

5. **Select Return Time**:
   - Tap the time picker button
   - Scrollable hour and minute pickers appear
   - Scroll to select "12" for hour
   - Scroll to select "00" for minutes
   - Tap "Confirm"
   - Explain: "When you expect to be back"
   - Note: "System can validate this is after departure time"

6. **Enter Destination**:
   - Type "Client Office - Gulshan"
   - Explain: "Be specific about where you're going"
   - Examples: "Bank - Motijheel", "Buyer Office - Banani"

7. **Describe Purpose**:
   - Type: "Meeting with client to discuss new order requirements and sample approval for Q1 2026 collection"
   - Explain: "Detailed explanation helps approvers make decisions"

8. **Submit**:
   - Tap "Submit Request"
   - Show validation (if you try empty, it shows error)
   - Success message appears
   - Explain: "Division Head receives push notification immediately"

### Part 3: Viewing Movement History (2 minutes)

1. **Access History**:
   - Tap "Requests" button
   - Modal opens with tabbed interface
   - Two tabs: "QS Attendance" and "Movement Register"
   - Tap "Movement Register" tab to see movement requests

2. **Walk Through a Request Card**:
   - Point to Request ID (MR-001)
   - Show status badge (Completed - Blue)
   - Read date and times
   - Show actual return time: "15:45"
   - Read destination: "Buyer Office - Gulshan"
   - Read purpose
   - Show approval details: "Approved by Division Head on 2025-11-28"

3. **Compare Different Statuses**:
   - **Pending** (Yellow): "Awaiting Division Head approval"
   - **Approved** (Green): "Approved, can proceed with movement"
   - **Completed** (Blue): "Movement completed, returned to factory"
   - **Rejected** (Red): "Request denied, need to resubmit"

4. **Show the New Request**:
   - Scroll to top
   - Point out the newly created request
   - Status: Pending (Yellow)
   - All information is displayed

### Part 4: Division Head Workflow (2 minutes)

**Explain the Approval Process**:

1. **Notification Received**:
   - "Division Head gets push notification"
   - Shows: Employee name, date, time, destination
   - Actions: Approve, Reject, View Details

2. **Review Request**:
   - Division Head opens notification
   - Sees full request details
   - Checks:
     - Is the purpose valid?
     - Is the timing appropriate?
     - Are there conflicts with other work?
     - Is the destination reasonable?

3. **Make Decision**:
   - Tap "Approve" or "Reject"
   - If rejecting, can add reason
   - Decision is instant

4. **Employee Notified**:
   - Employee receives notification
   - "Your movement request has been approved"
   - Can proceed with planned movement

5. **On Return**:
   - Employee returns to factory
   - Clocks in or marks return
   - Status updated to "Completed"
   - Actual return time recorded

### Part 5: Use Cases (1 minute)

**Common Scenarios**:

1. **Client Meetings**:
   ```
   Destination: Buyer Office - Gulshan
   Purpose: Discuss Q1 orders and sample approval
   Time: 2 hours
   ```

2. **Bank Visits**:
   ```
   Destination: Bank - Motijheel
   Purpose: LC documentation and payment processing
   Time: 2 hours
   ```

3. **Supplier Visits**:
   ```
   Destination: Fabric Supplier - Tejgaon
   Purpose: Quality inspection of new shipment
   Time: 2 hours
   ```

4. **Training**:
   ```
   Destination: Training Center - Dhanmondi
   Purpose: Attend HR compliance training
   Time: 2 hours
   ```

5. **Government Offices**:
   ```
   Destination: BGMEA Office - Karwan Bazar
   Purpose: Submit compliance documents
   Time: 3 hours
   ```

---

## Demo Scenarios

### Scenario 1: Urgent Bank Visit
```
Date: Today
Departure: 11:00
Return: 13:00
Destination: Bank - Motijheel
Purpose: Urgent LC payment deadline today. Need to submit documents before 2 PM.
Expected: Quick approval due to urgency
```

### Scenario 2: Scheduled Client Meeting
```
Date: Next Monday
Departure: 10:00
Return: 15:00
Destination: Buyer Office - Banani
Purpose: Quarterly review meeting with buyer. Discuss upcoming season orders and pricing.
Expected: Approved in advance
```

### Scenario 3: Half-Day Training
```
Date: Next Friday
Departure: 09:00
Return: 13:00
Destination: Training Center - Dhanmondi
Purpose: Mandatory compliance training session organized by HR department.
Expected: Pre-approved by HR
```

---

## Key Points to Emphasize

### For Employees:
- ✅ No more paper forms
- ✅ Submit from anywhere
- ✅ Instant notification to approver
- ✅ Track approval status
- ✅ Complete history available
- ✅ Can schedule in advance

### For Division Heads:
- ✅ Push notifications for new requests
- ✅ All information in one place
- ✅ Quick approve/reject
- ✅ See team schedule
- ✅ Track who's out when
- ✅ Digital audit trail

### For Organization:
- ✅ Better security tracking
- ✅ Compliance documentation
- ✅ Data for analysis
- ✅ Reduced paperwork
- ✅ Faster approvals
- ✅ Complete audit trail

---

## Common Questions & Answers

**Q: Can I request for today?**
A: Yes, you can request for today or any future date. For urgent same-day requests, your Division Head will receive an immediate notification.

**Q: What if my Division Head doesn't approve in time?**
A: In production, there would be escalation rules. After X hours, it could auto-escalate to the next level or send reminder notifications.

**Q: Can I cancel a request?**
A: Not in this demo version, but in production, you could cancel pending requests. Approved requests would need Division Head approval to cancel.

**Q: What if I return late?**
A: The system records your actual return time. If significantly late, it could trigger a notification to your Division Head.

**Q: Can I see my team's movements?**
A: Division Heads can see all their subordinates' movements. Regular employees see only their own requests.

**Q: Is there a limit on how many requests I can make?**
A: No hard limit, but excessive requests might be flagged for review by HR or management.

**Q: What if I forget to submit a request?**
A: You can submit a retroactive request with explanation, but it requires special approval and may be flagged.

**Q: Can I attach documents?**
A: Not in this version, but future enhancement could allow attaching meeting invitations, client emails, etc.

---

## Troubleshooting During Demo

**If form won't submit**:
- Check all required fields are filled
- Verify date format is correct (YYYY-MM-DD)
- Ensure return time is after departure time
- Make sure purpose is not empty

**If time picker doesn't work**:
- Tap directly on the time picker button
- Select hours and minutes
- Confirm selection

**If history doesn't show**:
- Make sure you're viewing the correct user's requests
- Check if any requests exist
- Try closing and reopening the modal

---

## Demo Checklist

Before starting:
- [ ] App is open to Attendance screen
- [ ] Know what movement request to create
- [ ] Have destination and purpose ready
- [ ] Sample data is loaded
- [ ] Device is charged
- [ ] Screen is visible to audience

During demo:
- [ ] Show all 4 action buttons
- [ ] Highlight the Movement button
- [ ] Fill form completely
- [ ] Show time pickers working
- [ ] Submit successfully
- [ ] Open history immediately
- [ ] Point out different statuses
- [ ] Explain approval workflow

After demo:
- [ ] Show the submitted request in history
- [ ] Explain Division Head notifications
- [ ] Summarize benefits
- [ ] Take questions
- [ ] Offer to show again if needed

---

## Pro Tips

1. **Practice the flow**: Run through it 2-3 times before presenting
2. **Have realistic data**: Use actual destinations and purposes from your industry
3. **Show the colors**: Make sure status badges are clearly visible
4. **Explain the workflow**: Don't just show the UI, explain the business process
5. **Mention notifications**: Even though they're simulated, explain how they'd work
6. **Compare to old process**: Highlight how much better this is than paper forms
7. **Show completed requests**: Demonstrate the full lifecycle
8. **Be ready for questions**: Know the approval workflow inside out

---

## Integration Story

**Before (Paper-based)**:
1. Employee fills paper form
2. Walks to Division Head's office
3. Waits for signature
4. Submits to security
5. Gets gate pass
6. Leaves factory
7. Returns, signs back in
8. Paper filed somewhere

**After (Digital)**:
1. Employee submits request from phone
2. Division Head gets notification
3. Approves with one tap
4. Employee gets notification
5. Security sees approval in system
6. Employee leaves factory
7. Returns, system records time
8. Complete digital record

**Time Saved**: 15-20 minutes per request
**Paper Saved**: 100% digital
**Approval Speed**: Instant vs hours/days
**Tracking**: Complete vs partial
**Audit Trail**: Perfect vs incomplete
