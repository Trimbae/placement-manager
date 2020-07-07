export interface User {
  name: string;
  universityId: string;
  email: string;
  studentData: StudentData;
  tasksCompleted: string[];
  accessLevel: AccessLevel;
  userType: string;
  feedback: FeedbackData[];
  jobTitle: string;
  startDate: Date;
}

export interface AccessLevel {
  isAdmin: boolean;
  isSupervisor: boolean;
}

export interface FeedbackData {
  taskId: string;
  mark: number;
  comments: string;
}

export interface StudentData {
  supervisorName: string;
  supervisorId: string;
  moderatorName: string;
  moderatorId: string;
  placementProvider: string;
  workplaceSupervisor: string;
  startDate: Date;
}

