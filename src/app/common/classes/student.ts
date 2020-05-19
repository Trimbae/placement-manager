export interface Student {
  name: string;
  universityId: string;
  email: string;
  studentData: StudentData;
  tasksCompleted: number[];
  accessLevel: AccessLevel;
  userType: string;
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

export interface AccessLevel {
  isAdmin: boolean;
  isSupervisor: boolean;
}
