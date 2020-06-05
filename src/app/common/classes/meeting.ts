export interface Meeting {
  _id: string;
  name: string;
  studentId: string;
  supervisorId: string;
  taskId: string;
  time: Date;
  location: string;
  approved: boolean;
}
