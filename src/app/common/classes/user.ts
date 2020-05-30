export interface User {
  name: string;
  universityId: string;
  email: string;
  studentData: StudentData;
  tasksCompleted: number[];
  accessLevel: AccessLevel;
  userType: string;
  feedback: FeedbackData[];
}

export interface AccessLevel {
  isAdmin: boolean;
  isSupervisor: boolean;
}

export interface FeedbackData {
  taskId: number;
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

