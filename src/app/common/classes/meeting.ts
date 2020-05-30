export interface Meeting {
  _id: string;
  name: string;
  studentId: string;
  supervisorId: string;
  taskId: number;
  time: Date;
  location: string;
  approved: boolean;
}
