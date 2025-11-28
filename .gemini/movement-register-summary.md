# Movement Register Feature - Implementation Summary

## Overview
Implemented a comprehensive Movement Register system in the Attendance page that allows employees to request permission to leave the factory premises, with approval workflow and historical tracking.

## Key Features Implemented

### 1. Movement Register Request Form

Employees can submit movement requests with the following fields:

#### Required Fields:
- **Date** *: Date of movement (today or future date)
  - DatePicker component with calendar interface
  - Minimum date: Today (cannot select past dates)
  - Can request for today or schedule for future dates
  
- **Departure Time** *: When leaving the factory
  - TimePicker component with scrollable hour/minute selection
  - 24-hour format (00:00 - 23:59)
  - Easy selection with visual interface
  
- **Expected Return Time** *: When planning to return
  - TimePicker component with scrollable hour/minute selection
  - 24-hour format (00:00 - 23:59)
  - Must be after departure time
  
- **Destination** *: Where the employee is going
  - Text input
  - Examples: "Buyer Office - Gulshan", "Bank - Motijheel"
  
- **Purpose** *: Reason for leaving premises
  - Multi-line text area
  - Detailed explanation required
  - Examples: "Meeting with buyer", "LC documentation"

#### Auto-Filled Fields:
- **Employee ID**: From current user profile
- **Employee Name**: From current user profile
- **Employee Department**: From current user profile
- **Submitted On**: Current date (auto-generated)
- **Division Head**: Assigned approver

### 2. Approval Workflow

**Status Flow**:
1. **Pending** (Yellow) - Awaiting division head approval
2. **Approved** (Green) - Division head approved, can proceed
3. **Rejected** (Red) - Division head rejected the request
4. **Completed** (Blue) - Movement completed, returned to factory

**Approval Process**:
- Request submitted by employee
- Division Head receives push notification (simulated)
- Division Head reviews request details
- Division Head approves or rejects
- Employee receives notification of decision
- Upon return, status updated to "Completed"

### 3. Movement Register History

**Unified Requests View**:
- Single "Requests" button shows all requests
- Tabbed interface with two tabs:
  - **QS Attendance**: Attendance correction requests
  - **Movement Register**: Movement/exit requests
- Easy switching between request types

**View All Movement Requests**:
- Complete list of all movement requests
- Filtered by current user
- Sorted by date (newest first)
- Shows all statuses

**Information Displayed**:
- Request ID (e.g., MR-001)
- Status badge (color-coded)
- Date of movement
- Departure and return times
- Actual return time (if completed)
- Destination
- Purpose/reason
- Submission date
- Approval details (who approved, when)

### 4. Quick Access Buttons

Added to the Attendance screen action row:
- **Calendar**: View attendance calendar
- **QS Request**: Quick attendance correction
- **Movement**: Create new movement request
- **Requests**: View all requests (QS + Movement)

### 5. Color-Coded Status System

**Pending** (Yellow):
- Background: Light yellow tint
- Border: Yellow
- Text: Yellow
- Meaning: Awaiting approval

**Approved** (Green):
- Background: Light green tint
- Border: Green
- Text: Green
- Meaning: Approved, can proceed

**Rejected** (Red):
- Background: Light red tint
- Border: Red
- Text: Red
- Meaning: Request denied

**Completed** (Blue):
- Background: Light blue tint
- Border: Blue
- Text: Blue
- Meaning: Movement completed, returned

### 6. Division Head Features (For Future Implementation)

**Division Head Dashboard** (Conceptual):
- View all subordinate movement requests
- Filter by status (pending/approved/rejected)
- Approve/reject with one tap
- Add approval notes
- View team movement schedule
- Push notifications for new requests

**Subordinate Request List**:
- Shows all team members' requests
- Grouped by status
- Quick approve/reject actions
- View employee details
- See movement patterns

## Sample Data

### Movement Request 1 - Completed
```
ID: MR-001
Employee: Fuad Tasrim Hossain (Merchandising)
Date: 2025-11-29
Departure: 14:00
Expected Return: 16:00
Actual Return: 15:45
Destination: Buyer Office - Gulshan
Purpose: Meeting with buyer to discuss Q1 2026 orders
Status: Completed
Submitted: 2025-11-28
Approved By: Division Head on 2025-11-28
```

### Movement Request 2 - Pending
```
ID: MR-002
Employee: Fuad Tasrim Hossain (Merchandising)
Date: 2025-11-30
Departure: 10:00
Expected Return: 12:00
Destination: Bank - Motijheel
Purpose: LC documentation and payment processing
Status: Pending
Submitted: 2025-11-29
```

### Movement Request 3 - Approved
```
ID: MR-003
Employee: Ayesha Rahman (HR & Admin)
Date: 2025-12-01
Departure: 09:00
Expected Return: 11:00
Destination: Training Center - Dhanmondi
Purpose: Attend HR compliance training session
Status: Approved
Submitted: 2025-11-29
Approved By: Division Head on 2025-11-29
```

### Movement Request 4 - Completed (Historical)
```
ID: MR-004
Employee: Fuad Tasrim Hossain (Merchandising)
Date: 2025-11-27
Departure: 11:00
Expected Return: 13:00
Actual Return: 13:15
Destination: Fabric Supplier - Tejgaon
Purpose: Quality inspection of new fabric shipment
Status: Completed
Submitted: 2025-11-26
Approved By: Division Head on 2025-11-26
```

## Technical Implementation

### Files Modified:

1. **types/index.ts**
   - Added MovementRegister interface
   - Includes all required fields
   - Status type definition

2. **constants/Data.ts**
   - Added MOVEMENT_REGISTERS array
   - 4 sample movement requests
   - Mix of statuses for demo

3. **app/(tabs)/attendance.tsx**
   - Added movement register state management
   - Created movement request form modal
   - Created movement history list modal
   - Added LogOut icon for movement button
   - Implemented form validation
   - Added submission handler
   - Enhanced action buttons row

### New Components:

**Movement Register Modal**:
- Full-screen modal with form
- Date input field
- Two time pickers (departure/return)
- Destination text input
- Purpose text area
- Submit and cancel buttons
- Form validation

**Movement History Modal**:
- Scrollable list of requests
- Color-coded status badges
- Detailed information display
- Grouped by employee
- Close button

### Styling:

**Movement Card**:
- Dark background with border
- Left accent border (brand color)
- Status badge in header
- Information rows with labels
- Purpose text highlighted
- Metadata at bottom

**Status Badges**:
- Rounded corners
- Colored background and border
- Icon + text
- Consistent sizing

## User Flow

### Submitting a Movement Request:

1. **Access Form**:
   - Tap "Movement" button in actions row
   - Modal slides up with form

2. **Fill Information**:
   - Enter date (today or future)
   - Select departure time
   - Select expected return time
   - Type destination
   - Describe purpose in detail

3. **Submit**:
   - Tap "Submit Request"
   - Validation runs
   - Request created with "Pending" status
   - Success message shown
   - Notification sent to Division Head

4. **Wait for Approval**:
   - Request appears in history as "Pending"
   - Division Head reviews
   - Receives notification when approved/rejected

5. **Proceed with Movement**:
   - If approved, can leave at specified time
   - If rejected, request new time or reason

6. **Return**:
   - Upon return, status updated to "Completed"
   - Actual return time recorded

### Viewing Movement History:

1. **Access History**:
   - Tap "Requests" button
   - Modal shows all movement requests

2. **Review Requests**:
   - See all your requests
   - Check status of each
   - View approval details
   - See completed movements

3. **Filter by Status**:
   - Pending: Awaiting approval
   - Approved: Can proceed
   - Rejected: Need to resubmit
   - Completed: Past movements

## Benefits

### For Employees:
- ✅ Easy to request permission to leave
- ✅ Can schedule future movements
- ✅ Clear approval status
- ✅ Complete history tracking
- ✅ No need for paper forms

### For Division Heads:
- ✅ Centralized approval system
- ✅ See all team movements
- ✅ Quick approve/reject
- ✅ Track team whereabouts
- ✅ Push notifications for requests

### For Organization:
- ✅ Digital record of all movements
- ✅ Better security tracking
- ✅ Audit trail for compliance
- ✅ Data for analysis
- ✅ Reduced paperwork

## Push Notification System (Conceptual)

### For Employees:
**New Request Submitted**:
```
Title: Movement Request Submitted
Body: Your movement request for [Date] has been submitted to [Division Head] for approval.
Action: View Request
```

**Request Approved**:
```
Title: Movement Request Approved ✓
Body: Your movement to [Destination] on [Date] has been approved.
Action: View Details
```

**Request Rejected**:
```
Title: Movement Request Rejected
Body: Your movement request for [Date] was not approved. Please contact your Division Head.
Action: View Details
```

### For Division Heads:
**New Request Received**:
```
Title: New Movement Request
Body: [Employee Name] requests to leave on [Date] at [Time] to [Destination]
Actions: Approve | Reject | View Details
```

**Pending Requests Reminder**:
```
Title: Pending Movement Requests
Body: You have [X] pending movement requests awaiting approval.
Action: Review Requests
```

## Division Head Dashboard (Future Enhancement)

### Features to Implement:

1. **Request Queue**:
   - List of all pending requests
   - Sorted by urgency (date/time)
   - Quick approve/reject buttons
   - Batch approval option

2. **Team Schedule**:
   - Calendar view of team movements
   - See who's out when
   - Identify conflicts
   - Plan coverage

3. **Approval Actions**:
   - One-tap approve
   - One-tap reject with reason
   - Request more information
   - Suggest alternative time

4. **Analytics**:
   - Most common destinations
   - Average movement duration
   - Approval rate
   - Team movement patterns

5. **Notifications**:
   - Real-time push notifications
   - Email summaries
   - SMS for urgent requests
   - In-app notification center

## Validation Rules

- **Date**: Required, must be today or future date
- **Departure Time**: Required, valid time format
- **Return Time**: Required, must be after departure time
- **Destination**: Required, non-empty string
- **Purpose**: Required, minimum 10 characters
- **Employee Info**: Auto-filled from profile
- **Status**: Auto-set to "pending"
- **ID**: Auto-generated (MR-XXX format)

## Demo Tips

1. **Show the button**: Point out the new "Movement" button
2. **Open the form**: Demonstrate the clean, organized layout
3. **Fill an example**: Create a movement request for tomorrow
4. **Select times**: Show the time picker interface
5. **Submit**: Show the success message
6. **View history**: Open the requests list
7. **Point out statuses**: Show different colored badges
8. **Explain workflow**: Describe the approval process

## Future Enhancements (Not Implemented)

- Real push notifications
- Division Head approval interface
- Geofencing for return verification
- Photo/document attachment
- Movement templates (common destinations)
- Recurring movement requests
- Team calendar view
- Export movement reports
- Integration with security system
- SMS notifications
- Email notifications
- Movement analytics dashboard
- Approval delegation
- Emergency movement requests
- Movement history export

## Testing Checklist

- [ ] Can open movement request form
- [ ] All fields are editable
- [ ] Time pickers work correctly
- [ ] Form validation prevents empty submission
- [ ] Request appears in history after submission
- [ ] Status badges display correctly
- [ ] Color coding works for all statuses
- [ ] Can view all personal requests
- [ ] Completed requests show actual return time
- [ ] Approval details display when approved
- [ ] Form resets after submission
- [ ] Can submit multiple requests
- [ ] Future dates are accepted
- [ ] Past dates are rejected (if validation added)

## Integration Points

### With Attendance System:
- Movement time excluded from attendance calculation
- Approved movements don't count as absence
- Return time verification

### With Security System:
- Gate pass generation
- Entry/exit logging
- Visitor management integration

### With HR System:
- Leave balance checking
- Overtime calculation
- Performance tracking

### With Notification System:
- Push notifications
- Email alerts
- SMS notifications

## Summary

The Movement Register feature provides a complete digital solution for managing employee movements outside factory premises. With an intuitive request form, approval workflow, status tracking, and comprehensive history, it streamlines the process while maintaining security and accountability. The system is ready for demo and can be extended with real-time notifications and division head approval interface for production use.
