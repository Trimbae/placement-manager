export interface Task {
  date: Date;
  isPublished: boolean;
  displayName: string;
  description: string;
  name: string;
  dueDateTime: Date;
  orderIndex: number;
  taskId: string;
  type: string;
  uploadInfo: UploadInfo;
}

export interface UploadInfo {
  uploadType: string;
  marksAvailable: number;
}
