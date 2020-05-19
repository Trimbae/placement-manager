export interface Task {
  date: Date;
  isPublished: boolean;
  displayName: string;
  name: string;
  orderIndex: number;
  taskId: number;
  type: string;
  uploadInfo: UploadInfo;
}

export interface UploadInfo {
  uploadType: string;
  marksAvailable: number;
}
