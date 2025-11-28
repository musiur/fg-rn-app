export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  joinDate: string;
  phone: string;
  emergency: string;
  shift: string;
  leaveBalance: {
    annual: number;
    sick: number;
    casual: number;
  };
  biometricsEnabled: boolean;
  avatar?: string;
  medical?: {
    bloodGroup: string;
    allergies: string[];
    insuranceId: string;
    lastCheckup: string;
  };
}

export interface KBDocument {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  ownerDept?: string;
  excerpt: string;
  chunks?: {
    id: string;
    heading: string;
    text: string;
  }[];
}

export interface AttendanceRecord {
  date: string;
  status: "Present" | "Absent" | "Late";
  clockIn: string;
  clockOut: string;
  late: boolean;
}

export interface ESignDocument {
  id: string;
  title: string;
  dept: string;
  issuingPerson?: string;
  issuingPersonId?: string;
  emergency: "Normal" | "High" | "Critical";
  deadline: string;
  route: "Sequential" | "Parallel";
  owner: string;
  kbId?: string;
  createdAt: string;
  hasDocument: boolean;
  documentUrl?: string;
  signers: ESignSigner[];
  completedAt?: string;
  urgencyColor?: "red" | "yellow" | "green";
  signatureMethod?: "biometric" | "upload" | "draw";
}

export interface ESignSigner {
  id: string;
  name: string;
  designation: string;
  avatar?: string;
  status: "pending" | "signed" | "rejected";
  signedAt?: string;
  order?: number;
  hasSigningAuthority?: boolean;
  signatureMethod?: "biometric" | "upload" | "draw";
}

export interface LeaveRequest {
  id: string;
  type: string;
  from: string;
  to: string;
  status: "pending" | "approved" | "rejected";
}

export interface Complaint {
  id: string;
  subject: string;
  category: string;
  status: "pending" | "resolved";
  date: string;
  priority: "Low" | "Medium" | "High";
  description?: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  text: string;
  cite?: {
    docId: string;
    heading: string;
  };
}

export interface ChatThread {
  id: string;
  title: string;
  folderId: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface ChatFolder {
  id: string;
  name: string;
}

export interface Issue {
  id: string;
  userName: string;
  userDepartment: string;
  issueDepartment: string;
  issueArea: string;
  description: string;
  importance: "low" | "moderate" | "high";
  date: string;
  status: "open" | "resolved";
}

export interface QSAttendanceRequest {
  id: string;
  date: string;
  requestedClockIn: string;
  requestedClockOut: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedOn: string;
  approvedBy?: string;
  approvedOn?: string;
}

export interface AppNotification {
  id: string;
  type: "sop_change" | "announcement" | "signature" | "leave_approved" | "leave_rejected" | "movement_approved" | "movement_rejected" | "qs_approved" | "qs_rejected";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  relatedId?: string;
  priority: "low" | "normal" | "high" | "urgent";
}

export interface MovementRegister {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  date: string;
  departureTime: string;
  expectedReturnTime: string;
  actualReturnTime?: string;
  destination: string;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "completed";
  submittedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  divisionHead?: string;
}
