import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks = [
    {
      id: 1,
      name: 'induction-checklist',
      type: 'upload',
      uploadInfo: {
        uploadType: 'Supporting Document',
        dueDate: new Date(2021, 1, 1, 23),
        marksAvailable: null
      },
      displayName: 'Upload induction checklist',
      isCompleted: true
    },
    {
      id: 2,
      name: 'authorisation-letter',
      type: 'upload',
      uploadInfo: {
        uploadType: 'Supporting Document',
        dueDate: new Date(2021, 1, 1, 23),
        marksAvailable: null
      },
      displayName: 'Upload authorisation letter',
      isCompleted: true
    },
    {
      id: 3,
      name: 'supervisor-meeting-1',
      type: 'meeting',
      displayName: 'Schedule supervisor meeting',
      isCompleted: true
    },
    {
      id: 4,
      name: 'employer-evaluation',
      type: 'upload',
      uploadInfo: {
        uploadType: 'Supporting Document',
        dueDate: new Date(2021, 1, 1, 23),
        marksAvailable: null
      },
      displayName: 'Upload Employer Evaluation Form',
      isCompleted: false
    },
    {
      id: 5,
      name: 'sfia-mapping',
      type: 'upload',
      uploadInfo: {
        uploadType: 'Supporting Document',
        dueDate: new Date(2021, 1, 1, 23),
        marksAvailable: null
      },
      displayName: 'Upload SFIA Mapping Document',
      isCompleted: false
    },
    {
      id: 6,
      name: 'supervisor-meeting-2',
      type: 'meeting',
      displayName: 'Schedule supervisor meeting',
      isCompleted: false
    }];
  constructor() { }

  getTasks() {
    return this.tasks;
  }

  getTaskById(id: number) {
    for (const task of this.tasks) {
      if (task.id === id) {
        return task;
      }
    }
    return null;
  }

  markTaskCompletedById(id: number) {
    for (const task of this.tasks) {
      if (task.id === id) {
        task.isCompleted = true;
      }
    }
  }
}
